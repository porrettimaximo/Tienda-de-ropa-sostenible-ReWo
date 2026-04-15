from app.repositories.base import EcommerceRepository
from app.schemas import LoginRequest, LoginResponse


class AuthService:
    def __init__(self, repository: EcommerceRepository) -> None:
        self.repository = repository

    def login_client(self, payload: LoginRequest) -> LoginResponse:
        user = self.repository.authenticate_client(payload.identifier, payload.password)
        return LoginResponse(access_token=f"client-token-{user.id}", user=user)

    def login_admin(self, payload: LoginRequest) -> LoginResponse:
        user = self.repository.authenticate_admin(payload.identifier, payload.password)
        return LoginResponse(access_token=f"admin-token-{user.id}", user=user)
