from fastapi import APIRouter

from app.data import SALES_REPORT
from app.domain import SalesByVariantReport

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/sales-by-size-color", response_model=list[SalesByVariantReport])
def get_sales_by_size_color() -> list[SalesByVariantReport]:
    return SALES_REPORT
