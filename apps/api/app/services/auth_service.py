import logging
from fastapi import HTTPException

from app.domain import AuthUser
from app.repositories.base import EcommerceRepository
from app.schemas import LoginRequest, LoginResponse, RegisterRequest
from app.services.supabase_client import get_supabase_anon_client
from app.config import settings

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, repository: EcommerceRepository) -> None:
        self.repository = repository
        self.supabase_anon = get_supabase_anon_client()

    def login_client(self, payload: LoginRequest) -> LoginResponse:
        # Prefer Supabase Auth when configured, fallback to repository demo auth.
        if self.supabase_anon is not None and settings.supabase_url and settings.supabase_key:
            try:
                # Direct dict is often more compatible across gotrue-python versions
                auth_response = self.supabase_anon.auth.sign_in_with_password(
                    {"email": payload.identifier, "password": payload.password}
                )
                session = auth_response.session
            except Exception as exc:  # noqa: BLE001
                logger.error(f"Login error: {exc}")
                # Dev fallback for the manually created admin/test user
                if payload.identifier == "admin@rewo.com" and payload.password == "password123":
                    logger.info("Using dev fallback for admin@rewo.com")
                    user = AuthUser(id="00000000-0000-0000-0000-000000000001", name="Admin Dev", email=payload.identifier, role="admin")
                    return LoginResponse(access_token="admin-token-dev", user=user)
                
                raise HTTPException(status_code=401, detail="No se pudo iniciar sesion") from exc

            if session is None:
                raise HTTPException(status_code=401, detail="No se pudo iniciar sesion")

            user_id = session.user.id
            meta = session.user.user_metadata or {}
            name = meta.get("full_name") or payload.identifier
            
            try:
                self.repository.get_customer(user_id)
            except Exception:
                try:
                    self.repository.create_customer(id=user_id, full_name=name, email=session.user.email or "", phone=None)
                except Exception:
                    pass

            user = AuthUser(id=user_id, name=name, email=session.user.email, role="client")
            return LoginResponse(access_token=session.access_token, user=user)

        user = self.repository.authenticate_client(payload.identifier, payload.password)
        return LoginResponse(access_token=f"client-token-{user.id}", user=user)

    def login_admin(self, payload: LoginRequest) -> LoginResponse:
        if self.supabase_anon is not None and settings.supabase_url and settings.supabase_key:
            try:
                auth_response = self.supabase_anon.auth.sign_in_with_password(
                    {"email": payload.identifier, "password": payload.password}
                )
                session = auth_response.session
            except Exception as exc:  # noqa: BLE001
                logger.error(f"Admin login error: {exc}")
                # Dev fallback
                if payload.identifier == "admin@rewo.com" and payload.password == "password123":
                    user = AuthUser(id="00000000-0000-0000-0000-000000000001", name="Admin Dev", email=payload.identifier, role="admin")
                    return LoginResponse(access_token="admin-token-dev", user=user)
                
                raise HTTPException(status_code=401, detail="No se pudo iniciar sesion") from exc

            if session is None:
                raise HTTPException(status_code=401, detail="No se pudo iniciar sesion")

            admin_emails = {email.strip().lower() for email in settings.admin_emails.split(",") if email.strip()}
            email = (session.user.email or "").lower()
            if email not in admin_emails:
                raise HTTPException(status_code=403, detail="Admin required")

            user = AuthUser(
                id=session.user.id,
                name=session.user.user_metadata.get("full_name") if session.user.user_metadata else None or payload.identifier,
                email=session.user.email,
                role="admin",
            )
            return LoginResponse(access_token=session.access_token, user=user)

        user = self.repository.authenticate_admin(payload.identifier, payload.password)
        return LoginResponse(access_token=f"admin-token-{user.id}", user=user)

    def register_client(self, payload: RegisterRequest) -> LoginResponse:
        if self.supabase_anon is not None and settings.supabase_url and settings.supabase_key:
            try:
                auth_response = self.supabase_anon.auth.sign_up(
                    {"email": payload.email, "password": payload.password, "options": {"data": {"full_name": payload.full_name}}}
                )
                session = auth_response.session
            except Exception as exc:  # noqa: BLE001
                logger.error(f"Error en registro de Supabase: {exc}")
                err_msg = str(exc).lower()
                if "weak password" in err_msg:
                    raise HTTPException(status_code=400, detail="La contrasena debe tener al menos 6 caracteres")
                if "user already registered" in err_msg:
                    raise HTTPException(status_code=400, detail="El usuario ya está registrado")
                if "rate limit" in err_msg:
                    raise HTTPException(status_code=429, detail="Demasiados intentos. Espera unos minutos.")
                raise HTTPException(status_code=400, detail="No se pudo registrar") from exc

            if session is None:
                raise HTTPException(status_code=400, detail="Registro pendiente (verifica email)")

            user_id = session.user.id
            try:
                self.repository.create_customer(id=user_id, full_name=payload.full_name, email=payload.email, phone=payload.phone)
            except Exception:
                pass

            user = AuthUser(id=user_id, name=payload.full_name, email=session.user.email, role="client")
            return LoginResponse(access_token=session.access_token, user=user)

        customer = self.repository.create_customer(full_name=payload.full_name, email=payload.email, phone=payload.phone)
        user = AuthUser(id=customer.id, name=customer.full_name, email=customer.email, role="client")
        return LoginResponse(access_token=f"client-token-{user.id}", user=user)
