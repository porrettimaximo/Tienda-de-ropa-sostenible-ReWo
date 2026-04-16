from datetime import datetime

from app.domain import LoyaltyCustomer, OrderSummary, Promotion, SalesByVariantReport, SalesKpisReport
from app.repositories.base import EcommerceRepository
from app.schemas import AdminOverviewResponse, CustomerUpdateRequest


class ReportingService:
    def __init__(self, repository: EcommerceRepository) -> None:
        self.repository = repository

    def get_customer(self, customer_id: str) -> LoyaltyCustomer:
        return self.repository.get_customer(customer_id)

    def get_customer_orders(self, customer_id: str) -> list[OrderSummary]:
        return self.repository.list_customer_orders(customer_id)

    def update_customer(self, customer_id: str, payload: CustomerUpdateRequest) -> LoyaltyCustomer:
        return self.repository.update_customer(
            customer_id,
            full_name=payload.full_name,
            email=payload.email,
            phone=payload.phone,
        )

    def list_promotions(self, active_only: bool = True) -> list[Promotion]:
        return self.repository.list_promotions(active_only=active_only)

    def get_sales_by_size_color(
        self,
        *,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        sales_channel: str | None = None,
    ) -> list[SalesByVariantReport]:
        if start_date or end_date or sales_channel:
            return self.repository.get_sales_report_filtered(
                start_date=start_date,
                end_date=end_date,
                sales_channel=sales_channel,
            )
        return self.repository.get_sales_report()

    def get_sales_kpis(
        self,
        *,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        sales_channel: str | None = None,
    ) -> SalesKpisReport:
        return self.repository.get_sales_kpis(
            start_date=start_date,
            end_date=end_date,
            sales_channel=sales_channel,
        )

    def get_overview(self) -> AdminOverviewResponse:
        return AdminOverviewResponse(overview=self.repository.get_admin_overview())
