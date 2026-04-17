"""Pytest configuration and shared fixtures"""

import os
from dataclasses import dataclass
from unittest.mock import MagicMock

import pytest

# Mock environment variables for testing
os.environ["SUPABASE_URL"] = "https://test.supabase.co"
os.environ["SUPABASE_KEY"] = "test-key"


@dataclass
class MockVariant:
    """Mock product variant for testing"""
    id: str
    size: str
    color: str
    stock: int
    price: float


@dataclass
class MockProduct:
    """Mock product for testing"""
    id: str
    slug: str
    name: str
    variants: list[MockVariant]


@dataclass
class MockPromotion:
    """Mock promotion for testing"""
    id: str
    name: str
    promotion_type: str  # 'fixed' | 'percentage' | 'combo'
    discount_value: float
    is_active: bool


@pytest.fixture
def mock_product():
    """Fixture providing a sample product with variants"""
    return MockProduct(
        id="prod-001",
        slug="sustainable-tshirt",
        name="Camiseta Sostenible",
        variants=[
            MockVariant(id="var-001", size="M", color="Azul", stock=10, price=500),
            MockVariant(id="var-002", size="L", color="Rojo", stock=5, price=500),
            MockVariant(id="var-003", size="M", color="Verde", stock=0, price=500),
        ],
    )


@pytest.fixture
def mock_second_product():
    """Fixture providing a second product for combo promotions"""
    return MockProduct(
        id="prod-002",
        slug="sustainable-pants",
        name="Pantalones Sostenibles",
        variants=[
            MockVariant(id="var-004", size="M", color="Negro", stock=8, price=800),
        ],
    )


@pytest.fixture
def mock_fixed_promotion():
    """Fixture: Fixed discount promotion ($200)"""
    return MockPromotion(
        id="promo-001",
        name="Descuento fijo",
        promotion_type="fixed",
        discount_value=200,
        is_active=True,
    )


@pytest.fixture
def mock_percentage_promotion():
    """Fixture: Percentage discount promotion (10%)"""
    return MockPromotion(
        id="promo-002",
        name="Descuento porcentaje",
        promotion_type="percentage",
        discount_value=10,
        is_active=True,
    )


@pytest.fixture
def mock_combo_promotion():
    """Fixture: Combo promotion ($350, min $5000 subtotal, 2+ products)"""
    return MockPromotion(
        id="promo-003",
        name="Combo de temporada",
        promotion_type="combo",
        discount_value=350,
        is_active=True,
    )


@pytest.fixture
def mock_repository():
    """Fixture: Mock repository for testing services"""
    repo = MagicMock()
    return repo
