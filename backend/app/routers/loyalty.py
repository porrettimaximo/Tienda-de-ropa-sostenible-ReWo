from fastapi import APIRouter, Depends, HTTPException

from app.domain import AuthUser, LoyaltyCustomer, OrderSummary
from app.schemas import CustomerUpdateRequest
from app.security import get_current_user
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


@router.get("/orders/{order_id}", response_model=OrderSummary)
def get_loyalty_order(
    order_id: str, service: ReportingService = Depends(get_reporting_service)
) -> OrderSummary:
    order = service.get_order(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/customers/{customer_id}", response_model=LoyaltyCustomer)
def update_loyalty_customer(
    customer_id: str,
    payload: CustomerUpdateRequest,
    service: ReportingService = Depends(get_reporting_service),
    user: AuthUser = Depends(get_current_user),
) -> LoyaltyCustomer:
    if user.role == "admin" or user.id == customer_id:
        return service.update_customer(customer_id, payload)

    current = service.get_customer(customer_id)
    if user.email and current.email and user.email.lower() == current.email.lower():
        return service.update_customer(customer_id, payload)

    raise HTTPException(status_code=403, detail="Forbidden")
