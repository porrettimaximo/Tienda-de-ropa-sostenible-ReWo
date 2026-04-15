from fastapi import APIRouter

from app.domain import LoyaltyCustomer
from app.services.store_service import store

router = APIRouter(prefix="/loyalty", tags=["loyalty"])


@router.get("/customers/{customer_id}", response_model=LoyaltyCustomer)
def get_loyalty_customer(customer_id: str) -> LoyaltyCustomer:
    return store.get_customer(customer_id)
