from fastapi import APIRouter

from app.domain import ProductDetail, ProductSummary, ProductVariant
from app.services.store_service import store

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductSummary])
def list_products() -> list[ProductSummary]:
    return store.list_products()


@router.get("/{product_slug}", response_model=ProductDetail)
def get_product(product_slug: str) -> ProductDetail:
    return store.get_product(product_slug)


@router.get("/{product_slug}/variants", response_model=list[ProductVariant])
def get_product_variants(product_slug: str) -> list[ProductVariant]:
    return store.get_product(product_slug).variants
