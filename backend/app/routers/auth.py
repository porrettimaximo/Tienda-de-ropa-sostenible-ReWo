from fastapi import APIRouter, Depends

from app.schemas import LoginRequest, LoginResponse, RegisterRequest
from app.services.auth_service import AuthService
from app.services.dependencies import get_auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login/client", response_model=LoginResponse)
def login_client(
    payload: LoginRequest, service: AuthService = Depends(get_auth_service)
) -> LoginResponse:
    return service.login_client(payload)


@router.post("/login/admin", response_model=LoginResponse)
def login_admin(
    payload: LoginRequest, service: AuthService = Depends(get_auth_service)
) -> LoginResponse:
    return service.login_admin(payload)


@router.post("/register", response_model=LoginResponse)
def register_client(
    payload: RegisterRequest, service: AuthService = Depends(get_auth_service)
) -> LoginResponse:
    return service.register_client(payload)
