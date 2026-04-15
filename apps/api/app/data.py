from app.domain import (
    Category,
    LoyaltyCustomer,
    ProductDetail,
    ProductSummary,
    ProductVariant,
    SalesByVariantReport,
    Supplier,
)

category_outerwear = Category(id="cat-outerwear", name="Abrigos", slug="abrigos")
category_basics = Category(id="cat-basics", name="Basicos", slug="basicos")

supplier_green = Supplier(
    id="sup-green-thread",
    name="Green Thread Collective",
    ethical_certification="Fair Trade Textile Standard",
    country="Mexico",
)

PRODUCTS: list[ProductDetail] = [
    ProductDetail(
        id="prod-campera-luma",
        name="Campera Luma",
        slug="campera-luma",
        description="Campera urbana con exterior reciclado y forro liviano.",
        category=category_outerwear,
        supplier=supplier_green,
        sustainability_label="Reciclado certificado",
        sustainability_score=87,
        variants=[
            ProductVariant(
                id="var-luma-s-musgo",
                sku="LUMA-S-MUSGO",
                size="S",
                color="Musgo",
                stock=4,
                price=89900,
            ),
            ProductVariant(
                id="var-luma-m-musgo",
                sku="LUMA-M-MUSGO",
                size="M",
                color="Musgo",
                stock=7,
                price=89900,
            ),
            ProductVariant(
                id="var-luma-l-arena",
                sku="LUMA-L-ARENA",
                size="L",
                color="Arena",
                stock=3,
                price=92900,
            ),
        ],
    ),
    ProductDetail(
        id="prod-buzo-nativa",
        name="Buzo Nativa",
        slug="buzo-nativa",
        description="Buzo de algodon organico con interior suave y fit relajado.",
        category=category_basics,
        supplier=supplier_green,
        sustainability_label="Algodon organico",
        sustainability_score=91,
        variants=[
            ProductVariant(
                id="var-nativa-m-crema",
                sku="NATIVA-M-CREMA",
                size="M",
                color="Crema",
                stock=11,
                price=46500,
            ),
            ProductVariant(
                id="var-nativa-l-tierra",
                sku="NATIVA-L-TIERRA",
                size="L",
                color="Tierra",
                stock=6,
                price=46500,
            ),
        ],
    ),
]

LOYALTY_CUSTOMERS: list[LoyaltyCustomer] = [
    LoyaltyCustomer(
        id="cus-maria-fernandez",
        full_name="Maria Fernandez",
        email="maria@example.com",
        loyalty_points=280,
    ),
    LoyaltyCustomer(
        id="cus-juan-lopez",
        full_name="Juan Lopez",
        email="juan@example.com",
        loyalty_points=120,
    ),
]

SALES_REPORT: list[SalesByVariantReport] = [
    SalesByVariantReport(
        size="M", color="Musgo", sales_channel="online", total_units=12, total_revenue=1078800
    ),
    SalesByVariantReport(
        size="L", color="Arena", sales_channel="store", total_units=5, total_revenue=464500
    ),
    SalesByVariantReport(
        size="M", color="Crema", sales_channel="online", total_units=18, total_revenue=837000
    ),
]


def get_product_summaries() -> list[ProductSummary]:
    summaries: list[ProductSummary] = []
    for product in PRODUCTS:
        colors = sorted({variant.color for variant in product.variants})
        sizes = sorted({variant.size for variant in product.variants})
        price_from = min(variant.price for variant in product.variants)
        summaries.append(
            ProductSummary(
                id=product.id,
                name=product.name,
                slug=product.slug,
                category=product.category.name,
                price_from=price_from,
                sustainability_label=product.sustainability_label,
                available_colors=colors,
                available_sizes=sizes,
            )
        )
    return summaries
