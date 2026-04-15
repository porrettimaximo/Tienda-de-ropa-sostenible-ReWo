from app.domain import ProductDetail, ProductSummary, ProductVariant
from app.repositories.base import EcommerceRepository
from app.schemas import AdminProductResponse, AdminVariantResponse, ProductUpsertRequest, VariantUpsertRequest


class CatalogService:
    def __init__(self, repository: EcommerceRepository) -> None:
        self.repository = repository

    def list_products(self) -> list[ProductSummary]:
        return self.repository.list_products()

    def list_admin_products(self) -> list[ProductDetail]:
        return self.repository.list_product_details()

    def get_product(self, product_slug: str) -> ProductDetail:
        return self.repository.get_product(product_slug)

    def get_product_variants(self, product_slug: str) -> list[ProductVariant]:
        return self.repository.get_product(product_slug).variants

    def create_product(self, payload: ProductUpsertRequest) -> AdminProductResponse:
        return AdminProductResponse(product=self.repository.create_product(payload))

    def update_product(self, product_slug: str, payload: ProductUpsertRequest) -> AdminProductResponse:
        return AdminProductResponse(product=self.repository.update_product(product_slug, payload))

    def create_variant(self, product_slug: str, payload: VariantUpsertRequest) -> AdminVariantResponse:
        return AdminVariantResponse(variant=self.repository.create_variant(product_slug, payload))

    def update_variant(self, product_slug: str, variant_id: str, payload: VariantUpsertRequest) -> AdminVariantResponse:
        return AdminVariantResponse(variant=self.repository.update_variant(product_slug, variant_id, payload))
