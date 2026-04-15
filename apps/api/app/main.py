from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.schemas import HealthResponse
from app.services.supabase_client import get_supabase_client

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="API inicial para la prueba tecnica de ReWo."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["root"])
def root():
    return {"message": "ReWo API operativa"}


@app.get("/health", response_model=HealthResponse, tags=["health"])
def health_check() -> HealthResponse:
    supabase_client = get_supabase_client()
    return HealthResponse(
        status="ok",
        environment=settings.env,
        supabase_configured=supabase_client is not None
    )
