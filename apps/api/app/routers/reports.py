from fastapi import APIRouter

from app.domain import SalesByVariantReport
from app.schemas import AdminOverviewResponse
from app.services.store_service import store

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/sales-by-size-color", response_model=list[SalesByVariantReport])
def get_sales_by_size_color() -> list[SalesByVariantReport]:
    return store.get_sales_report()


@router.get("/overview", response_model=AdminOverviewResponse)
def get_overview() -> AdminOverviewResponse:
    return AdminOverviewResponse(overview=store.get_admin_overview())
