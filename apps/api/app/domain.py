from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


SalesChannel = Literal["online", "store"]
PromotionType = Literal["percentage", "fixed", "combo"]
PaymentMethod = Literal["Efectivo", "Tarjeta", "TDD"]


class Category(BaseModel):
    id: str
    name: str
    slug: str


class Supplier(BaseModel):
    id: str
    name: str
    country: str | None = None
    organic_certification: str | None = None
    materials: list[str] = Field(default_factory=list)
    notes: str | None = None


class ProductVariant(BaseModel):
    id: str
    sku: str
    size: str
    color: str
    stock: int = Field(ge=0)
    price: float = Field(ge=0)


class ProductSummary(BaseModel):
    id: str
    name: str
    slug: str
    category: str
    price_from: float
    sustainability_label: str | None = None
    available_colors: list[str]
    available_sizes: list[str]


class ProductDetail(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    category: Category
    supplier: Supplier | None = None
    sustainability_label: str | None = None
    sustainability_score: int | None = None
    variants: list[ProductVariant]


class LoyaltyCustomer(BaseModel):
    id: str
    full_name: str
    email: str | None = None
    phone: str | None = None
    loyalty_points: int = Field(ge=0)


class SalesByVariantReport(BaseModel):
    size: str
    color: str
    sales_channel: SalesChannel
    total_units: int = Field(ge=0)
    total_revenue: float = Field(ge=0)


class TopProductKpi(BaseModel):
    product_slug: str
    product_name: str
    total_units: int = Field(ge=0)
    total_revenue: float = Field(ge=0)


class SalesKpisReport(BaseModel):
    sales_channel: SalesChannel | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    total_orders: int = Field(ge=0)
    ticket_average: float = Field(ge=0)
    units_sold: int = Field(ge=0)
    total_revenue: float = Field(ge=0)
    top_products: list[TopProductKpi] = Field(default_factory=list)


class AuthUser(BaseModel):
    id: str
    name: str
    email: str | None = None
    role: Literal["client", "admin"]


class OrderItem(BaseModel):
    product_slug: str
    product_name: str
    variant_id: str
    size: str
    color: str
    quantity: int = Field(gt=0)
    unit_price: float = Field(ge=0)
    line_total: float = Field(ge=0)


class OrderSummary(BaseModel):
    id: str
    sales_channel: SalesChannel
    customer_id: str | None = None
    customer_name: str | None = None
    created_at: datetime | None = None
    subtotal: float = Field(ge=0)
    promotion_discount_total: float = Field(default=0, ge=0)
    loyalty_discount_total: float = Field(default=0, ge=0)
    discount_total: float = Field(default=0, ge=0)
    total: float = Field(ge=0)
    promotion_label: str | None = None
    redeemed_points: int = Field(default=0, ge=0)
    loyalty_points_earned: int = Field(ge=0)
    payment_method: PaymentMethod | None = None
    store_name: str | None = None
    seller: str | None = None
    invoice_required: bool | None = None
    invoice_rfc: str | None = None
    invoice_business_name: str | None = None
    notes: str | None = None
    items: list[OrderItem]


class AdminOverview(BaseModel):
    low_stock_variants: int = Field(ge=0)
    active_promotions: int = Field(ge=0)
    ethical_suppliers: int = Field(ge=0)
    sales_total: float = Field(ge=0)


class Promotion(BaseModel):
    id: str
    name: str
    description: str | None = None
    promotion_type: PromotionType
    discount_value: float = Field(ge=0)
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    is_active: bool = True
