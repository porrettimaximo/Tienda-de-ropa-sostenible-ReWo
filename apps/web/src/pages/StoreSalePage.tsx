import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAdminProducts,
  submitStoreSale,
  type AdminProduct,
  type CatalogVariant
} from "../lib/api";

type StoreDraftItem = {
  productSlug: string;
  productName: string;
  variantId: string;
  label: string;
  quantity: number;
  unitPrice: number;
};

export function StoreSalePage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [selectedVariantByProduct, setSelectedVariantByProduct] = useState<Record<string, string>>({});
  const [quantityByProduct, setQuantityByProduct] = useState<Record<string, number>>({});
  const [ticket, setTicket] = useState<StoreDraftItem[]>([]);
  const [storeName, setStoreName] = useState("Flagship Polanco");
  const [seller, setSeller] = useState("Andrea Ruiz");
  const [customerName, setCustomerName] = useState("Cliente mostrador");
  const [paymentMethod, setPaymentMethod] = useState("Tarjeta");
  const [loyaltyEmail, setLoyaltyEmail] = useState("maria@ecowear.mx");
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getAdminProducts().then((data) => {
      if (!active) return;

      setProducts(data);
      setSelectedVariantByProduct(
        Object.fromEntries(
          data.map((product) => [product.slug, product.variants[0]?.id ?? ""])
        )
      );
      setQuantityByProduct(
        Object.fromEntries(
          data.map((product) => [product.slug, 1])
        )
      );
    });

    return () => {
      active = false;
    };
  }, []);

  const total = ticket.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const loyaltyPreview = Math.floor(total / 100) * 10;

  function getSelectedVariant(product: AdminProduct): CatalogVariant | undefined {
    const variantId = selectedVariantByProduct[product.slug];
    return product.variants.find((variant) => variant.id === variantId) ?? product.variants[0];
  }

  function addToTicket(product: AdminProduct) {
    const selectedVariant = getSelectedVariant(product);
    if (!selectedVariant) return;

    const quantity = Math.max(1, quantityByProduct[product.slug] ?? 1);
    const label = `${selectedVariant.color} / ${selectedVariant.size}`;

    setTicket((current) => {
      const existing = current.find((item) => item.variantId === selectedVariant.id);
      if (existing) {
        return current.map((item) =>
          item.variantId === selectedVariant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...current,
        {
          productSlug: product.slug,
          productName: product.name,
          variantId: selectedVariant.id,
          label,
          quantity,
          unitPrice: selectedVariant.price
        }
      ];
    });
  }

  async function handleSubmitSale() {
    if (ticket.length === 0) {
      setError("Agrega al menos una variante al ticket antes de registrar la venta.");
      return;
    }

    try {
      setError("");
      setStatusMessage("");

      const order = await submitStoreSale({
        customerName,
        customerEmail: loyaltyEmail,
        paymentMethod,
        notes: `Venta mostrador / ${storeName} / ${seller}`,
        items: ticket.map((item) => ({
          productSlug: item.productSlug,
          variantId: item.variantId,
          quantity: item.quantity
        }))
      });

      setStatusMessage(`Venta ${order.id} registrada correctamente.`);
      setTicket([]);
    } catch {
      setError("No se pudo registrar la venta fisica.");
    }
  }

  return (
    <main className="px-5 py-12 md:px-8 lg:px-12">
      <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
            Admin / Venta fisica
          </span>
          <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter text-inverse-surface md:text-7xl">
            Registro mostrador
          </h1>
        </div>
        <Link
          className="w-fit border border-inverse-surface px-6 py-3 text-[0.65rem] font-black uppercase tracking-[0.2em] hover:bg-inverse-surface hover:text-surface"
          to="/admin"
        >
          Volver al panel
        </Link>
      </header>

      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-8 border border-outline-variant/30 p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="border border-outline/30 px-4 py-4 text-sm"
              onChange={(event) => setStoreName(event.target.value)}
              value={storeName}
            />
            <input
              className="border border-outline/30 px-4 py-4 text-sm"
              onChange={(event) => setSeller(event.target.value)}
              value={seller}
            />
            <input
              className="border border-outline/30 px-4 py-4 text-sm md:col-span-2"
              onChange={(event) => setCustomerName(event.target.value)}
              value={customerName}
            />
            <input
              className="border border-outline/30 px-4 py-4 text-sm"
              onChange={(event) => setPaymentMethod(event.target.value)}
              value={paymentMethod}
            />
            <input
              className="border border-outline/30 px-4 py-4 text-sm"
              onChange={(event) => setLoyaltyEmail(event.target.value)}
              value={loyaltyEmail}
            />
          </div>

          <div className="border-t border-outline-variant/30 pt-8">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
              Seleccion de productos
            </h2>
            <div className="mt-6 space-y-4">
              {products.slice(0, 5).map((product) => {
                const selectedVariant = getSelectedVariant(product);

                return (
                  <div
                    key={product.slug}
                    className="border border-outline-variant/20 p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="font-headline text-lg font-black uppercase tracking-tighter">
                          {product.name}
                        </p>
                        <p className="mt-1 text-sm text-on-surface-variant">{product.category}</p>
                      </div>
                      <p className="text-sm font-bold">{selectedVariant?.priceLabel}</p>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-[1fr_120px_auto]">
                      <select
                        className="border border-outline/30 px-4 py-3 text-sm"
                        onChange={(event) =>
                          setSelectedVariantByProduct((current) => ({
                            ...current,
                            [product.slug]: event.target.value
                          }))
                        }
                        value={selectedVariant?.id ?? ""}
                      >
                        {product.variants.map((variant) => (
                          <option key={variant.id} value={variant.id}>
                            {variant.color} / {variant.size} / stock {variant.stock}
                          </option>
                        ))}
                      </select>

                      <input
                        className="border border-outline/30 px-3 py-3 text-center text-sm"
                        min={1}
                        onChange={(event) =>
                          setQuantityByProduct((current) => ({
                            ...current,
                            [product.slug]: Number(event.target.value) || 1
                          }))
                        }
                        type="number"
                        value={quantityByProduct[product.slug] ?? 1}
                      />

                      <button
                        className="bg-inverse-surface px-5 py-3 text-[0.65rem] font-black uppercase tracking-[0.2em] text-surface hover:bg-secondary"
                        onClick={() => addToTicket(product)}
                        type="button"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="h-fit bg-[#f2f4f4] p-8">
          <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
            Ticket de venta
          </h2>
          <div className="mt-8 space-y-4 border-b border-outline-variant/30 pb-8">
            {ticket.length === 0 ? (
              <p className="text-sm text-on-surface-variant">
                Aun no agregaste variantes al ticket.
              </p>
            ) : (
              ticket.map((item) => (
                <div key={item.variantId} className="flex justify-between gap-4 text-sm">
                  <div>
                    <p>{item.productName}</p>
                    <p className="mt-1 text-on-surface-variant">
                      {item.label} / {item.quantity} pieza(s)
                    </p>
                  </div>
                  <span>${(item.unitPrice * item.quantity).toLocaleString("es-MX")} MXN</span>
                </div>
              ))
            )}
            <div className="flex justify-between text-sm text-secondary">
              <span>Puntos Eco generados</span>
              <span>+{loyaltyPreview}</span>
            </div>
          </div>
          <p className="mt-8 text-3xl font-black">${total.toLocaleString("es-MX")} MXN</p>
          <button
            className="mt-8 w-full bg-inverse-surface px-8 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary"
            onClick={handleSubmitSale}
            type="button"
          >
            Registrar venta fisica
          </button>
          {statusMessage ? <p className="mt-4 text-sm text-secondary">{statusMessage}</p> : null}
          {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}
        </aside>
      </div>
    </main>
  );
}
