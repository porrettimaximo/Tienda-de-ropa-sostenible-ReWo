from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from fastapi import HTTPException

from app.domain import (
    AdminOverview,
    AuthUser,
    Category,
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
from app.services.supabase_client import get_supabase_service_client
from app.services.promotions import apply_best_promotion


class SupabaseRepository:
    def __init__(self) -> None:
        self.client = get_supabase_service_client()
        self.admin_users = [
            AuthUser(
                id="admin-ecowear",
                name="Admin EcoWear",
                email="admin@ecowear.mx",
                role="admin",
            )
        ]

    def is_enabled(self) -> bool:
        return self.client is not None

    def list_products(self) -> list[ProductSummary]:
        return [
            ProductSummary(
                id=product.id,
                name=product.name,
                slug=product.slug,
                category=product.category.name,
                price_from=min(variant.price for variant in product.variants if variant.stock > 0),
                sustainability_label=product.sustainability_label,
                available_colors=sorted({variant.color for variant in product.variants if variant.stock > 0}),
                available_sizes=sorted({variant.size for variant in product.variants if variant.stock > 0}),
            )
            for product in self.list_product_details()
            if any(variant.stock > 0 for variant in product.variants)
        ]

    def list_product_details(self) -> list[ProductDetail]:
        client = self._client()
        products_rows = client.table("products").select("*").eq("is_active", True).execute().data or []
        variants_rows = client.table("product_variants").select("*").eq("is_active", True).execute().data or []
        categories_rows = client.table("categories").select("*").execute().data or []
        suppliers_rows = client.table("suppliers").select("*").execute().data or []

        categories = {
            row["id"]: Category(id=row["id"], name=row["name"], slug=row["slug"])
            for row in categories_rows
        }
        suppliers = {
            row["id"]: Supplier(
                id=row["id"],
                name=row["name"],
                country=row.get("country"),
                organic_certification=row.get("ethical_certification") or row.get("organic_certification"),
                materials=row.get("materials") or [],
                notes=row.get("notes"),
            )
            for row in suppliers_rows
        }

        variants_by_product: dict[str, list[ProductVariant]] = defaultdict(list)
        for row in variants_rows:
            variants_by_product[row["product_id"]].append(
                ProductVariant(
                    id=row["id"],
                    sku=row["sku"],
                    size=row["size"],
                    color=row["color"],
                    stock=row["stock"],
                    price=float(row.get("price_override") or 0),
                )
            )

        products: list[ProductDetail] = []
        for row in products_rows:
            variants = variants_by_product.get(row["id"], [])
            base_price = float(row.get("base_price") or 0)
            normalized_variants = [
                ProductVariant(
                    id=variant.id,
                    sku=variant.sku,
                    size=variant.size,
                    color=variant.color,
                    stock=variant.stock,
                    price=variant.price or base_price,
                )
                for variant in variants
            ]
            products.append(
                ProductDetail(
                    id=row["id"],
                    name=row["name"],
                    slug=row["slug"],
                    description=row.get("description") or "",
                    category=categories.get(
                        row.get("category_id"),
                        Category(id="uncategorized", name="Sin categoria", slug="sin-categoria"),
                    ),
                    supplier=suppliers.get(row.get("supplier_id")),
                    sustainability_label=row.get("sustainability_label"),
                    sustainability_score=row.get("sustainability_score"),
                    variants=normalized_variants,
                )
            )
        return products

    def get_product(self, product_slug: str) -> ProductDetail:
        for product in self.list_product_details():
            if product.slug == product_slug:
                return product
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    def authenticate_client(self, identifier: str, password: str) -> AuthUser:
        if not password:
            raise HTTPException(status_code=400, detail="Password requerida")
        customer = self._find_customer(identifier)
        return AuthUser(
            id=customer.id,
            name=customer.full_name,
            email=customer.email,
            role="client",
        )

    def authenticate_admin(self, identifier: str, password: str) -> AuthUser:
        if not password:
            raise HTTPException(status_code=400, detail="Password requerida")
        for admin in self.admin_users:
            if admin.email == identifier or admin.id == identifier or identifier == "admin":
                return admin
        raise HTTPException(status_code=401, detail="Administrador no encontrado")

    def get_customer(self, customer_id: str) -> LoyaltyCustomer:
        client = self._client()
        rows = client.table("customers").select("*").eq("id", customer_id).limit(1).execute().data or []
        if not rows:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        row = rows[0]
        self._ensure_loyalty_bootstrap(customer_id=row["id"], current_points=int(row.get("loyalty_points") or 0))
        available_points = self._get_available_loyalty_points(row["id"])
        return LoyaltyCustomer(
            id=row["id"],
            full_name=row["full_name"],
            email=row.get("email"),
            loyalty_points=available_points,
        )

    def list_customer_orders(self, customer_id: str) -> list[OrderSummary]:
        client = self._client()
        self.get_customer(customer_id)

        orders_rows = (
            client.table("orders").select("*").eq("customer_id", customer_id).order("created_at", desc=True).execute().data
            or []
        )
        if not orders_rows:
            return []

        order_ids = [row["id"] for row in orders_rows]
        order_items_rows = (
            client.table("order_items").select("*").in_("order_id", order_ids).execute().data or []
        )
        products = {product.id: product for product in self.list_product_details()}
        variants_by_id = {
            variant.id: variant
            for product in products.values()
            for variant in product.variants
        }

        items_by_order: dict[str, list[OrderItem]] = defaultdict(list)
        for row in order_items_rows:
            product = products.get(row["product_id"])
            variant = variants_by_id.get(row["variant_id"])
            if product is None or variant is None:
                continue
            items_by_order[row["order_id"]].append(
                OrderItem(
                    product_slug=product.slug,
                    product_name=product.name,
                    variant_id=variant.id,
                    size=variant.size,
                    color=variant.color,
                    quantity=row["quantity"],
                    unit_price=float(row["unit_price"]),
                    line_total=float(row["total_price"]),
                )
            )

        customer = self.get_customer(customer_id)
        return [
            OrderSummary(
                id=row["id"],
                sales_channel=row["sales_channel"],
                customer_id=customer.id,
                customer_name=customer.full_name,
                created_at=self._parse_ts(row.get("created_at")),
                subtotal=float(row["subtotal"]),
                promotion_discount_total=float(row.get("promotion_discount_total") or row.get("discount_total") or 0),
                loyalty_discount_total=float(row.get("loyalty_discount_total") or 0),
                discount_total=float(row.get("discount_total") or 0),
                total=float(row["total"]),
                promotion_label=row.get("promotion_label")
                or ("Promo aplicada" if float(row.get("discount_total") or 0) > 0 else None),
                loyalty_points_earned=row.get("loyalty_points_earned", 0),
                payment_method=row.get("payment_method"),
                store_name=row.get("store_name"),
                seller=row.get("seller"),
                invoice_required=row.get("invoice_required"),
                invoice_rfc=row.get("invoice_rfc"),
                invoice_business_name=row.get("invoice_business_name"),
                redeemed_points=row.get("redeemed_points") or 0,
                notes=row.get("notes"),
                items=items_by_order.get(row["id"], []),
            )
            for row in orders_rows
        ]

    def create_product(self, payload: ProductUpsertRequest) -> ProductDetail:
        client = self._client()
        inserted = (
            client.table("products")
            .insert(
                {
                    "id": str(uuid4()),
                    "category_id": payload.category_id,
                    "supplier_id": payload.supplier_id,
                    "name": payload.name,
                    "slug": payload.slug,
                    "description": payload.description,
                    "base_price": 0,
                    "sustainability_label": payload.sustainability_label,
                    "sustainability_score": payload.sustainability_score,
                }
            )
            .execute()
            .data
        )
        if not inserted:
            raise HTTPException(status_code=500, detail="No se pudo crear el producto")
        return self.get_product(payload.slug)

    def update_product(self, product_slug: str, payload: ProductUpsertRequest) -> ProductDetail:
        client = self._client()
        current = self.get_product(product_slug)
        client.table("products").update(
            {
                "category_id": payload.category_id,
                "supplier_id": payload.supplier_id,
                "name": payload.name,
                "slug": payload.slug,
                "description": payload.description,
                "sustainability_label": payload.sustainability_label,
                "sustainability_score": payload.sustainability_score,
            }
        ).eq("id", current.id).execute()
        return self.get_product(payload.slug)

    def create_variant(self, product_slug: str, payload: VariantUpsertRequest) -> ProductVariant:
        client = self._client()
        product = self.get_product(product_slug)
        inserted = (
            client.table("product_variants")
            .insert(
                {
                    "id": str(uuid4()),
                    "product_id": product.id,
                    "sku": payload.sku,
                    "size": payload.size,
                    "color": payload.color,
                    "stock": payload.stock,
                    "price_override": payload.price,
                }
            )
            .execute()
            .data
        )
        if not inserted:
            raise HTTPException(status_code=500, detail="No se pudo crear la variante")
        return self.get_product(product_slug).variants[-1]

    def update_variant(
        self, product_slug: str, variant_id: str, payload: VariantUpsertRequest
    ) -> ProductVariant:
        client = self._client()
        self.get_product(product_slug)
        client.table("product_variants").update(
            {
                "sku": payload.sku,
                "size": payload.size,
                "color": payload.color,
                "stock": payload.stock,
                "price_override": payload.price,
            }
        ).eq("id", variant_id).execute()
        for variant in self.get_product(product_slug).variants:
            if variant.id == variant_id:
                return variant
        raise HTTPException(status_code=404, detail="Variante no encontrada")

    def checkout(self, payload: CheckoutRequest, sales_channel: str) -> OrderSummary:
        client = self._client()
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

        customer = None
        if payload.customer_id:
            customer = self.get_customer(payload.customer_id)
        elif payload.customer_email:
            customer = self._find_customer(payload.customer_email)

        items: list[OrderItem] = []
        subtotal = 0.0
        product_slugs: list[str] = []

        for requested_item in payload.items:
            product = self.get_product(requested_item.product_slug)
            variant = next((item for item in product.variants if item.id == requested_item.variant_id), None)
            if variant is None:
                raise HTTPException(status_code=404, detail="Variante no encontrada")
            if variant.stock < requested_item.quantity:
                raise HTTPException(status_code=400, detail="Stock insuficiente")

            new_stock = variant.stock - requested_item.quantity
            client.table("product_variants").update({"stock": new_stock}).eq("id", variant.id).execute()
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
            self._ensure_loyalty_bootstrap(customer_id=customer.id, current_points=customer.loyalty_points)
            available_points = self._get_available_loyalty_points(customer.id)
            if payload.redeem_points % 500 != 0:
                raise HTTPException(status_code=400, detail="Los puntos se canjean en bloques de 500")
            if payload.redeem_points > available_points:
                raise HTTPException(status_code=400, detail="Puntos insuficientes")

            requested_discount = (payload.redeem_points // 500) * 100
            max_redeem_points_by_total = int(total_after_promo // 100) * 500
            if payload.redeem_points > max_redeem_points_by_total:
                raise HTTPException(status_code=400, detail="El canje supera el total de la compra")

            redeemed_points = payload.redeem_points
            loyalty_discount_total = float(requested_discount)

        total = max(0.0, total_after_promo - loyalty_discount_total)
        discount_total = promotion_discount_total + loyalty_discount_total

        loyalty_points = int(total // 10)
        order_id = str(uuid4())
        client.table("orders").insert(
            {
                "id": order_id,
                "customer_id": customer.id if customer else payload.customer_id,
                "sales_channel": sales_channel,
                "status": "paid",
                "subtotal": subtotal,
                "promotion_discount_total": promotion_discount_total,
                "loyalty_discount_total": loyalty_discount_total,
                "discount_total": discount_total,
                "total": total,
                "loyalty_points_earned": loyalty_points,
                "promotion_label": applied_promo.label if applied_promo else None,
                "redeemed_points": redeemed_points,
                "payment_method": payload.payment_method,
                "store_name": payload.store_name,
                "seller": payload.seller,
                "invoice_required": payload.invoice_required,
                "invoice_rfc": payload.invoice_rfc,
                "invoice_business_name": payload.invoice_business_name,
                "notes": payload.notes,
            }
        ).execute()

        for item in items:
            product = self.get_product(item.product_slug)
            client.table("order_items").insert(
                {
                    "id": str(uuid4()),
                    "order_id": order_id,
                    "product_id": product.id,
                    "variant_id": item.variant_id,
                    "quantity": item.quantity,
                    "unit_price": item.unit_price,
                    "total_price": item.line_total,
                }
            ).execute()

        if customer is not None:
            self._ensure_loyalty_bootstrap(customer_id=customer.id, current_points=customer.loyalty_points)

            new_points = self._get_available_loyalty_points(customer.id)
            if redeemed_points:
                client.table("loyalty_movements").insert(
                    {
                        "id": str(uuid4()),
                        "customer_id": customer.id,
                        "order_id": order_id,
                        "movement_type": "redeem",
                        "points": -int(redeemed_points),
                        "reason": "Canje de puntos",
                    }
                ).execute()
                new_points -= int(redeemed_points)

            if loyalty_points:
                client.table("loyalty_movements").insert(
                    {
                        "id": str(uuid4()),
                        "customer_id": customer.id,
                        "order_id": order_id,
                        "movement_type": "earn",
                        "points": int(loyalty_points),
                        "expires_at": (self._now_utc() + timedelta(days=365)).isoformat(),
                        "reason": "Compra registrada",
                    }
                ).execute()
                new_points += int(loyalty_points)

            client.table("customers").update({"loyalty_points": max(0, new_points)}).eq("id", customer.id).execute()

        return OrderSummary(
            id=order_id,
            sales_channel=sales_channel,  # type: ignore[arg-type]
            customer_id=customer.id if customer else payload.customer_id,
            customer_name=customer.full_name if customer else payload.customer_name,
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

    def get_sales_report(self) -> list[SalesByVariantReport]:
        client = self._client()
        rows = client.table("sales_by_size_color").select("*").execute().data or []
        return [
            SalesByVariantReport(
                size=row["size"],
                color=row["color"],
                sales_channel=row["sales_channel"],
                total_units=row["total_units"],
                total_revenue=float(row["total_revenue"]),
            )
            for row in rows
        ]

    def get_sales_report_filtered(
        self,
        *,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        sales_channel: str | None = None,
    ) -> list[SalesByVariantReport]:
        client = self._client()
        query = client.table("orders").select("id,sales_channel,status,created_at")
        if sales_channel:
            query = query.eq("sales_channel", sales_channel)
        if start_date:
            query = query.gte("created_at", start_date.isoformat())
        if end_date:
            query = query.lte("created_at", end_date.isoformat())

        orders_rows = query.execute().data or []
        orders_rows = [row for row in orders_rows if row.get("status") in ("paid", "completed")]
        if not orders_rows:
            return []

        order_channel = {row["id"]: row["sales_channel"] for row in orders_rows}
        order_ids = list(order_channel.keys())
        items_rows = client.table("order_items").select("order_id,variant_id,quantity,total_price").in_("order_id", order_ids).execute().data or []
        if not items_rows:
            return []

        variant_ids = sorted({row["variant_id"] for row in items_rows})
        variants_rows = client.table("product_variants").select("id,size,color").in_("id", variant_ids).execute().data or []
        variant_map = {row["id"]: (row["size"], row["color"]) for row in variants_rows}

        totals: dict[tuple[str, str, str], tuple[int, float]] = {}
        for row in items_rows:
            variant_id = row["variant_id"]
            size_color = variant_map.get(variant_id)
            if not size_color:
                continue
            size, color = size_color
            channel = order_channel.get(row["order_id"])
            if not channel:
                continue
            qty = int(row.get("quantity") or 0)
            revenue = float(row.get("total_price") or 0)
            key = (size, color, channel)
            units, total_rev = totals.get(key, (0, 0.0))
            totals[key] = (units + qty, total_rev + revenue)

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
        products = self.list_product_details()
        low_stock_variants = sum(1 for product in products for variant in product.variants if variant.stock <= 3)
        sales_total = sum(item.total_revenue for item in self.get_sales_report())
        return AdminOverview(
            low_stock_variants=low_stock_variants,
            active_promotions=len(self.list_promotions(active_only=True)),
            ethical_suppliers=len(self.list_suppliers()),
            sales_total=sales_total,
        )

    def list_suppliers(self) -> list[Supplier]:
        client = self._client()
        rows = client.table("suppliers").select("*").execute().data or []
        return [
            Supplier(
                id=row["id"],
                name=row["name"],
                country=row.get("country"),
                organic_certification=row.get("ethical_certification") or row.get("organic_certification"),
                materials=row.get("materials") or [],
                notes=row.get("notes"),
            )
            for row in rows
        ]

    def create_supplier(self, payload: SupplierUpsertRequest) -> Supplier:
        client = self._client()
        supplier_id = str(uuid4())
        inserted = (
            client.table("suppliers")
            .insert(
                {
                    "id": supplier_id,
                    "name": payload.name,
                    "country": payload.country,
                    "ethical_certification": payload.organic_certification,
                    "materials": payload.materials,
                    "notes": payload.notes,
                }
            )
            .execute()
            .data
        )
        if not inserted:
            raise HTTPException(status_code=500, detail="No se pudo crear el proveedor")
        rows = client.table("suppliers").select("*").eq("id", supplier_id).limit(1).execute().data or []
        row = rows[0]
        return Supplier(
            id=row["id"],
            name=row["name"],
            country=row.get("country"),
            organic_certification=row.get("ethical_certification") or row.get("organic_certification"),
            materials=row.get("materials") or [],
            notes=row.get("notes"),
        )

    def update_supplier(self, supplier_id: str, payload: SupplierUpsertRequest) -> Supplier:
        client = self._client()
        client.table("suppliers").update(
            {
                "name": payload.name,
                "country": payload.country,
                "ethical_certification": payload.organic_certification,
                "materials": payload.materials,
                "notes": payload.notes,
            }
        ).eq("id", supplier_id).execute()
        rows = client.table("suppliers").select("*").eq("id", supplier_id).limit(1).execute().data or []
        if not rows:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado")
        row = rows[0]
        return Supplier(
            id=row["id"],
            name=row["name"],
            country=row.get("country"),
            organic_certification=row.get("ethical_certification") or row.get("organic_certification"),
            materials=row.get("materials") or [],
            notes=row.get("notes"),
        )

    def list_promotions(self, active_only: bool = True) -> list[Promotion]:
        client = self._client()
        query = client.table("promotions").select("*")
        rows = query.execute().data or []
        promotions = [
            Promotion(
                id=row["id"],
                name=row["name"],
                description=row.get("description"),
                promotion_type=row["promotion_type"],
                discount_value=float(row.get("discount_value") or 0),
                starts_at=self._parse_ts(row.get("starts_at")),
                ends_at=self._parse_ts(row.get("ends_at")),
                is_active=row.get("is_active", True),
            )
            for row in rows
        ]
        if not active_only:
            return promotions

        now = self._now_utc()
        return [
            promo
            for promo in promotions
            if promo.is_active
            and (promo.starts_at is None or promo.starts_at <= now)
            and (promo.ends_at is None or promo.ends_at >= now)
        ]

    def create_promotion(self, payload: PromotionUpsertRequest) -> Promotion:
        client = self._client()
        promotion_id = str(uuid4())
        inserted = (
            client.table("promotions")
            .insert(
                {
                    "id": promotion_id,
                    "name": payload.name,
                    "description": payload.description,
                    "promotion_type": payload.promotion_type,
                    "discount_value": payload.discount_value,
                    "starts_at": payload.starts_at.isoformat() if payload.starts_at else None,
                    "ends_at": payload.ends_at.isoformat() if payload.ends_at else None,
                    "is_active": payload.is_active,
                }
            )
            .execute()
            .data
        )
        if not inserted:
            raise HTTPException(status_code=500, detail="No se pudo crear la promocion")
        rows = client.table("promotions").select("*").eq("id", promotion_id).limit(1).execute().data or []
        row = rows[0]
        return Promotion(
            id=row["id"],
            name=row["name"],
            description=row.get("description"),
            promotion_type=row["promotion_type"],
            discount_value=float(row.get("discount_value") or 0),
            starts_at=self._parse_ts(row.get("starts_at")),
            ends_at=self._parse_ts(row.get("ends_at")),
            is_active=row.get("is_active", True),
        )

    def update_promotion(self, promotion_id: str, payload: PromotionUpsertRequest) -> Promotion:
        client = self._client()
        client.table("promotions").update(
            {
                "name": payload.name,
                "description": payload.description,
                "promotion_type": payload.promotion_type,
                "discount_value": payload.discount_value,
                "starts_at": payload.starts_at.isoformat() if payload.starts_at else None,
                "ends_at": payload.ends_at.isoformat() if payload.ends_at else None,
                "is_active": payload.is_active,
            }
        ).eq("id", promotion_id).execute()
        rows = client.table("promotions").select("*").eq("id", promotion_id).limit(1).execute().data or []
        if not rows:
            raise HTTPException(status_code=404, detail="Promocion no encontrada")
        row = rows[0]
        return Promotion(
            id=row["id"],
            name=row["name"],
            description=row.get("description"),
            promotion_type=row["promotion_type"],
            discount_value=float(row.get("discount_value") or 0),
            starts_at=self._parse_ts(row.get("starts_at")),
            ends_at=self._parse_ts(row.get("ends_at")),
            is_active=row.get("is_active", True),
        )

    def set_promotion_active(self, promotion_id: str, is_active: bool) -> Promotion:
        client = self._client()
        client.table("promotions").update({"is_active": is_active}).eq("id", promotion_id).execute()
        rows = client.table("promotions").select("*").eq("id", promotion_id).limit(1).execute().data or []
        if not rows:
            raise HTTPException(status_code=404, detail="Promocion no encontrada")
        row = rows[0]
        return Promotion(
            id=row["id"],
            name=row["name"],
            description=row.get("description"),
            promotion_type=row["promotion_type"],
            discount_value=float(row.get("discount_value") or 0),
            starts_at=self._parse_ts(row.get("starts_at")),
            ends_at=self._parse_ts(row.get("ends_at")),
            is_active=row.get("is_active", True),
        )

    def _find_customer(self, identifier: str) -> LoyaltyCustomer:
        client = self._client()
        by_email = client.table("customers").select("*").eq("email", identifier).limit(1).execute().data or []
        rows = by_email or client.table("customers").select("*").eq("id", identifier).limit(1).execute().data or []
        if not rows:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        row = rows[0]
        self._ensure_loyalty_bootstrap(customer_id=row["id"], current_points=int(row.get("loyalty_points") or 0))
        available_points = self._get_available_loyalty_points(row["id"])
        return LoyaltyCustomer(
            id=row["id"],
            full_name=row["full_name"],
            email=row.get("email"),
            loyalty_points=available_points,
        )

    def get_sales_kpis(
        self,
        *,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        sales_channel: str | None = None,
    ) -> SalesKpisReport:
        client = self._client()
        query = client.table("orders").select("*")
        if sales_channel:
            query = query.eq("sales_channel", sales_channel)
        if start_date:
            query = query.gte("created_at", start_date.isoformat())
        if end_date:
            query = query.lte("created_at", end_date.isoformat())

        orders_rows = query.order("created_at", desc=True).execute().data or []
        orders_rows = [row for row in orders_rows if row.get("status") in ("paid", "completed")]
        if not orders_rows:
            return SalesKpisReport(
                sales_channel=sales_channel,  # type: ignore[arg-type]
                start_date=start_date,
                end_date=end_date,
                total_orders=0,
                ticket_average=0,
                units_sold=0,
                total_revenue=0,
                top_products=[],
            )

        order_ids = [row["id"] for row in orders_rows]
        items_rows = client.table("order_items").select("*").in_("order_id", order_ids).execute().data or []

        products = {product.id: product for product in self.list_product_details()}

        total_orders = len(orders_rows)
        total_revenue = float(sum(float(row.get("total") or 0) for row in orders_rows))
        ticket_average = float(total_revenue / total_orders) if total_orders else 0.0

        units_sold = 0
        product_units: dict[tuple[str, str], int] = {}
        product_revenue: dict[tuple[str, str], float] = {}

        for row in items_rows:
            product = products.get(row["product_id"])
            if product is None:
                continue
            qty = int(row.get("quantity") or 0)
            revenue = float(row.get("total_price") or 0)
            units_sold += qty
            key = (product.slug, product.name)
            product_units[key] = product_units.get(key, 0) + qty
            product_revenue[key] = product_revenue.get(key, 0.0) + revenue

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

    def _now_utc(self) -> datetime:
        return datetime.now(timezone.utc)

    def _parse_ts(self, value: object) -> datetime | None:
        if value is None:
            return None
        if isinstance(value, datetime):
            return value
        text = str(value)
        if not text:
            return None
        try:
            return datetime.fromisoformat(text.replace("Z", "+00:00"))
        except ValueError:
            return None

    def _ensure_loyalty_bootstrap(self, *, customer_id: str, current_points: int) -> None:
        client = self._client()
        existing = (
            client.table("loyalty_movements")
            .select("id")
            .eq("customer_id", customer_id)
            .limit(1)
            .execute()
            .data
            or []
        )
        if existing:
            return
        if current_points <= 0:
            return
        client.table("loyalty_movements").insert(
            {
                "id": str(uuid4()),
                "customer_id": customer_id,
                "movement_type": "adjustment",
                "points": int(current_points),
                "expires_at": (self._now_utc() + timedelta(days=365)).isoformat(),
                "reason": "Migracion puntos existentes",
            }
        ).execute()

    def _get_available_loyalty_points(self, customer_id: str) -> int:
        client = self._client()
        rows = (
            client.table("loyalty_movements")
            .select("points,movement_type,expires_at")
            .eq("customer_id", customer_id)
            .execute()
            .data
            or []
        )
        now = self._now_utc()
        total = 0
        for row in rows:
            points = int(row.get("points") or 0)
            movement_type = row.get("movement_type")
            expires_at = self._parse_ts(row.get("expires_at"))
            if movement_type == "earn" or movement_type == "adjustment":
                if expires_at is not None and expires_at < now:
                    continue
            total += points
        return max(0, total)

    def _client(self):
        if self.client is None:
            raise RuntimeError("Supabase no configurado")
        return self.client
