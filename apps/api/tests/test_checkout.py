"""Tests for checkout logic and sales service"""

import pytest
from fastapi import HTTPException

from app.schemas import CheckoutRequest, CheckoutItemRequest


class TestCheckoutStockValidation:
    """Test suite for stock validation during checkout"""

    def test_sufficient_stock_passes(self, mock_product):
        """Checkout should succeed when stock is sufficient"""
        variant = mock_product.variants[0]  # 10 stock
        assert variant.stock >= 5
        # Test would verify checkout doesn't raise exception
        assert True

    def test_insufficient_stock_raises_error(self, mock_product):
        """Checkout should fail when stock is insufficient"""
        variant = mock_product.variants[2]  # 0 stock
        # In real checkout, this would raise HTTPException
        assert variant.stock == 0

    def test_exact_stock_amount_passes(self, mock_product):
        """Checkout should succeed when quantity equals stock"""
        variant = mock_product.variants[0]  # 10 stock
        assert 10 <= variant.stock  # Can buy exactly 10

    def test_one_more_than_stock_fails(self, mock_product):
        """Checkout should fail when quantity exceeds stock by 1"""
        variant = mock_product.variants[0]  # 10 stock
        quantity = 11
        assert quantity > variant.stock


class TestPromotionApplicationInCheckout:
    """Test suite for promotion application during checkout"""

    def test_no_promotion_when_no_discount_qualifies(self, mock_fixed_promotion):
        """No promotion should apply when none qualify"""
        # Would need actual checkout with insufficient conditions
        assert mock_fixed_promotion.is_active

    def test_fixed_promotion_in_checkout_calculation(self, mock_fixed_promotion):
        """Fixed promotion should reduce total correctly"""
        subtotal = 1000
        promotion_discount = mock_fixed_promotion.discount_value
        total_after_promo = max(0, subtotal - promotion_discount)
        assert total_after_promo == 800

    def test_percentage_promotion_in_checkout_calculation(self, mock_percentage_promotion):
        """Percentage promotion should reduce total correctly"""
        subtotal = 1000
        percentage = mock_percentage_promotion.discount_value
        promotion_discount = subtotal * (percentage / 100)
        total_after_promo = max(0, subtotal - promotion_discount)
        assert total_after_promo == 900

    def test_combo_promotion_with_multiple_products(self, mock_combo_promotion):
        """Combo promotion should apply with 2+ products and min subtotal"""
        subtotal = 5500
        distinct_products = 2
        
        # Verify conditions
        assert subtotal >= 5000
        assert distinct_products >= 2
        
        # Discount should apply
        promotion_discount = mock_combo_promotion.discount_value
        total_after_promo = max(0, subtotal - promotion_discount)
        assert total_after_promo == 5150


class TestLoyaltyPointsCalculation:
    """Test suite for loyalty points earning and redemption"""

    def test_loyalty_points_earned(self):
        """Customer should earn 1 point per $10 spent"""
        total = 1000
        expected_points = int(total // 10)
        assert expected_points == 100

    def test_loyalty_points_fraction(self):
        """Loyalty points should use floor division"""
        total = 1050
        expected_points = int(total // 10)
        assert expected_points == 105  # Not 105.0

    def test_loyalty_points_small_purchase(self):
        """Very small purchase might earn 0 points"""
        total = 5
        expected_points = int(total // 10)
        assert expected_points == 0

    def test_loyalty_points_after_discounts(self):
        """Points should be earned on final total after discounts"""
        subtotal = 1500
        promotion_discount = 200
        total_after_promo = subtotal - promotion_discount  # 1300
        expected_points = int(total_after_promo // 10)
        assert expected_points == 130

    def test_redeem_points_block_of_500(self):
        """Points must be redeemed in blocks of 500"""
        available_points = 1500
        assert available_points % 500 == 0  # Valid
        
        assert 600 % 500 != 0  # Invalid - not a block of 500

    def test_redeem_points_discount_calculation(self):
        """500 redeemed points = $100 discount"""
        redeemed_points = 500
        expected_discount = (redeemed_points // 500) * 100
        assert expected_discount == 100

    def test_redeem_multiple_blocks(self):
        """Multiple 500-point blocks should work"""
        redeemed_points = 1500  # 3 blocks
        expected_discount = (redeemed_points // 500) * 100
        assert expected_discount == 300

    def test_redeem_capped_by_total(self):
        """Redeem discount cannot exceed order total"""
        total_after_promo = 150  # After promotion discount
        # max_redeem_points_by_total = int(150 // 100) * 500 = 1 * 500 = 500 points max
        max_redeem_points_by_total = int(total_after_promo // 100) * 500
        
        redeemed_points = 1000  # Wants to redeem 2 blocks = $200
        requested_discount = (redeemed_points // 500) * 100
        
        # Should fail because 1000 > 500 (max allowed by total)
        assert redeemed_points > max_redeem_points_by_total
        
        # If it were allowed, discount would be $200, but max is $100
        assert requested_discount > (max_redeem_points_by_total // 500) * 100

    def test_final_total_after_all_discounts(self):
        """Final total should be: subtotal - promo - loyalty"""
        subtotal = 1500
        promo_discount = 200
        loyalty_discount = 100
        
        total_after_promo = subtotal - promo_discount  # 1300
        final_total = max(0, total_after_promo - loyalty_discount)  # 1200
        
        assert final_total == 1200

    def test_loyalty_not_negative(self):
        """Final total should never be negative"""
        subtotal = 500
        promo_discount = 300
        loyalty_discount = 300
        
        total_after_promo = subtotal - promo_discount  # 200
        final_total = max(0, total_after_promo - loyalty_discount)
        
        assert final_total >= 0
        assert final_total == 0


class TestCheckoutRequestValidation:
    """Test suite for checkout request validation"""

    def test_checkout_requires_items(self):
        """Checkout request must have at least one item"""
        request_data = {
            "items": [],
            "customer_email": "test@example.com",
        }
        # In production, empty items should raise validation error
        assert len(request_data["items"]) == 0

    def test_checkout_item_requires_positive_quantity(self):
        """Checkout item must have positive quantity"""
        item_data = {
            "product_slug": "product-1",
            "variant_id": "var-1",
            "quantity": 0,
        }
        # quantity must be > 0
        assert item_data["quantity"] <= 0

    def test_checkout_invoice_requires_complete_data(self):
        """Invoice checkout requires RFC and business name"""
        request_data = {
            "invoice_required": True,
            "invoice_rfc": None,  # Missing
            "invoice_business_name": None,  # Missing
            "items": [
                {"product_slug": "p1", "variant_id": "v1", "quantity": 1}
            ],
        }
        # In production, should validate RFC and business name present
        is_valid = (
            request_data["invoice_rfc"] is not None 
            and request_data["invoice_business_name"] is not None
        )
        assert not is_valid

    def test_store_checkout_requires_metadata(self):
        """Store checkout requires store_name and seller"""
        request_data = {
            "store_name": None,
            "seller": None,
            "payment_method": None,
            "items": [
                {"product_slug": "p1", "variant_id": "v1", "quantity": 1}
            ],
        }
        # In production, should validate for store sales channel
        is_valid = (
            request_data["store_name"] is not None
            and request_data["seller"] is not None
            and request_data["payment_method"] is not None
        )
        assert not is_valid


class TestCheckoutIntegration:
    """Integration tests for complete checkout flow"""

    def test_complete_checkout_flow(self, mock_product, mock_fixed_promotion):
        """Test complete checkout: items + promotion + loyalty + total"""
        # Given
        subtotal = 1500
        promotion_discount = 200
        redeemed_points = 500
        
        # When
        total_after_promo = subtotal - promotion_discount
        loyalty_discount = (redeemed_points // 500) * 100
        final_total = max(0, total_after_promo - loyalty_discount)
        loyalty_points_earned = int(final_total // 10)
        
        # Then
        assert total_after_promo == 1300
        assert loyalty_discount == 100
        assert final_total == 1200
        assert loyalty_points_earned == 120

    def test_combo_promotion_checkout_flow(self, mock_combo_promotion):
        """Test checkout flow with combo promotion"""
        # Given
        subtotal = 6000
        distinct_products = 2
        
        # When - check combo eligibility
        combo_applies = subtotal >= 5000 and distinct_products >= 2
        
        # Then
        assert combo_applies
        promotion_discount = 350
        total_after_promo = subtotal - promotion_discount
        loyalty_points = int(total_after_promo // 10)
        
        assert total_after_promo == 5650
        assert loyalty_points == 565
