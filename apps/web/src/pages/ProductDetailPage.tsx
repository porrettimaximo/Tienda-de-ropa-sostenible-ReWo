import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useCart } from "../components/CartContext";
import {
  getCatalogProduct,
  getCatalogProducts,
  type CatalogProduct
} from "../lib/api";

function getStockTone(stock: number) {
  if (stock <= 2) return "text-error";
  if (stock <= 5) return "text-tertiary";
  return "text-secondary";
}

export function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<CatalogProduct | undefined>();
  const [relatedProducts, setRelatedProducts] = useState<CatalogProduct[]>([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!slug) return;

    let active = true;

    getCatalogProduct(slug).then((data) => {
      if (!active || !data) return;

      setProduct(data);
      setSelectedColor(data.variants[0]?.color ?? data.colors[0] ?? "");
      setSelectedSize(data.variants[0]?.size ?? data.sizes[0] ?? "");
    });

    getCatalogProducts().then((data) => {
      if (!active) return;
      setRelatedProducts(data.filter((item) => item.slug !== slug).slice(0, 3));
    });

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    setQuantity(1);
    setFeedback("");
  }, [selectedColor, selectedSize, slug]);

  if (!product) {
    return (
      <main className="px-5 py-24 md:px-12">
        <p className="text-sm uppercase tracking-[0.2em] text-on-surface-variant">
          Producto no encontrado
        </p>
        <Link className="mt-6 inline-block underline underline-offset-4" to="/collections">
          Volver a coleccion
        </Link>
      </main>
    );
  }

  const availableColors = [...new Set(product.variants.map((variant) => variant.color))];
  const availableSizes = [...new Set(product.variants.map((variant) => variant.size))];

  const compatibleVariants = product.variants.filter(
    (variant) =>
      (selectedColor.length === 0 || variant.color === selectedColor) &&
      (selectedSize.length === 0 || variant.size === selectedSize)
  );

  const selectedVariant =
    compatibleVariants[0] ??
    product.variants.find((variant) => variant.color === selectedColor) ??
    product.variants.find((variant) => variant.size === selectedSize) ??
    product.variants[0];

  const availableSizesForColor = new Set(
    product.variants
      .filter((variant) => selectedColor.length === 0 || variant.color === selectedColor)
      .map((variant) => variant.size)
  );

  const availableColorsForSize = new Set(
    product.variants
      .filter((variant) => selectedSize.length === 0 || variant.size === selectedSize)
      .map((variant) => variant.color)
  );

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock <= 0) return;

    const safeQuantity = Math.min(quantity, selectedVariant.stock);

    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      image: product.image,
      variantId: selectedVariant.id,
      sku: selectedVariant.sku,
      size: selectedVariant.size,
      color: selectedVariant.color,
      quantity: safeQuantity,
      unitPrice: selectedVariant.price,
      priceLabel: selectedVariant.priceLabel,
      image: selectedVariant.image_url || product.image // Ensure cart uses variant image
    });

    setFeedback(`Agregaste ${safeQuantity} pieza(s) a tu bolsa.`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  return (
    <main className="px-5 py-10 md:px-8 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-5">
          <div className="relative aspect-[4/5] overflow-hidden border border-outline-variant/30 bg-surface-container-low">
            <img className={`h-full w-full object-cover ${(selectedVariant?.stock ?? 0) === 0 ? 'grayscale opacity-60' : ''}`} src={selectedVariant?.image_url || product.image} alt={product.name} />
            {(selectedVariant?.stock ?? 0) === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <span className="bg-error px-6 py-3 text-[0.8rem] font-black uppercase tracking-[0.3em] text-white shadow-2xl rotate-[-3deg]">
                  Fuera de Stock
                </span>
              </div>
            )}
          </div>
        </section>

        <section className="border border-outline-variant/30 bg-white p-6 md:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="bg-secondary-container px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-secondary-container">
              {product.category}
            </span>
            <span className="border border-outline/30 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
              {product.sustainability}
            </span>
          </div>

          <h1 className="mt-5 font-headline text-4xl font-black uppercase tracking-tighter text-inverse-surface md:text-6xl">
            {product.name}
          </h1>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-on-surface-variant">
            {product.subtitle}
          </p>
          <p className="mt-6 text-base leading-relaxed text-on-surface">{product.description}</p>

          <div className="mt-8 grid gap-4 border-y border-outline-variant/30 py-6 md:grid-cols-3">
            <DetailMetric label="Precio" value={selectedVariant?.priceLabel ?? product.priceLabel} />
            <DetailMetric
              label="Stock"
              value={selectedVariant ? `${selectedVariant.stock} disponibles` : "Sin stock"}
              valueClassName={selectedVariant ? getStockTone(selectedVariant.stock) : "text-error"}
            />
            <DetailMetric label="Proveedor" value={product.supplierName ?? "EcoWear partners"} />
          </div>

          <div className="mt-8 space-y-8">
            <div>
              <p className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                Color
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {availableColors.map((color) => {
                  const enabled = availableColorsForSize.has(color);

                  return (
                    <button
                      key={color}
                      className={`border px-4 py-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] ${
                        selectedColor === color
                          ? "border-inverse-surface bg-inverse-surface text-surface"
                          : enabled
                            ? "border-outline/30 bg-surface hover:border-inverse-surface"
                            : "cursor-not-allowed border-outline/20 bg-[#f2f4f4] text-on-surface-variant/40"
                      }`}
                      disabled={!enabled}
                      onClick={() => {
                        setSelectedColor(color);
                        const nextVariant = product.variants.find(
                          (variant) =>
                            variant.color === color &&
                            (selectedSize.length === 0 || variant.size === selectedSize)
                        );
                        if (!nextVariant) {
                          const fallbackVariant = product.variants.find((variant) => variant.color === color);
                          setSelectedSize(fallbackVariant?.size ?? "");
                        }
                      }}
                      type="button"
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                Talla
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {availableSizes.map((size) => {
                  const enabled = availableSizesForColor.has(size);

                  return (
                    <button
                      key={size}
                      className={`border px-4 py-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] ${
                        selectedSize === size
                          ? "border-inverse-surface bg-inverse-surface text-surface"
                          : enabled
                            ? "border-outline/30 bg-surface hover:border-inverse-surface"
                            : "cursor-not-allowed border-outline/20 bg-[#f2f4f4] text-on-surface-variant/40"
                      }`}
                      disabled={!enabled}
                      onClick={() => {
                        setSelectedSize(size);
                        const nextVariant = product.variants.find(
                          (variant) =>
                            variant.size === size &&
                            (selectedColor.length === 0 || variant.color === selectedColor)
                        );
                        if (!nextVariant) {
                          const fallbackVariant = product.variants.find((variant) => variant.size === size);
                          setSelectedColor(fallbackVariant?.color ?? "");
                        }
                      }}
                      type="button"
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[160px_1fr]">
              <label className="block">
                <span className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                  Cantidad
                </span>
                <input
                  className="mt-3 w-full border border-outline/30 bg-surface px-4 py-3 text-sm outline-none focus:border-inverse-surface"
                  max={selectedVariant?.stock ?? 1}
                  min={1}
                  onChange={(event) =>
                    setQuantity(
                      Math.min(
                        Math.max(1, Number(event.target.value) || 1),
                        selectedVariant?.stock ?? 1
                      )
                    )
                  }
                  type="number"
                  value={quantity}
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  className="border border-inverse-surface px-6 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] hover:bg-inverse-surface hover:text-surface disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!selectedVariant || selectedVariant.stock <= 0}
                  onClick={handleAddToCart}
                  type="button"
                >
                  Agregar a bolsa
                </button>
                <button
                  className="bg-inverse-surface px-6 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!selectedVariant || selectedVariant.stock <= 0}
                  onClick={handleBuyNow}
                  type="button"
                >
                  Comprar ahora
                </button>
              </div>
            </div>

            {selectedVariant ? (
              <div className="border border-outline-variant/30 bg-[#f2f4f4] p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                      Variante activa
                    </p>
                    <p className="mt-2 text-lg font-black">
                      {selectedVariant.color} / {selectedVariant.size}
                    </p>
                    <p className="mt-1 text-sm text-on-surface-variant">SKU {selectedVariant.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                      Stock
                    </p>
                    <p className={`mt-2 text-lg font-black ${getStockTone(selectedVariant.stock)}`}>
                      {selectedVariant.stock} unidades
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {feedback ? <p className="text-sm text-secondary">{feedback}</p> : null}
          </div>

          <div className="mt-8 grid gap-4 border-t border-outline-variant/30 pt-6 md:grid-cols-2">
            <InfoCard title="Composicion" value={product.composition} />
            <InfoCard
              title="Trazabilidad"
              value={
                product.sustainabilityScore
                  ? `Score de sostenibilidad ${product.sustainabilityScore}/100`
                  : product.sustainability
              }
            />
          </div>
        </section>
      </div>

      <section className="mt-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-tertiary">
              Continuar comprando
            </p>
            <h2 className="mt-3 font-headline text-3xl font-black uppercase tracking-tighter">
              Mas piezas del catalogo
            </h2>
          </div>
          <Link className="text-[0.7rem] font-black uppercase tracking-[0.2em] underline underline-offset-4" to="/collections">
            Ver coleccion completa
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {relatedProducts.map((item) => (
            <Link key={item.slug} className="border border-outline-variant/30 bg-white" to={`/products/${item.slug}`}>
              <div className="aspect-[4/5] overflow-hidden bg-surface-container-low">
                <img
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <div className="p-5">
                <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
                  {item.category}
                </p>
                <h3 className="mt-2 font-headline text-xl font-black uppercase tracking-tighter">
                  {item.name}
                </h3>
                <p className="mt-3 text-sm text-on-surface-variant">{item.subtitle}</p>
                <p className="mt-4 text-lg font-black">{item.priceLabel}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function DetailMetric({
  label,
  value,
  valueClassName = ""
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
        {label}
      </p>
      <p className={`mt-3 text-lg font-black ${valueClassName}`}>{value}</p>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="border border-outline-variant/30 bg-[#f2f4f4] p-4">
      <p className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
        {title}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-on-surface">{value}</p>
    </div>
  );
}
