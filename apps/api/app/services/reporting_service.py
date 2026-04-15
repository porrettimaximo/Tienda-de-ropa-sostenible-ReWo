from app.domain import LoyaltyCustomer, SalesByVariantReport
from app.repositories.base import EcommerceRepository
from app.schemas import AdminOverviewResponse


class ReportingService:
    def __init__(self, repository: EcommerceRepository) -> None:
        self.repository = repository

    def get_customer(self, customer_id: str) -> LoyaltyCustomer:
        return self.repository.get_customer(customer_id)

    def get_sales_by_size_color(self) -> list[SalesByVariantReport]:
        return self.repository.get_sales_report()

    def get_overview(self) -> AdminOverviewResponse:
        return AdminOverviewResponse(overview=self.repository.get_admin_overview())
