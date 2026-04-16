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


def apply_best_promotion(
    *,
    subtotal: float,
    product_slugs: list[str],
    promotions: list[object],
) -> AppliedPromotion | None:
    """Compute the best discount among active promotions.

    Promotion objects are expected to have:
    - name
    - promotion_type: 'fixed' | 'percentage' | 'combo'
    - discount_value (float)
    """

    best: AppliedPromotion | None = None

    for promo in promotions:
        promo_type = getattr(promo, "promotion_type", None)
        discount_value = float(getattr(promo, "discount_value", 0) or 0)
        label = str(getattr(promo, "name", "Promocion"))

        candidate: AppliedPromotion | None = None
        if promo_type == "fixed":
            candidate = AppliedPromotion(label=label, discount_total=min(discount_value, subtotal))
        elif promo_type == "percentage":
            candidate = AppliedPromotion(label=label, discount_total=min(subtotal, subtotal * (discount_value / 100.0)))
        elif promo_type == "combo":
            candidate = apply_combo_promotion(
                subtotal=subtotal,
                product_slugs=product_slugs,
                discount_amount=discount_value or 350,
            )
            if candidate is not None:
                candidate = AppliedPromotion(label=label, discount_total=candidate.discount_total)

        if candidate is None or candidate.discount_total <= 0:
            continue

        if best is None or candidate.discount_total > best.discount_total:
            best = candidate

    return best
