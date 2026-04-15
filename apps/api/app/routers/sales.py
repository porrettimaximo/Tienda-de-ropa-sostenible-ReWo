from fastapi import APIRouter, Depends

from app.schemas import CheckoutRequest, CheckoutResponse
from app.services.dependencies import get_sales_service
from app.services.sales_service import SalesService

router = APIRouter(tags=["sales"])


@router.post("/checkout", response_model=CheckoutResponse)
def checkout(
    payload: CheckoutRequest, service: SalesService = Depends(get_sales_service)
) -> CheckoutResponse:
    return service.checkout_online(payload)


@router.post("/sales/store", response_model=CheckoutResponse)
def create_store_sale(
    payload: CheckoutRequest, service: SalesService = Depends(get_sales_service)
) -> CheckoutResponse:
    return service.checkout_store(payload)
