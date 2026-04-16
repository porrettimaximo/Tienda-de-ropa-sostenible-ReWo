from __future__ import annotations

from datetime import datetime, timezone
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
    Promotion,
    ProductDetail,
    ProductSummary,
    ProductVariant,
    SalesByVariantReport,
    SalesKpisReport,
    Supplier,
    TopProductKpi,
)
from app.schemas import (
    CheckoutRequest,
    ProductUpsertRequest,
    PromotionUpsertRequest,
    SupplierUpsertRequest,
    VariantUpsertRequest,
)
from app.services.promotions import apply_best_promotion


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
        self.promotions = [
            Promotion(
                id="promo-combo-temporada",
                name="Combo de temporada",
                description="-$350 MXN en compras desde $5,000 con 2 productos distintos.",
                promotion_type="combo",
                discount_value=350,
                ends_at=datetime(2026, 4, 30, 23, 59, 59, tzinfo=timezone.utc),
                is_active=True,
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

        invoice_required = bool(payload.invoice_required)
        if invoice_required:
            if not payload.invoice_rfc or not payload.invoice_business_name:
                raise HTTPException(status_code=400, detail="Faltan datos de factura (RFC / razon social)")

        if sales_channel == "store":
            if not payload.store_name or not payload.seller:
                raise HTTPException(status_code=400, detail="Venta tienda requiere sucursal y vendedor")
            if payload.payment_method is None:
                raise HTTPException(status_code=400, detail="Venta tienda requiere metodo de pago")

        items: list[OrderItem] = []
        subtotal = 0.0
        product_slugs: list[str] = []
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
            product_slugs.append(product.slug)
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

        applied_promo = apply_best_promotion(
            subtotal=subtotal,
            product_slugs=product_slugs,
            promotions=self.list_promotions(active_only=True),
        )
        promotion_discount_total = applied_promo.discount_total if applied_promo else 0.0
        total_after_promo = max(0.0, subtotal - promotion_discount_total)

        redeemed_points = 0
        loyalty_discount_total = 0.0
        if payload.redeem_points:
            if customer is None:
                raise HTTPException(status_code=400, detail="Solo clientes registrados pueden canjear puntos")
            if payload.redeem_points % 500 != 0:
                raise HTTPException(status_code=400, detail="Los puntos se canjean en bloques de 500")
            if payload.redeem_points > customer.loyalty_points:
                raise HTTPException(status_code=400, detail="Puntos insuficientes")

            requested_discount = (payload.redeem_points // 500) * 100
            max_redeem_points_by_total = int(total_after_promo // 100) * 500
            if payload.redeem_points > max_redeem_points_by_total:
                raise HTTPException(status_code=400, detail="El canje supera el total de la compra")

            redeemed_points = payload.redeem_points
            loyalty_discount_total = float(requested_discount)
            customer.loyalty_points -= redeemed_points

        total = max(0.0, total_after_promo - loyalty_discount_total)
        discount_total = promotion_discount_total + loyalty_discount_total

        loyalty_points = int(total // 10)
        if customer is not None:
            customer.loyalty_points += loyalty_points
        order = OrderSummary(
            id=f"ord-{uuid4().hex[:10]}",
            sales_channel=sales_channel,  # type: ignore[arg-type]
            customer_id=customer.id if customer else payload.customer_id,
            customer_name=customer.full_name if customer else payload.customer_name,
            created_at=datetime.now(timezone.utc),
            subtotal=subtotal,
            promotion_discount_total=promotion_discount_total,
            loyalty_discount_total=loyalty_discount_total,
            discount_total=discount_total,
            total=total,
            promotion_label=applied_promo.label if applied_promo else None,
            redeemed_points=redeemed_points,
            loyalty_points_earned=loyalty_points,
            payment_method=payload.payment_method,
            store_name=payload.store_name,
            seller=payload.seller,
            invoice_required=payload.invoice_required,
            invoice_rfc=payload.invoice_rfc,
            invoice_business_name=payload.invoice_business_name,
            notes=payload.notes,
            items=items,
        )
        self.orders.append(order)
        return order

    def get_sales_report(self) -> list[SalesByVariantReport]:
        return self.sales_report

    def get_sales_report_filtered(
        self,
        *,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        sales_channel: str | None = None,
    ) -> list[SalesByVariantReport]:
        filtered = self.orders
        if sales_channel:
            filtered = [order for order in filtered if order.sales_channel == sales_channel]  # type: ignore[comparison-overlap]
        if start_date:
            filtered = [order for order in filtered if order.created_at and order.created_at >= start_date]
        if end_date:
            filtered = [order for order in filtered if order.created_at and order.created_at <= end_date]

        totals: dict[tuple[str, str, str], tuple[int, float]] = {}
        for order in filtered:
            for item in order.items:
                key = (item.size, item.color, order.sales_channel)
                units, revenue = totals.get(key, (0, 0.0))
                totals[key] = (units + item.quantity, revenue + item.line_total)

        return [
            SalesByVariantReport(
                size=size,
                color=color,
                sales_channel=channel,  # type: ignore[arg-type]
                total_units=units,
                total_revenue=revenue,
            )
            for (size, color, channel), (units, revenue) in totals.items()
        ]

    def get_admin_overview(self) -> AdminOverview:
        low_stock_variants = sum(1 for product in self.products for variant in product.variants if variant.stock <= 3)
        sales_total = sum(order.total for order in self.orders) or sum(row.total_revenue for row in self.sales_report)
        return AdminOverview(
            low_stock_variants=low_stock_variants,
            active_promotions=len([promo for promo in self.promotions if promo.is_active]),
            ethical_suppliers=len(self.suppliers),
            sales_total=sales_total,
        )

    def list_suppliers(self) -> list[Supplier]:
        return self.suppliers

    def create_supplier(self, payload: SupplierUpsertRequest) -> Supplier:
        supplier = Supplier(
            id=f"sup-{uuid4().hex[:10]}",
            name=payload.name,
            country=payload.country,
            organic_certification=payload.organic_certification,
            materials=payload.materials,
            notes=payload.notes,
        )
        self.suppliers.append(supplier)
        return supplier

    def update_supplier(self, supplier_id: str, payload: SupplierUpsertRequest) -> Supplier:
        for index, supplier in enumerate(self.suppliers):
            if supplier.id == supplier_id:
                updated = Supplier(
                    id=supplier.id,
                    name=payload.name,
                    country=payload.country,
                    organic_certification=payload.organic_certification,
                    materials=payload.materials,
                    notes=payload.notes,
                )
                self.suppliers[index] = updated
                return updated
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")

    def list_promotions(self, active_only: bool = True) -> list[Promotion]:
        if not active_only:
            return self.promotions
        now = datetime.now(timezone.utc)
        return [
            promo
            for promo in self.promotions
            if promo.is_active
            and (promo.starts_at is None or promo.starts_at <= now)
            and (promo.ends_at is None or promo.ends_at >= now)
        ]

    def create_promotion(self, payload: PromotionUpsertRequest) -> Promotion:
        promotion = Promotion(
            id=f"promo-{uuid4().hex[:10]}",
            name=payload.name,
            description=payload.description,
            promotion_type=payload.promotion_type,  # type: ignore[arg-type]
            discount_value=payload.discount_value,
            starts_at=payload.starts_at,
            ends_at=payload.ends_at,
            is_active=payload.is_active,
        )
        self.promotions.append(promotion)
        return promotion

    def update_promotion(self, promotion_id: str, payload: PromotionUpsertRequest) -> Promotion:
        for index, promotion in enumerate(self.promotions):
            if promotion.id == promotion_id:
                updated = Promotion(
                    id=promotion.id,
                    name=payload.name,
                    description=payload.description,
                    promotion_type=payload.promotion_type,
                    discount_value=payload.discount_value,
                    starts_at=payload.starts_at,
                    ends_at=payload.ends_at,
                    is_active=payload.is_active,
                )
                self.promotions[index] = updated
                return updated
        raise HTTPException(status_code=404, detail="Promocion no encontrada")

    def set_promotion_active(self, promotion_id: str, is_active: bool) -> Promotion:
        for index, promotion in enumerate(self.promotions):
            if promotion.id == promotion_id:
                updated = Promotion(
                    id=promotion.id,
                    name=promotion.name,
                    description=promotion.description,
                    promotion_type=promotion.promotion_type,
                    discount_value=promotion.discount_value,
                    is_active=is_active,
                )
                self.promotions[index] = updated
                return updated
        raise HTTPException(status_code=404, detail="Promocion no encontrada")

    def get_sales_kpis(
        self,
        *,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        sales_channel: str | None = None,
    ) -> SalesKpisReport:
        filtered = self.orders
        if sales_channel:
            filtered = [order for order in filtered if order.sales_channel == sales_channel]  # type: ignore[comparison-overlap]
        if start_date:
            filtered = [order for order in filtered if order.created_at and order.created_at >= start_date]
        if end_date:
            filtered = [order for order in filtered if order.created_at and order.created_at <= end_date]

        total_orders = len(filtered)
        total_revenue = float(sum(order.total for order in filtered))
        ticket_average = float(total_revenue / total_orders) if total_orders else 0.0

        units_sold = 0
        product_units: dict[tuple[str, str], int] = {}
        product_revenue: dict[tuple[str, str], float] = {}

        for order in filtered:
            for item in order.items:
                units_sold += item.quantity
                key = (item.product_slug, item.product_name)
                product_units[key] = product_units.get(key, 0) + item.quantity
                product_revenue[key] = product_revenue.get(key, 0.0) + item.line_total

        top_products = sorted(
            [
                TopProductKpi(
                    product_slug=slug,
                    product_name=name,
                    total_units=product_units[(slug, name)],
                    total_revenue=product_revenue[(slug, name)],
                )
                for (slug, name) in product_units.keys()
            ],
            key=lambda item: (item.total_units, item.total_revenue),
            reverse=True,
        )[:5]

        return SalesKpisReport(
            sales_channel=sales_channel,  # type: ignore[arg-type]
            start_date=start_date,
            end_date=end_date,
            total_orders=total_orders,
            ticket_average=ticket_average,
            units_sold=units_sold,
            total_revenue=total_revenue,
            top_products=top_products,
        )

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
