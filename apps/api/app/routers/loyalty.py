from fastapi import APIRouter, Depends

from app.domain import LoyaltyCustomer
from app.services.dependencies import get_reporting_service
from app.services.reporting_service import ReportingService

router = APIRouter(prefix="/loyalty", tags=["loyalty"])


@router.get("/customers/{customer_id}", response_model=LoyaltyCustomer)
def get_loyalty_customer(
    customer_id: str, service: ReportingService = Depends(get_reporting_service)
) -> LoyaltyCustomer:
    return service.get_customer(customer_id)
