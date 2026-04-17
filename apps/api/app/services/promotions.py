from __future__ import annotations
from datetime import datetime, timezone
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

    return AppliedPromotion(label="Combo", discount_total=discount_total)


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
    - min_subtotal (float)
    - min_items (int)
    - ends_at (datetime | None)
    """

    best: AppliedPromotion | None = None
    now = datetime.now(timezone.utc)

    for promo in promotions:
        # Check expiration
        ends_at = getattr(promo, "ends_at", None)
        if ends_at:
            # Ensure ends_at is aware
            if ends_at.tzinfo is None:
                ends_at = ends_at.replace(tzinfo=timezone.utc)
            if now > ends_at:
                continue

        # Check starts_at
        starts_at = getattr(promo, "starts_at", None)
        if starts_at:
            if starts_at.tzinfo is None:
                starts_at = starts_at.replace(tzinfo=timezone.utc)
            if now < starts_at:
                continue

        promo_type = getattr(promo, "promotion_type", None)
        discount_value = float(getattr(promo, "discount_value", 0) or 0)
        label = str(getattr(promo, "name", "Promocion"))
        
        # New fields
        min_subtotal = float(getattr(promo, "min_subtotal", 0) or 0)
        min_items = int(getattr(promo, "min_items", 1) or 1)

        candidate: AppliedPromotion | None = None
        
        # All promotions now check min_subtotal and min_items (variety of slugs)
        if subtotal < min_subtotal:
            continue
        if len(set(product_slugs)) < min_items:
            continue

        if promo_type == "fixed":
            candidate = AppliedPromotion(label=label, discount_total=min(discount_value, subtotal))
        elif promo_type == "percentage":
            candidate = AppliedPromotion(label=label, discount_total=min(subtotal, subtotal * (discount_value / 100.0)))
        elif promo_type == "combo":
            # For combos, the 'discount_value' is the fixed amount to subtract
            candidate = apply_combo_promotion(
                subtotal=subtotal,
                product_slugs=product_slugs,
                min_subtotal=min_subtotal,
                min_distinct_products=min_items,
                discount_amount=discount_value,
            )
            if candidate is not None:
                candidate = AppliedPromotion(label=label, discount_total=candidate.discount_total)

        if candidate is None or candidate.discount_total <= 0:
            continue

        if best is None or candidate.discount_total > best.discount_total:
            best = candidate

    return best
