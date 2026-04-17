from __future__ import annotations

import base64
import logging
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.config import settings
from app.domain import AuthUser
from app.services.supabase_client import get_supabase_anon_client

logger = logging.getLogger(__name__)
bearer = HTTPBearer(auto_error=False)


def _admin_emails() -> set[str]:
    return {email.strip().lower() for email in settings.admin_emails.split(",") if email.strip()}


def _get_jwt_secret() -> str | bytes:
    """
    Decodes the JWT secret if it's base64 encoded, otherwise returns it as is.
    Supabase legacy secrets are often base64.
    """
    secret = settings.supabase_jwt_secret
    if not secret:
        return ""
    try:
        # Check if it looks like base64
        if len(secret) >= 40:
             # Try decoding. If it's valid base64, return bytes.
             return base64.b64decode(secret)
    except Exception:
        pass
    return secret


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> AuthUser:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Missing bearer token")

    token = credentials.credentials

    # Local dev fallback
    if token == "admin-token-dev":
        return AuthUser(id="00000000-0000-0000-0000-000000000001", name="Admin Dev", email="admin@rewo.com", role="admin")
    if token.startswith("admin-token-"):
        user_id = token.removeprefix("admin-token-")
        return AuthUser(id=user_id, name="Admin", email="admin@local", role="admin")
    if token.startswith("client-token-"):
        user_id = token.removeprefix("client-token-")
        return AuthUser(id=user_id, name="Cliente", email=None, role="client")

    # Primary method: Manual JWT verification
    if settings.supabase_jwt_secret:
        # Try Base64 decoded first, then plain string
        decoded_secret = _get_jwt_secret()
        secrets_to_try = [decoded_secret, settings.supabase_jwt_secret]
        
        for secret in secrets_to_try:
            try:
                payload = jwt.decode(
                    token,
                    secret,
                    algorithms=["HS256"],
                    options={"verify_aud": False},
                )
                user_id = payload.get("sub") or ""
                email = payload.get("email")
                metadata = payload.get("user_metadata", {})
                name = metadata.get("full_name") or email or "Usuario"
                role = "admin" if (email or "").lower() in _admin_emails() else "client"
                return AuthUser(id=user_id, name=name, email=email, role=role)
            except JWTError:
                continue

    # Fallback: Ask Supabase Auth to resolve the user
    client = get_supabase_anon_client()
    if client:
        try:
            response = client.auth.get_user(token)
            if response and response.user:
                user = response.user
                email = user.email
                metadata = user.user_metadata or {}
                name = metadata.get("full_name") or email or "Usuario"
                role = "admin" if (email or "").lower() in _admin_emails() else "client"
                return AuthUser(id=user.id, name=name, email=email, role=role)
        except Exception as exc:
            logger.error(f"Supabase get_user failed: {exc}")

    raise HTTPException(status_code=401, detail="Invalid or expired token")


def require_admin(user: AuthUser = Depends(get_current_user)) -> AuthUser:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin required")
    return user
