from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    environment: str
    supabase_configured: bool


class RootResponse(BaseModel):
    message: str
    version: str
    modules: list[str]
