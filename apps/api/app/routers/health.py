from fastapi import APIRouter

from app.schemas import HealthResponse
from app.services.supabase_client import get_supabase_client
from app.config import settings

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    supabase_client = get_supabase_client()
    return HealthResponse(
        status="ok",
        environment=settings.env,
        supabase_configured=supabase_client is not None,
    )
