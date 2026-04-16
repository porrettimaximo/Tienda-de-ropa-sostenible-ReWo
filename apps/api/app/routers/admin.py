from fastapi import APIRouter, Depends

from app.domain import ProductDetail, Promotion
from app.schemas import (
    AdminProductResponse,
    AdminPromotionResponse,
    AdminVariantResponse,
    ProductUpsertRequest,
    PromotionUpsertRequest,
    VariantUpsertRequest,
)
from app.services.catalog_service import CatalogService
from app.services.dependencies import get_catalog_service, get_promotions_service
from app.services.promotions_service import PromotionsService

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
