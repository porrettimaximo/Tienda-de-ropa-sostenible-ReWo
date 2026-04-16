from fastapi import APIRouter, Depends

from app.domain import LoyaltyCustomer, OrderSummary
from app.services.dependencies import get_reporting_service
from app.services.reporting_service import ReportingService

router = APIRouter(prefix="/loyalty", tags=["loyalty"])


@router.get("/customers/{customer_id}", response_model=LoyaltyCustomer)
def get_loyalty_customer(
    customer_id: str, service: ReportingService = Depends(get_reporting_service)
) -> LoyaltyCustomer:
    return service.get_customer(customer_id)


@router.get("/customers/{customer_id}/orders", response_model=list[OrderSummary])
def get_loyalty_customer_orders(
    customer_id: str, service: ReportingService = Depends(get_reporting_service)
) -> list[OrderSummary]:
    return service.get_customer_orders(customer_id)
