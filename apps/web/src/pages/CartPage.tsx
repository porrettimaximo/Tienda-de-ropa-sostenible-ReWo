import { Link } from "react-router-dom";

import { cartItems, getProductBySlug } from "../data/store";

export function CartPage() {
  const items = cartItems.flatMap((item) => {
      const product = getProductBySlug(item.productSlug);
      if (!product) return [];
      return [{ ...item, product, lineTotal: product.numericPrice * item.quantity }];
    });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const loyaltyPreview = Math.floor(subtotal / 100) * 10;

  return (
    <main className="px-5 py-12 md:px-8 lg:px-12">
      <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
            Bolsa / Checkout
          </span>
          <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter text-inverse-surface md:text-7xl">
            Tu selección
          </h1>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-on-surface-variant">
          Tu bolsa conserva piezas de larga vida, materiales conscientes y beneficios para
          tu programa de lealtad.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          {items.map((item) => (
            <article
              key={`${item.product.slug}-${item.size}-${item.color}`}
              className="grid gap-6 border-b border-outline-variant/20 pb-6 md:grid-cols-[220px_1fr]"
            >
              <div className="aspect-[4/5] overflow-hidden bg-surface-container-low">
                <img className="h-full w-full object-cover" src={item.product.image} alt={item.product.name} />
              </div>
              <div className="flex flex-col justify-between gap-6">
                <div>
                  <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
                    {item.product.name}
                  </h2>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em] text-on-surface-variant">
                    {item.color} / {item.size}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
                      Cantidad
                    </p>
                    <p className="mt-2 text-lg font-bold">{item.quantity}</p>
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
                      Unitario
                    </p>
                    <p className="mt-2 text-lg font-bold">{item.product.price}</p>
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
                      Total
                    </p>
                    <p className="mt-2 text-lg font-bold">${item.lineTotal.toLocaleString("es-MX")} MXN</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="h-fit bg-[#f2f4f4] p-8">
          <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
            Resumen editorial
          </h2>
          <div className="mt-8 space-y-4 border-b border-outline-variant/30 pb-8">
            <div className="flex justify-between text-sm uppercase tracking-[0.2em]">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString("es-MX")} MXN</span>
            </div>
            <div className="flex justify-between text-sm uppercase tracking-[0.2em]">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <div className="flex justify-between text-sm uppercase tracking-[0.2em] text-secondary">
              <span>Puntos Eco</span>
              <span>+{loyaltyPreview}</span>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-on-surface-variant">
              Total estimado
            </p>
            <p className="mt-3 text-3xl font-black">${subtotal.toLocaleString("es-MX")} MXN</p>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <Link
              className="bg-inverse-surface px-8 py-4 text-center text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary"
              to="/checkout"
            >
              Continuar checkout
            </Link>
            <Link
              className="border border-inverse-surface px-8 py-4 text-center text-[0.7rem] font-black uppercase tracking-[0.25em] hover:bg-inverse-surface hover:text-surface"
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
