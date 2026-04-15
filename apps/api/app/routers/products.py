from fastapi import APIRouter, Depends

from app.domain import ProductDetail, ProductSummary, ProductVariant
from app.services.catalog_service import CatalogService
from app.services.dependencies import get_catalog_service

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductSummary])
def list_products(
    service: CatalogService = Depends(get_catalog_service),
) -> list[ProductSummary]:
    return service.list_products()


@router.get("/{product_slug}", response_model=ProductDetail)
def get_product(
    product_slug: str, service: CatalogService = Depends(get_catalog_service)
) -> ProductDetail:
    return service.get_product(product_slug)


@router.get("/{product_slug}/variants", response_model=list[ProductVariant])
def get_product_variants(
    product_slug: str, service: CatalogService = Depends(get_catalog_service)
) -> list[ProductVariant]:
    return service.get_product_variants(product_slug)
