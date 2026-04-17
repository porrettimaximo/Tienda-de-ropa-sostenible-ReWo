import { Link } from "react-router-dom";

import { useCart } from "../components/CartContext";

export function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const distinctProducts = new Set(items.map((item) => item.productSlug)).size;
  const estimatedPromotionDiscount = subtotal >= 5000 && distinctProducts >= 2 ? 350 : 0;
  const estimatedTotal = Math.max(0, subtotal - estimatedPromotionDiscount);
  const loyaltyPreview = Math.floor(estimatedTotal / 10);

  if (items.length === 0) {
    return (
      <main className="px-5 py-16 md:px-8 lg:px-12">
        <section className="border border-dashed border-outline/40 bg-white px-6 py-20 text-center">
          <p className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-tertiary">
            Bolsa vacia
          </p>
          <h1 className="mt-4 font-headline text-4xl font-black uppercase tracking-tighter md:text-6xl">
            Tu seleccion todavia no tiene piezas
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-on-surface-variant">
            Explora el catalogo, elige tu variante favorita y la veras aqui lista para checkout.
          </p>
          <Link
            className="mt-8 inline-block bg-inverse-surface px-8 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary"
            to="/collections"
          >
            Ir al catalogo
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="px-5 py-10 md:px-8 lg:px-12">
      <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-tertiary">
            Bolsa / Resumen
          </span>
          <h1 className="mt-4 font-headline text-4xl font-black uppercase tracking-tighter text-inverse-surface md:text-6xl">
            Tu seleccion
          </h1>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-on-surface-variant">
          Ya estas viendo las variantes reales que elegiste. Desde aqui puedes ajustar cantidades
          antes de pasar a checkout.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4">
          {items.map((item) => {
            const lineTotal = item.quantity * item.unitPrice;

            return (
              <article
                key={item.variantId}
                className="grid gap-6 border border-outline-variant/30 bg-white p-5 md:grid-cols-[180px_1fr]"
              >
                <div className="aspect-[4/5] overflow-hidden bg-surface-container-low">
                  <img className="h-full w-full object-cover" src={item.image} alt={item.productName} />
                </div>

                <div className="flex flex-col justify-between gap-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
                        Variante seleccionada
                      </p>
                      <h2 className="mt-2 font-headline text-2xl font-black uppercase tracking-tighter">
                        {item.productName}
                      </h2>
                      <p className="mt-2 text-sm uppercase tracking-[0.2em] text-on-surface-variant">
                        {item.color} / {item.size}
                      </p>
                      <p className="mt-1 text-sm text-on-surface-variant">SKU {item.sku}</p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
                        Total
                      </p>
                      <p className="mt-2 text-2xl font-black">
                        ${lineTotal.toLocaleString("es-MX")} MXN
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[120px_1fr_auto]">
                    <label className="block">
                      <span className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
                        Cantidad
                      </span>
                      <input
                        className="mt-3 w-full border border-outline/30 bg-surface px-4 py-3 text-sm outline-none focus:border-inverse-surface"
                        min={1}
                        onChange={(event) =>
                          updateQuantity(item.variantId, Number(event.target.value) || 1)
                        }
                        type="number"
                        value={item.quantity}
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                      <MetricCard label="Unitario" value={item.priceLabel} />
                      <MetricCard
                        label="Subtotal"
                        value={`$${lineTotal.toLocaleString("es-MX")} MXN`}
                      />
                    </div>

                    <button
                      className="self-end border border-outline/30 px-5 py-3 text-[0.65rem] font-black uppercase tracking-[0.25em] hover:border-error hover:text-error"
                      onClick={() => removeItem(item.variantId)}
                      type="button"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="h-fit border border-outline-variant/30 bg-[#f2f4f4] p-6 lg:sticky lg:top-28">
          <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
            Resumen de compra
          </h2>

          <div className="mt-8 space-y-4 border-b border-outline-variant/30 pb-8">
            <SummaryRow label="Piezas" value={String(items.length)} />
            <SummaryRow label="Subtotal" value={`$${subtotal.toLocaleString("es-MX")} MXN`} />
            <SummaryRow label="Envio" value="Gratis" />
            {estimatedPromotionDiscount > 0 ? (
              <SummaryRow
                label="Promo combo (est.)"
                value={`-$${estimatedPromotionDiscount.toLocaleString("es-MX")} MXN`}
                valueClassName="text-secondary"
              />
            ) : null}
            <SummaryRow label="Puntos eco (est.)" value={`+${loyaltyPreview}`} valueClassName="text-secondary" />
          </div>

          <div className="mt-8">
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
              Total estimado
            </p>
            <p className="mt-3 text-3xl font-black">${estimatedTotal.toLocaleString("es-MX")} MXN</p>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              className="block bg-inverse-surface px-6 py-4 text-center text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary"
              to="/checkout"
            >
              Continuar a checkout
            </Link>
            <Link
              className="block border border-inverse-surface px-6 py-4 text-center text-[0.7rem] font-black uppercase tracking-[0.25em] hover:bg-inverse-surface hover:text-surface"
              to="/collections"
            >
              Seguir explorando
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  valueClassName = ""
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em]">
      <span>{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-outline-variant/30 bg-[#f8f9f9] p-4">
      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-on-surface-variant">{label}</p>
      <p className="mt-2 text-base font-black">{value}</p>
    </div>
  );
}
