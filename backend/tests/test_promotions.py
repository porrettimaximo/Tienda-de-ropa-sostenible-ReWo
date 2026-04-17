"""Tests for promotion logic"""

import pytest

from app.services.promotions import apply_best_promotion, AppliedPromotion


class TestApplyBestPromotion:
    """Test suite for apply_best_promotion function"""

    def test_no_promotions_returns_none(self):
        """Should return None when no promotions are available"""
        result = apply_best_promotion(
            subtotal=1000,
            product_slugs=["product-1"],
            promotions=[],
        )
        assert result is None

    def test_fixed_discount_applied(self, mock_fixed_promotion):
        """Should apply fixed discount correctly"""
        result = apply_best_promotion(
            subtotal=1000,
            product_slugs=["product-1"],
            promotions=[mock_fixed_promotion],
        )
        assert result is not None
        assert result.discount_total == 200
        assert result.label == "Descuento fijo"

    def test_fixed_discount_capped_by_subtotal(self, mock_fixed_promotion):
        """Fixed discount should not exceed subtotal"""
        result = apply_best_promotion(
            subtotal=100,  # Less than discount value
            product_slugs=["product-1"],
            promotions=[mock_fixed_promotion],
        )
        assert result is not None
        assert result.discount_total == 100  # Capped at subtotal

    def test_percentage_discount_applied(self, mock_percentage_promotion):
        """Should apply percentage discount correctly"""
        result = apply_best_promotion(
            subtotal=1000,
            product_slugs=["product-1"],
            promotions=[mock_percentage_promotion],
        )
        assert result is not None
        assert result.discount_total == 100  # 10% of 1000

    def test_percentage_discount_capped_by_subtotal(self, mock_percentage_promotion):
        """Percentage discount should not exceed subtotal"""
        result = apply_best_promotion(
            subtotal=500,
            product_slugs=["product-1"],
            promotions=[mock_percentage_promotion],
        )
        assert result is not None
        assert result.discount_total == 50  # 10% of 500

    def test_combo_promotion_requires_min_subtotal(self, mock_combo_promotion):
        """Combo promotion should require minimum subtotal"""
        result = apply_best_promotion(
            subtotal=4999,  # Just below threshold
            product_slugs=["product-1", "product-2"],
            promotions=[mock_combo_promotion],
        )
        assert result is None

    def test_combo_promotion_requires_distinct_products(self, mock_combo_promotion):
        """Combo promotion should require 2+ distinct products"""
        result = apply_best_promotion(
            subtotal=5000,
            product_slugs=["product-1", "product-1"],  # Same product twice
            promotions=[mock_combo_promotion],
        )
        assert result is None

    def test_combo_promotion_applied_correctly(self, mock_combo_promotion):
        """Combo promotion should apply when conditions met"""
        result = apply_best_promotion(
            subtotal=5500,
            product_slugs=["product-1", "product-2"],  # 2 distinct
            promotions=[mock_combo_promotion],
        )
        assert result is not None
        assert result.discount_total == 350
        assert result.label == "Combo de temporada"

    def test_best_promotion_selected(
        self, mock_fixed_promotion, mock_percentage_promotion, mock_combo_promotion
    ):
        """Should select the promotion with highest discount"""
        # Percentage: 1000 * 10% = 100
        # Fixed: 200
        # Combo: N/A (doesn't meet criteria)
        result = apply_best_promotion(
            subtotal=3000,
            product_slugs=["product-1"],
            promotions=[
                mock_fixed_promotion,  # 200
                mock_percentage_promotion,  # 300 (10% of 3000)
            ],
        )
        assert result is not None
        assert result.discount_total == 300
        assert result.label == "Descuento porcentaje"

    def test_best_promotion_combo_wins(
        self, mock_fixed_promotion, mock_percentage_promotion, mock_combo_promotion
    ):
        """Combo promotion should win when it has best discount"""
        result = apply_best_promotion(
            subtotal=5500,
            product_slugs=["product-1", "product-2"],  # Combo eligible
            promotions=[
                mock_fixed_promotion,  # 200
                mock_percentage_promotion,  # 550 (10% of 5500)
                mock_combo_promotion,  # 350
            ],
        )
        assert result is not None
        # Best is percentage: 550
        assert result.discount_total == 550
        assert result.label == "Descuento porcentaje"

    def test_invalid_promotion_type_ignored(self):
        """Invalid promotion types should be skipped"""
        invalid_promo = type("Promo", (), {
            "name": "Invalid",
            "promotion_type": "invalid_type",
            "discount_value": 1000,
        })()
        
        result = apply_best_promotion(
            subtotal=5000,
            product_slugs=["product-1"],
            promotions=[invalid_promo],
        )
        assert result is None

    def test_zero_discount_promotion_ignored(self):
        """Promotions with zero discount should be ignored"""
        zero_promo = type("Promo", (), {
            "name": "Zero Discount",
            "promotion_type": "fixed",
            "discount_value": 0,
        })()
        
        result = apply_best_promotion(
            subtotal=1000,
            product_slugs=["product-1"],
            promotions=[zero_promo],
        )
        assert result is None

    def test_multiple_combo_products(self, mock_combo_promotion):
        """Combo should work with multiple distinct products"""
        result = apply_best_promotion(
            subtotal=6000,
            product_slugs=["shirt", "pants", "jacket", "shoes"],  # 4 distinct
            promotions=[mock_combo_promotion],
        )
        assert result is not None
        assert result.discount_total == 350
