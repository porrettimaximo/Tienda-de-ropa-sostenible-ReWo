from fastapi import APIRouter, Depends, UploadFile, File

from app.domain import Category, ProductDetail, Promotion, Supplier
from app.security import require_admin
from app.schemas import (
    AdminProductResponse,
    AdminPromotionResponse,
    AdminVariantResponse,
    ProductUpsertRequest,
    PromotionUpsertRequest,
    SupplierUpsertRequest,
    VariantUpsertRequest,
)
from app.services.catalog_service import CatalogService
from app.services.dependencies import get_catalog_service, get_promotions_service, get_suppliers_service
from app.services.promotions_service import PromotionsService
from app.services.suppliers_service import SuppliersService

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin)])


@router.get("/products", response_model=list[ProductDetail])
def list_admin_products(
    service: CatalogService = Depends(get_catalog_service),
) -> list[ProductDetail]:
    return service.list_admin_products()


@router.post("/products", response_model=AdminProductResponse)
def create_product(
    payload: ProductUpsertRequest,
    service: CatalogService = Depends(get_catalog_service),
) -> AdminProductResponse:
    return service.create_product(payload)


@router.put("/products/{product_slug}", response_model=AdminProductResponse)
def update_product(
    product_slug: str,
    payload: ProductUpsertRequest,
    service: CatalogService = Depends(get_catalog_service),
) -> AdminProductResponse:
    return service.update_product(product_slug, payload)


@router.post("/products/{product_slug}/variants", response_model=AdminVariantResponse)
def create_variant(
    product_slug: str,
    payload: VariantUpsertRequest,
    service: CatalogService = Depends(get_catalog_service),
) -> AdminVariantResponse:
    return service.create_variant(product_slug, payload)


@router.put(
    "/products/{product_slug}/variants/{variant_id}", response_model=AdminVariantResponse
)
def update_variant(
    product_slug: str,
    variant_id: str,
    payload: VariantUpsertRequest,
    service: CatalogService = Depends(get_catalog_service),
) -> AdminVariantResponse:
    return service.update_variant(product_slug, variant_id, payload)


@router.get("/promotions", response_model=list[Promotion])
def list_admin_promotions(
    active_only: bool = False,
    service: PromotionsService = Depends(get_promotions_service),
):
    return service.list_promotions(active_only=active_only)


@router.post("/promotions", response_model=AdminPromotionResponse)
def create_promotion(
    payload: PromotionUpsertRequest,
    service: PromotionsService = Depends(get_promotions_service),
) -> AdminPromotionResponse:
    return service.create_promotion(payload)


@router.put("/promotions/{promotion_id}", response_model=AdminPromotionResponse)
def update_promotion(
    promotion_id: str,
    payload: PromotionUpsertRequest,
    service: PromotionsService = Depends(get_promotions_service),
) -> AdminPromotionResponse:
    return service.update_promotion(promotion_id, payload)


@router.put("/promotions/{promotion_id}/active", response_model=AdminPromotionResponse)
def set_promotion_active(
    promotion_id: str,
    is_active: bool,
    service: PromotionsService = Depends(get_promotions_service),
) -> AdminPromotionResponse:
    return service.set_active(promotion_id, is_active=is_active)


@router.get("/suppliers", response_model=list[Supplier])
def list_suppliers(
    service: SuppliersService = Depends(get_suppliers_service),
) -> list[Supplier]:
    return service.list_suppliers()


@router.post("/suppliers", response_model=Supplier)
def create_supplier(
    payload: SupplierUpsertRequest,
    service: SuppliersService = Depends(get_suppliers_service),
) -> Supplier:
    return service.create_supplier(payload)


@router.put("/suppliers/{supplier_id}", response_model=Supplier)
def update_supplier(
    supplier_id: str,
    payload: SupplierUpsertRequest,
    service: SuppliersService = Depends(get_suppliers_service),
) -> Supplier:
    return service.update_supplier(supplier_id, payload)


@router.delete("/suppliers/{supplier_id}")
def delete_supplier(
    supplier_id: str,
    service: SuppliersService = Depends(get_suppliers_service),
) -> dict:
    """Delete a supplier by ID"""
    service.delete_supplier(supplier_id)
    return {"message": "Supplier deleted successfully"}


@router.delete("/products/{product_slug}")
def delete_product(
    product_slug: str,
    service: CatalogService = Depends(get_catalog_service),
) -> dict:
    """Delete a product by slug"""
    service.delete_product(product_slug)
    return {"message": "Product deleted successfully"}


@router.put("/products/{product_slug}/image")
def update_product_image(
    product_slug: str,
    image_url: str,
    service: CatalogService = Depends(get_catalog_service),
) -> AdminProductResponse:
    """Update product image URL"""
    return service.update_product_image(product_slug, image_url)


@router.post("/products/{product_slug}/image/upload", response_model=AdminProductResponse)
async def upload_product_image(
    product_slug: str,
    file: UploadFile = File(...),
    service: CatalogService = Depends(get_catalog_service),
) -> AdminProductResponse:
    """Upload product image to storage and update URL"""
    file_bytes = await file.read()
    content_type = file.content_type or "image/jpeg"
    return service.upload_product_image(product_slug, file.filename, file_bytes, content_type)
    

@router.post("/products/{product_slug}/variants/{variant_id}/image/upload", response_model=AdminVariantResponse)
async def upload_variant_image(
    product_slug: str,
    variant_id: str,
    file: UploadFile = File(...),
    service: CatalogService = Depends(get_catalog_service),
) -> AdminVariantResponse:
    """Upload variant image to storage and update URL"""
    file_bytes = await file.read()
    content_type = file.content_type or "image/jpeg"
    return service.upload_variant_image(product_slug, variant_id, file.filename, file_bytes, content_type)


@router.get("/categories", response_model=list[Category])
def list_categories(
    service: CatalogService = Depends(get_catalog_service),
) -> list[Category]:
    return service.list_categories()


