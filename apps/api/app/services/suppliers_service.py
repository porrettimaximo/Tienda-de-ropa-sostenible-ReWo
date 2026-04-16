from app.domain import Supplier
from app.repositories.base import EcommerceRepository
from app.schemas import SupplierUpsertRequest


class SuppliersService:
    def __init__(self, repository: EcommerceRepository) -> None:
        self.repository = repository

    def list_suppliers(self) -> list[Supplier]:
        return self.repository.list_suppliers()

    def create_supplier(self, payload: SupplierUpsertRequest) -> Supplier:
        return self.repository.create_supplier(payload)

    def update_supplier(self, supplier_id: str, payload: SupplierUpsertRequest) -> Supplier:
        return self.repository.update_supplier(supplier_id, payload)

