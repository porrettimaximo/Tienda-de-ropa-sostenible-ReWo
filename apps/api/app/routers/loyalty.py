from fastapi import APIRouter, HTTPException

from app.data import LOYALTY_CUSTOMERS
from app.domain import LoyaltyCustomer

router = APIRouter(prefix="/loyalty", tags=["loyalty"])


@router.get("/customers/{customer_id}", response_model=LoyaltyCustomer)
def get_loyalty_customer(customer_id: str) -> LoyaltyCustomer:
    for customer in LOYALTY_CUSTOMERS:
        if customer.id == customer_id:
            return customer
    raise HTTPException(status_code=404, detail="Cliente no encontrado")
