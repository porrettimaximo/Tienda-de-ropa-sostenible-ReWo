from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class AppliedPromotion:
    label: str
    discount_total: float


def apply_combo_promotion(
    *,
    subtotal: float,
    product_slugs: list[str],
    min_subtotal: float = 5000,
    min_distinct_products: int = 2,
    discount_amount: float = 350,
) -> AppliedPromotion | None:
    """Simple combo rule used by the technical test.

    - Requires at least N distinct products in cart
    - Requires subtotal threshold
    - Applies a fixed discount capped by subtotal
    """

    if subtotal < min_subtotal:
        return None
    if len(set(product_slugs)) < min_distinct_products:
        return None

    discount_total = min(discount_amount, subtotal)
    if discount_total <= 0:
        return None

    return AppliedPromotion(label="Combo de temporada", discount_total=discount_total)

