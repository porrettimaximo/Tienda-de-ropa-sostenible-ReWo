import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { products as fallbackProducts, type Product } from "../data/store";
import { getCatalogProducts } from "../lib/api";

const filterBlocks = [
  { icon: "eco", label: "Fibras Orgánicas", active: true },
  { icon: "recycling", label: "Reciclados" },
  { icon: "opacity", label: "Tintes Naturales" },
  { icon: "new_releases", label: "Novedades" }
];

const materialFilters = ["Lino Premium", "Cáñamo Mexicano", "Algodón Orgánico"];

export function CollectionPage() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    let active = true;

    getCatalogProducts().then((data) => {
      if (active && data.length > 0) {
        setProducts(data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const featuredProduct = products[0];
  const topProducts = products.slice(1, 4);
  const bottomProducts = products.slice(4);

  if (!featuredProduct) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="hidden h-screen w-80 shrink-0 flex-col gap-8 bg-[#f2f4f4] p-10 lg:sticky lg:top-[88px] lg:flex">
        <div>
          <h3 className="mb-1 text-[0.75rem] font-black uppercase tracking-[0.1em]">FILTROS</h3>
          <p className="text-[0.6rem] uppercase tracking-[0.1em] text-on-surface-variant">
            Sostenibilidad Curada
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {filterBlocks.map((block) => (
            <div
              key={block.label}
              className={`flex cursor-pointer items-center justify-between p-3 transition-all duration-300 ${
                block.active ? "bg-[#e5e2e1] text-[#0c0f0f]" : "text-[#2d3435]/70 hover:bg-[#f2f4f4]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-sm">{block.icon}</span>
                <span className="text-[0.75rem] uppercase tracking-[0.1em]">{block.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h4 className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.1em]">
            Materiales Ancestrales
          </h4>
          <div className="flex flex-col gap-2">
            {materialFilters.map((material) => (
              <label key={material} className="group flex cursor-pointer items-center gap-3">
                <input
                  className="h-4 w-4 rounded-none border-outline checked:bg-inverse-surface"
                  type="checkbox"
                />
                <span className="text-[0.7rem] uppercase tracking-widest transition-transform group-hover:translate-x-1">
                  {material}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button className="mt-auto w-fit border-b border-inverse-surface text-[0.7rem] font-bold tracking-[0.2em] transition-opacity hover:opacity-50">
          LIMPIAR FILTROS
        </button>
      </aside>

      <main className="flex-1 px-5 py-12 md:px-8 lg:px-16">
        <header className="mb-20">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="mb-4 block text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
                COLECCIÓN PERMANENTE / 2024
              </span>
              <h1 className="font-headline text-5xl font-black uppercase leading-[0.9] tracking-tighter text-inverse-surface md:text-8xl">
                ESENCIA
                <br />
                MONOLÍTICA
              </h1>
            </div>
            <div className="text-right">
              <p className="ml-auto max-w-xs text-[0.8rem] font-light italic leading-relaxed text-on-surface-variant">
                "La sostenibilidad no es una tendencia, es una estructura de permanencia arquitectónica."
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-outline-variant/30 pt-4 text-[0.65rem] font-bold tracking-[0.2em]">
            <span>{products.length} PRODUCTOS DISPONIBLES</span>
            <span>ORDENAR: RECIENTE</span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-x-12 gap-y-24 md:grid-cols-2 lg:grid-cols-3">
          <article className="group md:col-span-2">
            <div className="relative aspect-[16/9] overflow-hidden bg-surface-container-low">
              <img
                alt={featuredProduct.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={featuredProduct.image}
              />
              <div className="absolute left-6 top-6 bg-secondary-container px-3 py-1 text-[0.6rem] font-black uppercase tracking-widest text-on-secondary-container">
                EDICIÓN LIMITADA
              </div>
            </div>
            <div className="mt-6 flex items-start justify-between">
              <div>
                <h2 className="font-headline text-2xl font-black uppercase tracking-tighter text-inverse-surface">
                  {featuredProduct.name}
                </h2>
                <p className="mt-1 text-[0.7rem] uppercase tracking-widest text-on-surface-variant">
                  {featuredProduct.subtitle}
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="h-4 w-4 cursor-pointer bg-[#e5e2e1] ring-1 ring-inverse-surface/10 ring-offset-2" />
                  <span className="h-4 w-4 cursor-pointer bg-[#526351]" />
                  <span className="h-4 w-4 cursor-pointer bg-[#8f4c42]" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold tracking-tighter">{featuredProduct.price}</span>
                <div className="mt-4 flex justify-end gap-2 font-headline text-[0.65rem] font-bold">
                  {featuredProduct.sizes.map((size) => (
                    <span key={size} className="cursor-pointer hover:underline">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Link
                className="text-[0.65rem] font-black uppercase tracking-[0.2em] underline underline-offset-4 hover:text-secondary"
                to={`/products/${featuredProduct.slug}`}
              >
                Ver detalle
              </Link>
            </div>
          </article>

          {topProducts.map((product) => (
            <article key={product.name} className="group">
              <div className="aspect-[3/4] overflow-hidden bg-surface-container-low">
                <img
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={product.image}
                />
              </div>
              <div className="mt-6">
                <h2 className="font-headline text-lg font-black uppercase tracking-tighter text-inverse-surface">
                  {product.name}
                </h2>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[0.75rem] font-bold tracking-tighter">{product.price}</span>
                  <Link
                    className="text-[0.6rem] font-black tracking-[0.2em] underline underline-offset-4 hover:text-secondary"
                    to={`/products/${product.slug}`}
                  >
                    VISTA RÁPIDA
                  </Link>
                </div>
              </div>
            </article>
          ))}

          <div className="flex flex-col items-center border-y border-outline-variant/20 py-20 text-center md:col-span-2 lg:col-span-3">
            <span className="material-symbols-outlined mb-6 text-4xl text-secondary">verified</span>
            <h3 className="max-w-2xl font-headline text-4xl font-black uppercase tracking-tighter text-inverse-surface">
              SOSTENIBILIDAD MONOLÍTICA
            </h3>
            <p className="mt-4 max-w-lg text-[0.85rem] leading-relaxed text-on-surface-variant">
              Cada pieza de ECOWEAR es diseñada bajo la premisa de la durabilidad extrema. No creamos moda, construimos herencia textil a través de procesos circulares y respeto absoluto por la materia prima.
            </p>
          </div>

          {bottomProducts.map((product) => (
            <article key={product.name} className="group">
              <div className="aspect-[3/4] overflow-hidden bg-surface-container-low">
                <img
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={product.image}
                />
              </div>
              <div className="mt-6">
                <h2 className="font-headline text-lg font-black uppercase tracking-tighter text-inverse-surface">
                  {product.name}
                </h2>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[0.75rem] font-bold tracking-tighter">{product.price}</span>
                  <Link
                    className="text-[0.6rem] font-black tracking-[0.2em] underline underline-offset-4 hover:text-secondary"
                    to={`/products/${product.slug}`}
                  >
                    VISTA RÁPIDA
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className="mt-32 flex justify-center gap-6 border-t border-outline-variant/30 py-12 text-[0.7rem] font-black uppercase tracking-[0.4em] md:gap-12">
          <a className="opacity-30 transition-opacity hover:opacity-100" href="#">
            Anterior
          </a>
          <span className="border-b-2 border-inverse-surface px-2">01</span>
          <a className="transition-opacity hover:opacity-50" href="#">
            02
          </a>
          <a className="transition-opacity hover:opacity-50" href="#">
            03
          </a>
          <a className="transition-opacity hover:opacity-50" href="#">
            Siguiente
          </a>
        </footer>
      </main>
    </div>
  );
}
