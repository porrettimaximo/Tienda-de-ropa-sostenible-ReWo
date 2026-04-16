import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCatalogProducts, getPromotions, type CatalogProduct, type Promotion } from "../lib/api";

export function CombosPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    let active = true;

    getPromotions(true).then((data) => {
      if (active) setPromotions(data);
    });
    getCatalogProducts().then((data) => {
      if (active) setProducts(data);
    });

    return () => {
      active = false;
    };
  }, []);

  const comboPromo = promotions.find((promo) => promo.promotionType === "combo") ?? promotions[0];
  const suggested = products.slice(0, 4);

  return (
    <main className="px-5 py-12 md:px-8 lg:px-12">
      <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-tertiary">
            Promociones / Combos
          </span>
          <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter text-inverse-surface md:text-7xl">
            Combos de temporada
          </h1>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-on-surface-variant">
          Esta pantalla lee promos reales del backend y te da una guia clara para armar un combo
          que aplique descuento automatico en checkout.
        </p>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="border border-outline-variant/30 bg-white p-8">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
            Promo activa
          </p>
          <h2 className="mt-4 font-headline text-4xl font-black uppercase tracking-tighter">
            {comboPromo?.name ?? "Sin promociones"}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-on-surface">
            {comboPromo?.description ?? "Configura promociones para aparecer aqui."}
          </p>

          <div className="mt-8 grid gap-4 border-t border-outline-variant/20 pt-6 md:grid-cols-3">
            <Metric label="Tipo" value={comboPromo?.promotionType ?? "combo"} />
            <Metric label="Descuento" value={comboPromo?.discountLabel ?? "-"} />
            <Metric label="Estado" value={comboPromo?.isActive ? "Activa" : "Inactiva"} />
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              className="bg-inverse-surface px-8 py-4 text-center text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary"
              to="/collections"
            >
              Elegir 2 productos
            </Link>
            <Link
              className="border border-inverse-surface px-8 py-4 text-center text-[0.7rem] font-black uppercase tracking-[0.25em] hover:bg-inverse-surface hover:text-surface"
              to="/cart"
            >
              Ir a bolsa
            </Link>
          </div>
        </article>

        <aside className="border border-outline-variant/30 bg-[#f2f4f4] p-8">
          <h3 className="font-headline text-2xl font-black uppercase tracking-tighter">
            Como aplicarlo
          </h3>
          <ol className="mt-6 list-decimal space-y-3 pl-6 text-sm leading-relaxed text-on-surface">
            <li>Elige 2 productos distintos del catalogo.</li>
            <li>Agrega la variante/talla/color que quieras a la bolsa.</li>
            <li>Si el subtotal supera $5,000 MXN, el backend aplica el descuento.</li>
            <li>En checkout veras el total final y los puntos ganados.</li>
          </ol>
          <p className="mt-6 text-sm text-on-surface-variant">
            Tip: prueba con Tunica + Pantalon para superar el minimo rapido.
          </p>
        </aside>
      </section>

      <section className="mt-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-headline text-3xl font-black uppercase tracking-tighter">
            Sugerencias para combo
          </h2>
          <Link className="text-[0.7rem] font-black uppercase tracking-[0.2em] underline underline-offset-4" to="/collections">
            Ver catalogo completo
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {suggested.map((product) => (
            <Link key={product.slug} className="border border-outline-variant/30 bg-white" to={`/products/${product.slug}`}>
              <div className="aspect-[4/5] overflow-hidden bg-surface-container-low">
                <img className="h-full w-full object-cover" alt={product.name} src={product.image} />
              </div>
              <div className="p-5">
                <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">{product.category}</p>
                <h3 className="mt-2 font-headline text-xl font-black uppercase tracking-tighter">{product.name}</h3>
                <p className="mt-3 text-sm text-on-surface-variant">{product.subtitle}</p>
                <p className="mt-4 text-lg font-black">{product.priceLabel}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-outline-variant/30 bg-[#f8f9f9] p-5">
      <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">{label}</p>
      <p className="mt-3 text-lg font-black">{value}</p>
    </div>
  );
}

