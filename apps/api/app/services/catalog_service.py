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

    def delete_product(self, product_slug: str) -> None:
        """Delete a product by slug"""
        self.repository.delete_product(product_slug)

    def update_product_image(self, product_slug: str, image_url: str) -> AdminProductResponse:
        """Update product image URL"""
        return AdminProductResponse(product=self.repository.update_product_image(product_slug, image_url))

    def upload_product_image(self, product_slug: str, filename: str, file_bytes: bytes, content_type: str) -> AdminProductResponse:
        """Upload product image to storage and update URL"""
        public_url = self.repository.upload_product_image(product_slug, filename, file_bytes, content_type)
        return AdminProductResponse(product=self.repository.get_product(product_slug))

    def upload_variant_image(self, product_slug: str, variant_id: str, filename: str, file_bytes: bytes, content_type: str) -> AdminVariantResponse:
        """Upload variant image to storage and update URL"""
        self.repository.upload_variant_image(product_slug, variant_id, filename, file_bytes, content_type)
        # Find the updated variant
        product = self.repository.get_product(product_slug)
        for v in product.variants:
            if v.id == variant_id:
                return AdminVariantResponse(variant=v)
        raise Exception("Variant not found after upload")

