from app.repositories.base import EcommerceRepository
from app.schemas import CheckoutRequest, CheckoutResponse


class SalesService:
    def __init__(self, repository: EcommerceRepository) -> None:
        self.repository = repository

    def checkout_online(self, payload: CheckoutRequest) -> CheckoutResponse:
        return CheckoutResponse(order=self.repository.checkout(payload, sales_channel="online"))

    def checkout_store(self, payload: CheckoutRequest) -> CheckoutResponse:
        return CheckoutResponse(order=self.repository.checkout(payload, sales_channel="store"))
