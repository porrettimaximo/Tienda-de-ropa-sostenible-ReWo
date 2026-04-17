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

  const comboPromos = promotions.filter((promo) => promo.promotionType === "combo" && promo.isActive);

  return (
    <main className="px-5 py-16 md:px-8 lg:px-12">
      <header className="mx-auto mb-20 max-w-4xl text-center">
        <span className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-tertiary">
          Curated Sets / Eco Combos
        </span>
        <h1 className="mt-6 font-headline text-5xl font-black uppercase tracking-tighter text-inverse-surface md:text-8xl">
          Multiplica tu Impacto
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-on-surface-variant">
          Diseñamos sets inteligentes para que tu armario sea más versátil y sostenible. 
          Ahorra automáticamente al elegir las piezas correctas.
        </p>
      </header>

      <section className="mx-auto max-w-6xl space-y-12">
        {comboPromos.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2">
            {comboPromos.map((promo) => (
              <article key={promo.id} className="group relative overflow-hidden border border-outline-variant/30 bg-white p-10 transition-all hover:border-inverse-surface/40">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-secondary/5 transition-transform duration-700 group-hover:scale-150" />
                
                <span className="bg-secondary px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-secondary">
                  Combo Activo
                </span>
                
                <h2 className="mt-8 font-headline text-4xl font-black uppercase tracking-tighter">
                  {promo.name}
                </h2>
                
                <p className="mt-6 text-lg leading-relaxed text-on-surface-variant">
                  {promo.description}
                </p>

                <div className="mt-10 grid grid-cols-2 gap-4">
                  <div className="bg-[#f2f4f4] p-6 text-center">
                    <p className="text-[0.6rem] font-bold uppercase tracking-widest text-on-surface-variant">Beneficio</p>
                    <p className="mt-2 text-3xl font-black text-secondary">{promo.discountLabel}</p>
                  </div>
                  <div className="bg-inverse-surface p-6 text-center text-surface">
                    <p className="text-[0.6rem] font-bold uppercase tracking-widest text-surface/60">Aplicación</p>
                    <p className="mt-2 text-sm font-black uppercase tracking-widest">Automática</p>
                  </div>
                </div>

                <div className="mt-10">
                  <Link
                    className="inline-block w-full bg-inverse-surface px-8 py-5 text-center text-[0.7rem] font-black uppercase tracking-[0.3em] text-surface transition-all hover:bg-neutral-800"
                    to="/collections"
                  >
                    Armar mi combo
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-outline-variant/50 py-24 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">No hay combos activos en este momento</p>
            <Link to="/collections" className="mt-6 inline-block text-sm underline underline-offset-8">Volver al catálogo general</Link>
          </div>
        )}

        <aside className="border border-outline-variant/30 bg-[#f2f4f4] p-10 md:p-16">
          <div className="mx-auto max-w-3xl">
            <h3 className="font-headline text-3xl font-black uppercase tracking-tighter">
              Cómo funcionan los Eco-Sets
            </h3>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <div className="space-y-4">
                <span className="flex h-10 w-10 items-center justify-center bg-inverse-surface text-sm font-black text-surface">01</span>
                <p className="text-sm leading-relaxed text-on-surface">
                  Explora el catálogo y elige 2 o más piezas que formen parte de la promoción vigente.
                </p>
              </div>
              <div className="space-y-4">
                <span className="flex h-10 w-10 items-center justify-center bg-inverse-surface text-sm font-black text-surface">02</span>
                <p className="text-sm leading-relaxed text-on-surface">
                  Agrega las variantes (talla/color) a tu bolsa de compras sin preocuparte por los cupones.
                </p>
              </div>
              <div className="space-y-4">
                <span className="flex h-10 w-10 items-center justify-center bg-inverse-surface text-sm font-black text-surface">03</span>
                <p className="text-sm leading-relaxed text-on-surface">
                  Nuestro sistema detecta el set y aplica el descuento de forma automática en el checkout.
                </p>
              </div>
              <div className="space-y-4">
                <span className="flex h-10 w-10 items-center justify-center bg-inverse-surface text-sm font-black text-surface">04</span>
                <p className="text-sm leading-relaxed text-on-surface">
                  Recibe tus piezas sostenibles con beneficios exclusivos por comprar en set.
                </p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Link
                className="inline-block border border-inverse-surface px-12 py-5 text-[0.7rem] font-black uppercase tracking-[0.3em] hover:bg-inverse-surface hover:text-surface"
                to="/collections"
              >
                Ir al Catálogo Completo
              </Link>
            </div>
          </div>
        </aside>
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

