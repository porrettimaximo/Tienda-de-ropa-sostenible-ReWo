from fastapi import APIRouter, HTTPException

from app.data import PRODUCTS, get_product_summaries
from app.domain import ProductDetail, ProductSummary, ProductVariant

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductSummary])
def list_products() -> list[ProductSummary]:
    return get_product_summaries()


@router.get("/{product_slug}", response_model=ProductDetail)
def get_product(product_slug: str) -> ProductDetail:
    for product in PRODUCTS:
        if product.slug == product_slug:
            return product
    raise HTTPException(status_code=404, detail="Producto no encontrado")


@router.get("/{product_slug}/variants", response_model=list[ProductVariant])
def get_product_variants(product_slug: str) -> list[ProductVariant]:
    for product in PRODUCTS:
        if product.slug == product_slug:
            return product.variants
    raise HTTPException(status_code=404, detail="Producto no encontrado")
