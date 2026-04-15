from app.domain import (
    Category,
    LoyaltyCustomer,
    ProductDetail,
    ProductSummary,
    ProductVariant,
    SalesByVariantReport,
    Supplier,
)

category_permanent = Category(
    id="cat-permanent", name="Coleccion Permanente", slug="coleccion-permanente"
)
category_accessories = Category(
    id="cat-accessories", name="Accesorios", slug="accesorios"
)

supplier_oaxaca = Supplier(
    id="sup-oaxaca",
    name="Comunidades Oaxaquenas",
    ethical_certification="Tejido artesanal certificado",
    country="Mexico",
)
supplier_biotech = Supplier(
    id="sup-biotech",
    name="Bio-Tech Queretaro",
    ethical_certification="Fibras recicladas de bajo impacto",
    country="Mexico",
)

PRODUCTS: list[ProductDetail] = [
    ProductDetail(
        id="prod-tunica-ancestral-lino",
        name="Tunica Ancestral Lino",
        slug="tunica-ancestral-lino",
        description=(
            "Silueta amplia en lino premium con acabado lavado y teñido artesanal "
            "para una caída ligera y arquitectónica."
        ),
        category=category_permanent,
        supplier=supplier_oaxaca,
        sustainability_label="Impacto bajo / teñido natural",
        sustainability_score=94,
        variants=[
            ProductVariant(
                id="var-tunica-s-arena",
                sku="TUNICA-S-ARENA",
                size="S",
                color="Arena",
                stock=6,
                price=3450,
            ),
            ProductVariant(
                id="var-tunica-m-musgo",
                sku="TUNICA-M-MUSGO",
                size="M",
                color="Musgo",
                stock=4,
                price=3450,
            ),
            ProductVariant(
                id="var-tunica-l-terracota",
                sku="TUNICA-L-TERRACOTA",
                size="L",
                color="Terracota",
                stock=3,
                price=3450,
            ),
        ],
    ),
    ProductDetail(
        id="prod-pantalon-canamo-estructural",
        name="Pantalon Canamo Estructural",
        slug="pantalon-canamo-estructural",
        description=(
            "Pantalón de cáñamo con estructura relajada, cintura alta y construcción "
            "duradera para uso diario."
        ),
        category=category_permanent,
        supplier=supplier_biotech,
        sustainability_label="Fibra regenerativa",
        sustainability_score=91,
        variants=[
            ProductVariant(
                id="var-pantalon-s-grafito",
                sku="PANT-S-GRAFITO",
                size="S",
                color="Grafito",
                stock=8,
                price=2800,
            ),
            ProductVariant(
                id="var-pantalon-m-arcilla",
                sku="PANT-M-ARCILLA",
                size="M",
                color="Arcilla",
                stock=6,
                price=2800,
            ),
            ProductVariant(
                id="var-pantalon-xl-grafito",
                sku="PANT-XL-GRAFITO",
                size="XL",
                color="Grafito",
                stock=2,
                price=2950,
            ),
        ],
    ),
    ProductDetail(
        id="prod-camisa-algodon-crudo",
        name="Camisa Algodon Crudo",
        slug="camisa-algodon-crudo",
        description=(
            "Camisa estructurada en algodón orgánico crudo con cuello limpio y "
            "textura visible de alta calidad."
        ),
        category=category_permanent,
        supplier=supplier_oaxaca,
        sustainability_label="Algodon organico certificado",
        sustainability_score=90,
        variants=[
            ProductVariant(
                id="var-camisa-s-crudo",
                sku="CAMISA-S-CRUDO",
                size="S",
                color="Crudo",
                stock=7,
                price=1950,
            ),
            ProductVariant(
                id="var-camisa-m-marfil",
                sku="CAMISA-M-MARFIL",
                size="M",
                color="Marfil",
                stock=5,
                price=1950,
            ),
            ProductVariant(
                id="var-camisa-l-crudo",
                sku="CAMISA-L-CRUDO",
                size="L",
                color="Crudo",
                stock=4,
                price=1950,
            ),
        ],
    ),
    ProductDetail(
        id="prod-chaleco-reciclado-sage",
        name="Chaleco Reciclado Sage",
        slug="chaleco-reciclado-sage",
        description=(
            "Chaleco sin mangas con cuerpo suave, color terroso y confección pensada "
            "para combinar capas."
        ),
        category=category_permanent,
        supplier=supplier_biotech,
        sustainability_label="Lana reciclada posconsumo",
        sustainability_score=88,
        variants=[
            ProductVariant(
                id="var-chaleco-m-sage",
                sku="CHALECO-M-SAGE",
                size="M",
                color="Sage",
                stock=4,
                price=2200,
            ),
            ProductVariant(
                id="var-chaleco-l-tierra",
                sku="CHALECO-L-TIERRA",
                size="L",
                color="Tierra",
                stock=3,
                price=2200,
            ),
        ],
    ),
    ProductDetail(
        id="prod-bolso-piel-de-nopal",
        name="Bolso Piel de Nopal",
        slug="bolso-piel-de-nopal",
        description=(
            "Bolso estructurado con acabado mate y herrajes discretos, hecho en "
            "material vegetal de nopal."
        ),
        category=category_accessories,
        supplier=supplier_biotech,
        sustainability_label="Alternativa vegetal al cuero",
        sustainability_score=93,
        variants=[
            ProductVariant(
                id="var-bolso-unica-negro",
                sku="BOLSO-U-NEGRO",
                size="Unica",
                color="Negro",
                stock=5,
                price=4100,
            ),
            ProductVariant(
                id="var-bolso-unica-tierra",
                sku="BOLSO-U-TIERRA",
                size="Unica",
                color="Tierra",
                stock=2,
                price=4100,
            ),
        ],
    ),
    ProductDetail(
        id="prod-tshirt-carbon-organico",
        name="T-Shirt Carbon Organico",
        slug="tshirt-carbon-organico",
        description=(
            "Playera de algodón orgánico de tacto firme, cuello compacto y estética "
            "sobria para rotación permanente."
        ),
        category=category_permanent,
        supplier=supplier_oaxaca,
        sustainability_label="Basico durable / menor recambio",
        sustainability_score=87,
        variants=[
            ProductVariant(
                id="var-shirt-s-carbon",
                sku="TSHIRT-S-CARBON",
                size="S",
                color="Carbon",
                stock=12,
                price=850,
            ),
            ProductVariant(
                id="var-shirt-m-hueso",
                sku="TSHIRT-M-HUESO",
                size="M",
                color="Hueso",
                stock=10,
                price=850,
            ),
            ProductVariant(
                id="var-shirt-l-carbon",
                sku="TSHIRT-L-CARBON",
                size="L",
                color="Carbon",
                stock=6,
                price=850,
            ),
            ProductVariant(
                id="var-shirt-xl-hueso",
                sku="TSHIRT-XL-HUESO",
                size="XL",
                color="Hueso",
                stock=4,
                price=850,
            ),
        ],
    ),
    ProductDetail(
        id="prod-capa-lino-asimetrica",
        name="Capa Lino Asimetrica",
        slug="capa-lino-asimetrica",
        description=(
            "Capa asimétrica de lino con vuelo suave y caída limpia para looks de "
            "transición entre estaciones."
        ),
        category=category_permanent,
        supplier=supplier_oaxaca,
        sustainability_label="Lino de bajo impacto",
        sustainability_score=89,
        variants=[
            ProductVariant(
                id="var-capa-m-bone",
                sku="CAPA-M-BONE",
                size="M",
                color="Bone",
                stock=4,
                price=2900,
            ),
            ProductVariant(
                id="var-capa-l-arena",
                sku="CAPA-L-ARENA",
                size="L",
                color="Arena",
                stock=3,
                price=2900,
            ),
        ],
    ),
]

LOYALTY_CUSTOMERS: list[LoyaltyCustomer] = [
    LoyaltyCustomer(
        id="cus-maria-fernandez",
        full_name="Maria Fernandez",
        email="maria@ecowear.mx",
        loyalty_points=1280,
    ),
    LoyaltyCustomer(
        id="cus-juan-lopez",
        full_name="Juan Lopez",
        email="juan@ecowear.mx",
        loyalty_points=420,
    ),
]

SALES_REPORT: list[SalesByVariantReport] = [
    SalesByVariantReport(
        size="M", color="Musgo", sales_channel="online", total_units=12, total_revenue=41400
    ),
    SalesByVariantReport(
        size="L", color="Arena", sales_channel="store", total_units=5, total_revenue=17250
    ),
    SalesByVariantReport(
        size="M", color="Marfil", sales_channel="online", total_units=8, total_revenue=15600
    ),
    SalesByVariantReport(
        size="L", color="Carbon", sales_channel="store", total_units=10, total_revenue=8500
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
