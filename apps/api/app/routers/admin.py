from fastapi import APIRouter, Depends

from app.domain import ProductDetail
from app.schemas import (
    AdminProductResponse,
    AdminVariantResponse,
    ProductUpsertRequest,
    VariantUpsertRequest,
)
from app.services.catalog_service import CatalogService
from app.services.dependencies import get_catalog_service

router = APIRouter(prefix="/admin", tags=["admin"])


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
