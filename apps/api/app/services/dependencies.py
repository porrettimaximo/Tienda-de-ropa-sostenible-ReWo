from app.repositories.supabase_repository import SupabaseRepository
from app.services.auth_service import AuthService
from app.services.catalog_service import CatalogService
from app.services.reporting_service import ReportingService
from app.services.promotions_service import PromotionsService
from app.services.sales_service import SalesService
from app.services.suppliers_service import SuppliersService

repository = SupabaseRepository()


def get_auth_service() -> AuthService:
    return AuthService(repository)


def get_catalog_service() -> CatalogService:
    return CatalogService(repository)


def get_sales_service() -> SalesService:
    return SalesService(repository)


def get_reporting_service() -> ReportingService:
    return ReportingService(repository)


def get_promotions_service() -> PromotionsService:
    return PromotionsService(repository)


def get_suppliers_service() -> SuppliersService:
    return SuppliersService(repository)
