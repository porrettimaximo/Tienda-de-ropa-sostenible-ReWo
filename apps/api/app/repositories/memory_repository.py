from __future__ import annotations

from copy import deepcopy
from uuid import uuid4

from fastapi import HTTPException

from app.data import LOYALTY_CUSTOMERS, PRODUCTS, SALES_REPORT, SUPPLIERS, get_product_summaries
from app.domain import (
    AdminOverview,
    AuthUser,
    LoyaltyCustomer,
    OrderItem,
    OrderSummary,
    ProductDetail,
    ProductSummary,
    ProductVariant,
    SalesByVariantReport,
    Supplier,
)
from app.schemas import CheckoutRequest, ProductUpsertRequest, VariantUpsertRequest


class MemoryRepository:
    def __init__(self) -> None:
        self.products = deepcopy(PRODUCTS)
        self.customers = deepcopy(LOYALTY_CUSTOMERS)
        self.suppliers = deepcopy(SUPPLIERS)
        self.orders: list[OrderSummary] = []
        self.sales_report = deepcopy(SALES_REPORT)
        self.admin_users = [
            AuthUser(
                id="admin-ecowear",
                name="Admin EcoWear",
                email="admin@ecowear.mx",
                role="admin",
            )
        ]

    def is_enabled(self) -> bool:
        return True

    def list_products(self) -> list[ProductSummary]:
        return get_product_summaries(self.products)

    def list_product_details(self) -> list[ProductDetail]:
        return self.products

    def get_product(self, product_slug: str) -> ProductDetail:
        for product in self.products:
            if product.slug == product_slug:
                return product
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    def _get_variant(self, variant_id: str) -> tuple[ProductDetail, ProductVariant]:
        for product in self.products:
            for variant in product.variants:
                if variant.id == variant_id:
                    return product, variant
        raise HTTPException(status_code=404, detail="Variante no encontrada")

    def authenticate_client(self, identifier: str, password: str) -> AuthUser:
        if not password:
            raise HTTPException(status_code=400, detail="Password requerida")
        for customer in self.customers:
            if customer.email == identifier or customer.id == identifier:
                return AuthUser(
                    id=customer.id,
                    name=customer.full_name,
                    email=customer.email,
                    role="client",
                )
        raise HTTPException(status_code=401, detail="Cliente no encontrado")

    def authenticate_admin(self, identifier: str, password: str) -> AuthUser:
        if not password:
            raise HTTPException(status_code=400, detail="Password requerida")
        for admin in self.admin_users:
            if admin.email == identifier or admin.id == identifier or identifier == "admin":
                return admin
        raise HTTPException(status_code=401, detail="Administrador no encontrado")

    def get_customer(self, customer_id: str) -> LoyaltyCustomer:
        for customer in self.customers:
            if customer.id == customer_id:
                return customer
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    def list_customer_orders(self, customer_id: str) -> list[OrderSummary]:
        self.get_customer(customer_id)
        return [order for order in self.orders if order.customer_id == customer_id]

    def create_product(self, payload: ProductUpsertRequest) -> ProductDetail:
        if any(product.slug == payload.slug for product in self.products):
            raise HTTPException(status_code=409, detail="El slug ya existe")
        category = next(
            (item.category for item in self.products if item.category.id == payload.category_id),
            None,
        )
        if category is None:
            raise HTTPException(status_code=404, detail="Categoria no encontrada")
        supplier = None
        if payload.supplier_id:
            supplier = next((item for item in self.suppliers if item.id == payload.supplier_id), None)
            if supplier is None:
                raise HTTPException(status_code=404, detail="Proveedor no encontrado")
        product = ProductDetail(
            id=f"prod-{uuid4().hex[:8]}",
            name=payload.name,
            slug=payload.slug,
            description=payload.description,
            category=category,
            supplier=supplier,
            sustainability_label=payload.sustainability_label,
            sustainability_score=payload.sustainability_score,
            variants=[],
        )
        self.products.append(product)
        return product

    def update_product(self, product_slug: str, payload: ProductUpsertRequest) -> ProductDetail:
        product = self.get_product(product_slug)
        category = next(
            (item.category for item in self.products if item.category.id == payload.category_id),
            None,
        )
        if category is None:
            raise HTTPException(status_code=404, detail="Categoria no encontrada")
        supplier = None
        if payload.supplier_id:
            supplier = next((item for item in self.suppliers if item.id == payload.supplier_id), None)
            if supplier is None:
                raise HTTPException(status_code=404, detail="Proveedor no encontrado")
        product.name = payload.name
        product.slug = payload.slug
        product.description = payload.description
        product.category = category
        product.supplier = supplier
        product.sustainability_label = payload.sustainability_label
        product.sustainability_score = payload.sustainability_score
        return product

    def create_variant(self, product_slug: str, payload: VariantUpsertRequest) -> ProductVariant:
        product = self.get_product(product_slug)
        if any(variant.sku == payload.sku for item in self.products for variant in item.variants):
            raise HTTPException(status_code=409, detail="El SKU ya existe")
        variant = ProductVariant(
            id=f"var-{uuid4().hex[:8]}",
            sku=payload.sku,
            size=payload.size,
            color=payload.color,
            stock=payload.stock,
            price=payload.price,
        )
        product.variants.append(variant)
        return variant

    def update_variant(
        self, product_slug: str, variant_id: str, payload: VariantUpsertRequest
    ) -> ProductVariant:
        product = self.get_product(product_slug)
        for variant in product.variants:
            if variant.id == variant_id:
                variant.sku = payload.sku
                variant.size = payload.size
                variant.color = payload.color
                variant.stock = payload.stock
                variant.price = payload.price
                return variant
        raise HTTPException(status_code=404, detail="Variante no encontrada")

    def checkout(self, payload: CheckoutRequest, sales_channel: str) -> OrderSummary:
        if not payload.items:
            raise HTTPException(status_code=400, detail="Debes enviar items")
        items: list[OrderItem] = []
        subtotal = 0.0
        customer = None
        if payload.customer_id:
            customer = self.get_customer(payload.customer_id)
        elif payload.customer_email:
            customer = next((item for item in self.customers if item.email == payload.customer_email), None)
        for requested_item in payload.items:
            product, variant = self._get_variant(requested_item.variant_id)
            if product.slug != requested_item.product_slug:
                raise HTTPException(status_code=400, detail="La variante no corresponde al producto enviado")
            if variant.stock < requested_item.quantity:
                raise HTTPException(status_code=400, detail=f"Stock insuficiente para {product.name} {variant.size}/{variant.color}")
            variant.stock -= requested_item.quantity
            line_total = variant.price * requested_item.quantity
            subtotal += line_total
            items.append(
                OrderItem(
                    product_slug=product.slug,
                    product_name=product.name,
                    variant_id=variant.id,
                    size=variant.size,
                    color=variant.color,
                    quantity=requested_item.quantity,
                    unit_price=variant.price,
                    line_total=line_total,
                )
            )
            self._register_sales_report(variant.size, variant.color, sales_channel, requested_item.quantity, line_total)
        loyalty_points = int(subtotal // 100) * 10
        if customer is not None:
            customer.loyalty_points += loyalty_points
        order = OrderSummary(
            id=f"ord-{uuid4().hex[:10]}",
            sales_channel=sales_channel,  # type: ignore[arg-type]
            customer_id=customer.id if customer else payload.customer_id,
            customer_name=customer.full_name if customer else payload.customer_name,
            subtotal=subtotal,
            total=subtotal,
            loyalty_points_earned=loyalty_points,
            payment_method=payload.payment_method,
            notes=payload.notes,
            items=items,
        )
        self.orders.append(order)
        return order

    def get_sales_report(self) -> list[SalesByVariantReport]:
        return self.sales_report

    def get_admin_overview(self) -> AdminOverview:
        low_stock_variants = sum(1 for product in self.products for variant in product.variants if variant.stock <= 3)
        sales_total = sum(order.total for order in self.orders) or sum(row.total_revenue for row in self.sales_report)
        return AdminOverview(
            low_stock_variants=low_stock_variants,
            active_promotions=3,
            ethical_suppliers=len(self.suppliers),
            sales_total=sales_total,
        )

    def list_suppliers(self) -> list[Supplier]:
        return self.suppliers

    def _register_sales_report(self, size: str, color: str, sales_channel: str, quantity: int, revenue: float) -> None:
        for row in self.sales_report:
            if row.size == size and row.color == color and row.sales_channel == sales_channel:
                row.total_units += quantity
                row.total_revenue += revenue
                return
        self.sales_report.append(
            SalesByVariantReport(
                size=size,
                color=color,
                sales_channel=sales_channel,  # type: ignore[arg-type]
                total_units=quantity,
                total_revenue=revenue,
            )
        )
