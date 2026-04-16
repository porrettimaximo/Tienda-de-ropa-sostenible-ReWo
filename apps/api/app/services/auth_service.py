from fastapi import HTTPException

from app.domain import AuthUser
from app.repositories.base import EcommerceRepository
from app.schemas import LoginRequest, LoginResponse, RegisterRequest
from app.services.supabase_client import get_supabase_anon_client
from app.config import settings


class AuthService:
    def __init__(self, repository: EcommerceRepository) -> None:
        self.repository = repository
        self.supabase_anon = get_supabase_anon_client()

    def login_client(self, payload: LoginRequest) -> LoginResponse:
        # Prefer Supabase Auth when configured, fallback to repository demo auth.
        if self.supabase_anon is not None and settings.supabase_url and settings.supabase_key:
            try:
                session = self.supabase_anon.auth.sign_in_with_password(
                    {"email": payload.identifier, "password": payload.password}
                ).session
            except Exception as exc:  # noqa: BLE001
                raise HTTPException(status_code=401, detail="No se pudo iniciar sesion") from exc

            if session is None:
                raise HTTPException(status_code=401, detail="No se pudo iniciar sesion")

            # If the customer exists in our DB, keep that id; else use Supabase user id.
            try:
                repo_user = self.repository.authenticate_client(payload.identifier, payload.password)
                user_id = repo_user.id
            except Exception:
                user_id = session.user.id

            user = AuthUser(
                id=user_id,
                name=session.user.user_metadata.get("full_name") if session.user.user_metadata else None
                or payload.identifier,
                email=session.user.email,
                role="client",
            )
            return LoginResponse(access_token=session.access_token, user=user)

        user = self.repository.authenticate_client(payload.identifier, payload.password)
        return LoginResponse(access_token=f"client-token-{user.id}", user=user)

    def login_admin(self, payload: LoginRequest) -> LoginResponse:
        if self.supabase_anon is not None and settings.supabase_url and settings.supabase_key:
            try:
                session = self.supabase_anon.auth.sign_in_with_password(
                    {"email": payload.identifier, "password": payload.password}
                ).session
            except Exception as exc:  # noqa: BLE001
                raise HTTPException(status_code=401, detail="No se pudo iniciar sesion") from exc

            if session is None:
                raise HTTPException(status_code=401, detail="No se pudo iniciar sesion")

            admin_emails = {email.strip().lower() for email in settings.admin_emails.split(",") if email.strip()}
            email = (session.user.email or "").lower()
            if email not in admin_emails:
                raise HTTPException(status_code=403, detail="Admin required")

            user = AuthUser(
                id=session.user.id,
                name=session.user.user_metadata.get("full_name") if session.user.user_metadata else None
                or payload.identifier,
                email=session.user.email,
                role="admin",
            )
            return LoginResponse(access_token=session.access_token, user=user)

        user = self.repository.authenticate_admin(payload.identifier, payload.password)
        return LoginResponse(access_token=f"admin-token-{user.id}", user=user)

    def register_client(self, payload: RegisterRequest) -> LoginResponse:
        if self.supabase_anon is not None and settings.supabase_url and settings.supabase_key:
            try:
                self.supabase_anon.auth.sign_up(
                    {
                        "email": payload.email,
                        "password": payload.password,
                        "options": {"data": {"full_name": payload.full_name}},
                    }
                )

                session = self.supabase_anon.auth.sign_in_with_password(
                    {"email": payload.email, "password": payload.password}
                ).session
            except Exception as exc:  # noqa: BLE001
                raise HTTPException(status_code=400, detail="No se pudo registrar") from exc

            if session is None:
                raise HTTPException(status_code=400, detail="Registro pendiente (verifica email)")

            try:
                customer = self.repository.create_customer(full_name=payload.full_name, email=payload.email)
                user_id = customer.id
            except Exception:
                user_id = session.user.id

            user = AuthUser(
                id=user_id,
                name=payload.full_name,
                email=session.user.email,
                role="client",
            )
            return LoginResponse(access_token=session.access_token, user=user)

        customer = self.repository.create_customer(full_name=payload.full_name, email=payload.email)
        user = AuthUser(id=customer.id, name=customer.full_name, email=customer.email, role="client")
        return LoginResponse(access_token=f"client-token-{user.id}", user=user)
