from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers.health import router as health_router
from app.routers.loyalty import router as loyalty_router
from app.routers.products import router as products_router
from app.routers.reports import router as reports_router
from app.schemas import RootResponse

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


@app.get("/", response_model=RootResponse, tags=["root"])
def root() -> RootResponse:
    return RootResponse(
        message="ReWo API operativa",
        version="0.1.0",
        modules=["products", "loyalty", "reports", "health"],
    )

app.include_router(health_router)
app.include_router(products_router)
app.include_router(loyalty_router)
app.include_router(reports_router)
