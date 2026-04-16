from __future__ import annotations

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.config import settings
from app.domain import AuthUser
from app.services.supabase_client import get_supabase_anon_client

bearer = HTTPBearer(auto_error=False)


def _admin_emails() -> set[str]:
    return {email.strip().lower() for email in settings.admin_emails.split(",") if email.strip()}


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> AuthUser:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Missing bearer token")

    token = credentials.credentials

    if settings.supabase_jwt_secret:
        try:
            payload = jwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                options={"verify_aud": False},
            )
        except JWTError as exc:
            raise HTTPException(status_code=401, detail="Invalid token") from exc

        user_id = payload.get("sub") or ""
        email = payload.get("email")
        name = payload.get("user_metadata", {}).get("full_name") or payload.get("email") or "Usuario"
        role = "admin" if (email or "").lower() in _admin_emails() else "client"
        return AuthUser(id=user_id, name=name, email=email, role=role)

    # Fallback: ask Supabase Auth to resolve the user
    client = get_supabase_anon_client()
    if client is None:
        raise HTTPException(status_code=401, detail="Auth not configured")

    try:
        response = client.auth.get_user(token)
    except Exception as exc:  # noqa: BLE001 - surface as 401
        raise HTTPException(status_code=401, detail="Invalid token") from exc

    user = response.user
    email = user.email
    name = user.user_metadata.get("full_name") if user.user_metadata else None
    role = "admin" if (email or "").lower() in _admin_emails() else "client"
    return AuthUser(id=user.id, name=name or email or "Usuario", email=email, role=role)


def require_admin(user: AuthUser = Depends(get_current_user)) -> AuthUser:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin required")
    return user

