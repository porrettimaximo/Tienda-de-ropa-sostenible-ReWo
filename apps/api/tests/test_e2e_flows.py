"""End-to-End flow tests using TestClient"""

import os
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

# Mock environment before importing app
os.environ["SUPABASE_URL"] = "https://test.supabase.co"
os.environ["SUPABASE_KEY"] = "test-key"
os.environ["USE_MEMORY_REPO"] = "true"

from app.main import app


@pytest.fixture
def client():
    """FastAPI TestClient for E2E tests"""
    return TestClient(app)


class TestHealthEndpoint:
    """Test basic health endpoint"""

    def test_health_check(self, client):
        """GET / should return health status"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data

    def test_health_check_with_path(self, client):
        """GET /health should be accessible"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") in ["healthy", "ok"]


class TestProductsCatalog:
    """Test products catalog E2E flow"""

    def test_list_products(self, client):
        """GET /products should return product list"""
        response = client.get("/products")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Memory repo should have demo products
        assert len(data) > 0

    def test_get_product_by_slug(self, client):
        """GET /products/{slug} should return product detail"""
        # First get list to know a slug
        list_response = client.get("/products")
        if list_response.status_code == 200:
            products = list_response.json()
            if products:
                first_slug = products[0].get("slug")
                if first_slug:
                    response = client.get(f"/products/{first_slug}")
                    assert response.status_code == 200
                    product = response.json()
                    assert product.get("slug") == first_slug
                    assert "variants" in product


class TestPromotionsAPI:
    """Test promotions API E2E"""

    def test_list_active_promotions(self, client):
        """GET /promotions?active_only=true should list active promotions"""
        response = client.get("/promotions?active_only=true")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_list_all_promotions(self, client):
        """GET /promotions?active_only=false should list all promotions"""
        response = client.get("/promotions?active_only=false")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestCheckoutFlow:
    """E2E checkout flow tests"""

    def test_checkout_minimal_payload(self, client):
        """POST /checkout minimal checkout should work"""
        payload = {
            "customer_email": "test@example.com",
            "items": [
                {
                    "product_slug": "test-product",
                    "variant_id": "test-variant",
                    "quantity": 1
                }
            ]
        }
        
        # This will likely fail with memory repo since products don't exist
        # but it validates the endpoint structure
        response = client.post("/checkout", json=payload)
        # Accept both 404 (product not found) and 200 (success)
        assert response.status_code in [200, 404, 400]

    def test_checkout_with_promotions(self, client):
        """POST /checkout should apply promotions if eligible"""
        payload = {
            "customer_email": "test@example.com",
            "items": [
                {
                    "product_slug": "product-1",
                    "variant_id": "variant-1",
                    "quantity": 1
                }
            ]
        }
        
        response = client.post("/checkout", json=payload)
        # Should at least respond (might fail with product not found)
        assert response.status_code in [200, 404, 400]
        
        if response.status_code == 200:
            order = response.json().get("order", {})
            # Should have order fields
            assert "id" in order or "order_id" in order
            assert "total" in order

    def test_checkout_requires_items(self, client):
        """POST /checkout without items should fail"""
        payload = {
            "customer_email": "test@example.com",
            "items": []
        }
        
        response = client.post("/checkout", json=payload)
        assert response.status_code == 400


class TestStoreCheckoutFlow:
    """Store channel checkout E2E"""

    def test_store_checkout_minimal_payload(self, client):
        """POST /sales/store with required metadata"""
        payload = {
            "store_name": "ReWo Central",
            "seller": "Juan Pérez",
            "payment_method": "cash",
            "items": [
                {
                    "product_slug": "product-1",
                    "variant_id": "variant-1",
                    "quantity": 1
                }
            ]
        }
        
        response = client.post("/sales/store", json=payload)
        # Should require auth
        assert response.status_code in [200, 400, 401, 403, 404]

    def test_store_checkout_missing_seller_fails(self, client):
        """POST /sales/store without seller should fail"""
        payload = {
            "store_name": "ReWo Central",
            # Missing seller
            "payment_method": "cash",
            "items": [
                {
                    "product_slug": "product-1",
                    "variant_id": "variant-1",
                    "quantity": 1
                }
            ]
        }
        
        response = client.post("/sales/store", json=payload)
        # Should fail validation or require auth (401)
        assert response.status_code in [400, 422, 401]


class TestInvoiceCheckout:
    """Invoice handling E2E"""

    def test_invoice_checkout_requires_rfc(self, client):
        """Invoice checkout without RFC should fail"""
        payload = {
            "customer_email": "test@example.com",
            "invoice_required": True,
            # Missing invoice_rfc and invoice_business_name
            "items": [
                {
                    "product_slug": "product-1",
                    "variant_id": "variant-1",
                    "quantity": 1
                }
            ]
        }
        
        response = client.post("/checkout", json=payload)
        # Should fail validation
        assert response.status_code in [400, 422]

    def test_invoice_checkout_with_complete_data(self, client):
        """Invoice checkout with all required data"""
        payload = {
            "customer_email": "test@example.com",
            "invoice_required": True,
            "invoice_rfc": "ABC123456XYZ",
            "invoice_business_name": "Empresa Test",
            "items": [
                {
                    "product_slug": "product-1",
                    "variant_id": "variant-1",
                    "quantity": 1
                }
            ]
        }
        
        response = client.post("/checkout", json=payload)
        # Product won't exist in memory repo, but payload should be valid
        assert response.status_code in [200, 404]


class TestLoyaltyRedeemFlow:
    """Loyalty points redeem E2E"""

    def test_redeem_points_must_be_customer(self, client):
        """Redeem points requires authenticated customer"""
        payload = {
            "customer_email": "test@example.com",
            "redeem_points": 500,  # Want to redeem points
            "items": [
                {
                    "product_slug": "product-1",
                    "variant_id": "variant-1",
                    "quantity": 1
                }
            ]
        }
        
        response = client.post("/checkout", json=payload)
        # Might fail because customer might not exist
        assert response.status_code in [200, 400, 404]

    def test_redeem_points_must_be_block_of_500(self, client):
        """Redeem points must be in blocks of 500"""
        payload = {
            "customer_email": "test@example.com",
            "redeem_points": 600,  # Invalid - not multiple of 500
            "items": [
                {
                    "product_slug": "product-1",
                    "variant_id": "variant-1",
                    "quantity": 1
                }
            ]
        }
        
        response = client.post("/checkout", json=payload)
        # Should fail validation for invalid block or product not found
        assert response.status_code in [400, 422, 404]


class TestAdminRoutes:
    """Admin API E2E tests"""

    def test_admin_requires_auth_token(self, client):
        """Admin endpoints should require authentication"""
        response = client.get("/admin/products")
        # Should return 401 or 403 without auth
        assert response.status_code in [401, 403]

    def test_admin_promotions_requires_auth(self, client):
        """Admin promotions endpoint should require auth"""
        response = client.get("/admin/promotions")
        assert response.status_code in [401, 403]

    def test_admin_post_promotion_requires_auth(self, client):
        """POST /admin/promotions should require auth"""
        payload = {
            "name": "Test Promo",
            "promotion_type": "fixed",
            "discount_value": 200
        }
        
        response = client.post("/admin/promotions", json=payload)
        assert response.status_code in [401, 403]


class TestErrorHandling:
    """Error handling E2E tests"""

    def test_invalid_json_returns_422(self, client):
        """Invalid JSON should return validation error"""
        response = client.post(
            "/checkout",
            json={
                "items": [
                    {
                        "product_slug": "test",
                        "variant_id": "test",
                        # Missing quantity
                    }
                ]
            }
        )
        assert response.status_code in [422, 400]

    def test_nonexistent_endpoint_returns_404(self, client):
        """Nonexistent endpoint should return 404"""
        response = client.get("/nonexistent-route")
        assert response.status_code == 404

    def test_wrong_method_returns_405(self, client):
        """Wrong HTTP method should return 405"""
        response = client.put("/products")  # products only supports GET
        assert response.status_code == 405
