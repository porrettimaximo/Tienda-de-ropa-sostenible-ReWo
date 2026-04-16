from fastapi import APIRouter, Depends

from app.domain import Promotion
from app.services.dependencies import get_reporting_service
from app.services.reporting_service import ReportingService

router = APIRouter(prefix="/promotions", tags=["promotions"])


@router.get("", response_model=list[Promotion])
def list_promotions(
    active_only: bool = True,
    service: ReportingService = Depends(get_reporting_service),
) -> list[Promotion]:
    return service.list_promotions(active_only=active_only)

