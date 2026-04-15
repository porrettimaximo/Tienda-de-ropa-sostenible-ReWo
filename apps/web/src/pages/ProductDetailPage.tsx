import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getProductBySlug, products, type Product } from "../data/store";
import { getCatalogProduct } from "../lib/api";

export function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | undefined>(() =>
    slug ? getProductBySlug(slug) : undefined
  );

  useEffect(() => {
    if (!slug) return;
    let active = true;

    getCatalogProduct(slug).then((data) => {
      if (active && data) {
        setProduct(data);
      }
    });

    return () => {
      active = false;
    };
  }, [slug]);

  if (!product) {
    return (
      <main className="px-5 py-24 md:px-12">
        <p className="text-sm uppercase tracking-[0.2em] text-on-surface-variant">
          Producto no encontrado
        </p>
        <Link className="mt-6 inline-block underline underline-offset-4" to="/collections">
          Volver a colección
        </Link>
      </main>
    );
  }

  const relatedProducts = products.filter((item) => item.slug !== product.slug).slice(0, 3);

  return (
    <main className="px-5 py-12 md:px-8 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="aspect-[4/5] overflow-hidden bg-surface-container-low">
            <img className="h-full w-full object-cover" src={product.image} alt={product.name} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[product.image, ...relatedProducts.map((item) => item.image)].slice(0, 3).map((image) => (
              <div key={image} className="aspect-[4/5] overflow-hidden bg-surface-container-low">
                <img className="h-full w-full object-cover" src={image} alt="Vista del producto" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:pl-8">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
            Detalle / Colección Permanente
          </span>
          <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter text-inverse-surface md:text-7xl">
            {product.name}
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.2em] text-on-surface-variant">
            {product.subtitle}
          </p>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-on-surface">
            {product.description}
          </p>

          <div className="mt-10 grid gap-8 border-y border-outline-variant/30 py-8 md:grid-cols-2">
            <div>
              <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-on-surface-variant">
                Composición
              </p>
              <p className="mt-3 text-lg">{product.composition}</p>
            </div>
            <div>
              <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-on-surface-variant">
                Sostenibilidad
              </p>
              <p className="mt-3 text-lg">{product.sustainability}</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-8">
            <div>
              <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-on-surface-variant">
                Colores
              </p>
              <div className="mt-4 flex gap-3">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="border border-outline/30 px-4 py-2 text-[0.7rem] uppercase tracking-[0.2em]"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-on-surface-variant">
                Tallas
              </p>
              <div className="mt-4 flex gap-3">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className="border border-outline/30 px-4 py-2 text-[0.7rem] uppercase tracking-[0.2em]"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-outline-variant/30 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-3xl font-black tracking-tighter">{product.price}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                className="border border-inverse-surface px-8 py-4 text-center text-[0.7rem] font-black uppercase tracking-[0.25em] hover:bg-inverse-surface hover:text-surface"
                to="/cart"
              >
                Agregar a bolsa
              </Link>
              <Link
                className="bg-inverse-surface px-8 py-4 text-center text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary"
                to="/checkout"
              >
                Comprar ahora
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-24 border-t border-outline-variant/20 pt-12">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-headline text-3xl font-black uppercase tracking-tighter">
            Continuar explorando
          </h2>
          <Link className="text-[0.7rem] uppercase tracking-[0.2em] underline underline-offset-4" to="/collections">
            Ver colección completa
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {relatedProducts.map((item) => (
            <Link key={item.slug} className="group" to={`/products/${item.slug}`}>
              <div className="aspect-[3/4] overflow-hidden bg-surface-container-low">
                <img
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <div className="mt-5">
                <h3 className="font-headline text-lg font-black uppercase tracking-tighter">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm">{item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
