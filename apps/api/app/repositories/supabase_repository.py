from __future__ import annotations

from collections import defaultdict
from uuid import uuid4

from fastapi import HTTPException

from app.domain import (
    AdminOverview,
    AuthUser,
    Category,
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
from app.services.supabase_client import get_supabase_client


class SupabaseRepository:
    def __init__(self) -> None:
        self.client = get_supabase_client()
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
                price_from=min(variant.price for variant in product.variants),
                sustainability_label=product.sustainability_label,
                available_colors=sorted({variant.color for variant in product.variants}),
                available_sizes=sorted({variant.size for variant in product.variants}),
            )
            for product in self.list_product_details()
            if product.variants
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
                ethical_certification=row.get("ethical_certification"),
                country=row.get("country"),
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
        return LoyaltyCustomer(
            id=row["id"],
            full_name=row["full_name"],
            email=row.get("email"),
            loyalty_points=row["loyalty_points"],
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
                subtotal=float(row["subtotal"]),
                total=float(row["total"]),
                loyalty_points_earned=row.get("loyalty_points_earned", 0),
                payment_method=row.get("payment_method"),
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

        customer = None
        if payload.customer_id:
            customer = self.get_customer(payload.customer_id)
        elif payload.customer_email:
            customer = self._find_customer(payload.customer_email)

        items: list[OrderItem] = []
        subtotal = 0.0

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

        loyalty_points = int(subtotal // 100) * 10
        order_id = str(uuid4())
        client.table("orders").insert(
            {
                "id": order_id,
                "customer_id": customer.id if customer else payload.customer_id,
                "sales_channel": sales_channel,
                "status": "paid",
                "subtotal": subtotal,
                "discount_total": 0,
                "total": subtotal,
                "loyalty_points_earned": loyalty_points,
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
            client.table("customers").update({"loyalty_points": customer.loyalty_points + loyalty_points}).eq("id", customer.id).execute()

        return OrderSummary(
            id=order_id,
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

    def get_admin_overview(self) -> AdminOverview:
        products = self.list_product_details()
        low_stock_variants = sum(1 for product in products for variant in product.variants if variant.stock <= 3)
        sales_total = sum(item.total_revenue for item in self.get_sales_report())
        return AdminOverview(
            low_stock_variants=low_stock_variants,
            active_promotions=3,
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
                ethical_certification=row.get("ethical_certification"),
                country=row.get("country"),
            )
            for row in rows
        ]

    def _find_customer(self, identifier: str) -> LoyaltyCustomer:
        client = self._client()
        by_email = client.table("customers").select("*").eq("email", identifier).limit(1).execute().data or []
        rows = by_email or client.table("customers").select("*").eq("id", identifier).limit(1).execute().data or []
        if not rows:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        row = rows[0]
        return LoyaltyCustomer(
            id=row["id"],
            full_name=row["full_name"],
            email=row.get("email"),
            loyalty_points=row["loyalty_points"],
        )

    def _client(self):
        if self.client is None:
            raise RuntimeError("Supabase no configurado")
        return self.client
