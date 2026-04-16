from datetime import datetime

from fastapi import APIRouter, Depends

from app.domain import SalesByVariantReport, SalesKpisReport
from app.schemas import AdminOverviewResponse
from app.services.dependencies import get_reporting_service
from app.services.reporting_service import ReportingService

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/sales-by-size-color", response_model=list[SalesByVariantReport])
def get_sales_by_size_color(
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    sales_channel: str | None = None,
    service: ReportingService = Depends(get_reporting_service),
) -> list[SalesByVariantReport]:
    return service.get_sales_by_size_color(
        start_date=start_date,
        end_date=end_date,
        sales_channel=sales_channel,
    )


@router.get("/overview", response_model=AdminOverviewResponse)
def get_overview(
    service: ReportingService = Depends(get_reporting_service),
) -> AdminOverviewResponse:
    return service.get_overview()


@router.get("/kpis", response_model=SalesKpisReport)
def get_sales_kpis(
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    sales_channel: str | None = None,
    service: ReportingService = Depends(get_reporting_service),
) -> SalesKpisReport:
    return service.get_sales_kpis(
        start_date=start_date,
        end_date=end_date,
        sales_channel=sales_channel,
    )
