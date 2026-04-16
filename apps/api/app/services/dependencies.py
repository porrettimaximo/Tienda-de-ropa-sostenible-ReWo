from app.repositories.hybrid_repository import HybridRepository
from app.services.auth_service import AuthService
from app.services.catalog_service import CatalogService
from app.services.reporting_service import ReportingService
from app.services.promotions_service import PromotionsService
from app.services.sales_service import SalesService
from app.services.suppliers_service import SuppliersService

repository = HybridRepository()


def get_auth_service() -> AuthService:
    return AuthService(repository.backend())


def get_catalog_service() -> CatalogService:
    return CatalogService(repository.backend())


def get_sales_service() -> SalesService:
    return SalesService(repository.backend())


def get_reporting_service() -> ReportingService:
    return ReportingService(repository.backend())


def get_promotions_service() -> PromotionsService:
    return PromotionsService(repository.backend())


def get_suppliers_service() -> SuppliersService:
    return SuppliersService(repository.backend())
