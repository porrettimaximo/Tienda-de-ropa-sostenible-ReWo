from app.domain import Promotion
from app.repositories.base import EcommerceRepository
from app.schemas import AdminPromotionResponse, PromotionUpsertRequest


class PromotionsService:
    def __init__(self, repository: EcommerceRepository) -> None:
        self.repository = repository

    def list_promotions(self, active_only: bool = True) -> list[Promotion]:
        return self.repository.list_promotions(active_only=active_only)

    def create_promotion(self, payload: PromotionUpsertRequest) -> AdminPromotionResponse:
        return AdminPromotionResponse(promotion=self.repository.create_promotion(payload))

    def update_promotion(self, promotion_id: str, payload: PromotionUpsertRequest) -> AdminPromotionResponse:
        return AdminPromotionResponse(promotion=self.repository.update_promotion(promotion_id, payload))

    def set_active(self, promotion_id: str, is_active: bool) -> AdminPromotionResponse:
        return AdminPromotionResponse(promotion=self.repository.set_promotion_active(promotion_id, is_active))

