from datetime import datetime

from pydantic import BaseModel, Field

from app.domain import (
    AdminOverview,
    AuthUser,
    PaymentMethod,
    OrderSummary,
    ProductDetail,
    ProductVariant,
    Promotion,
    PromotionType,
)


class HealthResponse(BaseModel):
    status: str
    environment: str
    supabase_configured: bool


class RootResponse(BaseModel):
    message: str
    version: str
    modules: list[str]


class LoginRequest(BaseModel):
    identifier: str = Field(min_length=1)
    password: str = Field(min_length=1)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUser


class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=1)
    email: str = Field(min_length=3)
    password: str = Field(min_length=1)


class CustomerUpdateRequest(BaseModel):
    full_name: str = Field(min_length=1)
    email: str | None = None
    phone: str | None = None


class CheckoutItemRequest(BaseModel):
    product_slug: str
    variant_id: str
    quantity: int = Field(gt=0)


class CheckoutRequest(BaseModel):
    customer_id: str | None = None
    customer_name: str | None = None
    customer_email: str | None = None
    payment_method: PaymentMethod | None = None
    notes: str | None = None
    redeem_points: int | None = Field(default=None, ge=0)
    store_name: str | None = None
    seller: str | None = None
    invoice_required: bool | None = None
    invoice_rfc: str | None = None
    invoice_business_name: str | None = None
    items: list[CheckoutItemRequest]


class ProductUpsertRequest(BaseModel):
    name: str = Field(min_length=1)
    slug: str = Field(min_length=1)
    description: str = Field(min_length=1)
    category_id: str = Field(min_length=1)
    supplier_id: str | None = None
    sustainability_label: str | None = None
    sustainability_score: int | None = Field(default=None, ge=0, le=100)


class VariantUpsertRequest(BaseModel):
    sku: str = Field(min_length=1)
    size: str = Field(min_length=1)
    color: str = Field(min_length=1)
    stock: int = Field(ge=0)
    price: float = Field(ge=0)


class SupplierUpsertRequest(BaseModel):
    name: str = Field(min_length=1)
    country: str | None = None
    organic_certification: str | None = None
    materials: list[str] = Field(default_factory=list)
    notes: str | None = None


class PromotionUpsertRequest(BaseModel):
    name: str = Field(min_length=1)
    description: str | None = None
    promotion_type: PromotionType
    discount_value: float = Field(ge=0)
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    is_active: bool = True


class AdminProductResponse(BaseModel):
    product: ProductDetail


class AdminVariantResponse(BaseModel):
    variant: ProductVariant


class AdminPromotionResponse(BaseModel):
    promotion: Promotion


class CheckoutResponse(BaseModel):
    order: OrderSummary


class AdminOverviewResponse(BaseModel):
    overview: AdminOverview
