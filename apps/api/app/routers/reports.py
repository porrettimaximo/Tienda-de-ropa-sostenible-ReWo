from fastapi import APIRouter, Depends

from app.domain import SalesByVariantReport
from app.schemas import AdminOverviewResponse
from app.services.dependencies import get_reporting_service
from app.services.reporting_service import ReportingService

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/sales-by-size-color", response_model=list[SalesByVariantReport])
def get_sales_by_size_color(
    service: ReportingService = Depends(get_reporting_service),
) -> list[SalesByVariantReport]:
    return service.get_sales_by_size_color()


@router.get("/overview", response_model=AdminOverviewResponse)
def get_overview(
    service: ReportingService = Depends(get_reporting_service),
) -> AdminOverviewResponse:
    return service.get_overview()
