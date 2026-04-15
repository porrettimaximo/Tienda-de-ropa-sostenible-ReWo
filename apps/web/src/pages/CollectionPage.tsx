import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCatalogProducts, type CatalogProduct } from "../lib/api";

type SortOption = "featured" | "price-asc" | "price-desc" | "name";

export function CollectionPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  useEffect(() => {
    let active = true;

    getCatalogProducts().then((data) => {
      if (active) {
        setProducts(data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const categories = ["all", ...new Set(products.map((product) => product.category))];
  const colors = ["all", ...new Set(products.flatMap((product) => product.colors))];
  const sizes = ["all", ...new Set(products.flatMap((product) => product.sizes))];

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        search.length === 0 ||
        `${product.name} ${product.subtitle} ${product.category}`.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesColor = selectedColor === "all" || product.colors.includes(selectedColor);
      const matchesSize = selectedSize === "all" || product.sizes.includes(selectedSize);

      return matchesSearch && matchesCategory && matchesColor && matchesSize;
    })
    .sort((left, right) => {
      if (sortBy === "price-asc") return left.numericPrice - right.numericPrice;
      if (sortBy === "price-desc") return right.numericPrice - left.numericPrice;
      if (sortBy === "name") return left.name.localeCompare(right.name);
      return 0;
    });

  const highlightProduct = filteredProducts[0];

  return (
    <main className="px-5 py-10 md:px-8 lg:px-12">
      <section className="rounded-none border border-outline-variant/30 bg-[#f2f4f4] px-6 py-8 md:px-10 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-tertiary">
              Catalogo / Compra online
            </span>
            <h1 className="mt-4 font-headline text-4xl font-black uppercase tracking-tighter text-inverse-surface md:text-6xl">
              Coleccion con stock real
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant md:text-base">
              Explora piezas sostenibles con variantes reales por talla y color, disponibilidad
              visible y una navegacion mucho mas clara para compra online.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-2">
            <div className="border border-outline-variant/30 bg-white p-5">
              <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
                Productos
              </p>
              <p className="mt-3 text-3xl font-black">{products.length}</p>
            </div>
            <div className="border border-outline-variant/30 bg-white p-5">
              <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
                Resultados
              </p>
              <p className="mt-3 text-3xl font-black">{filteredProducts.length}</p>
            </div>
            <div className="border border-outline-variant/30 bg-white p-5">
              <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
                Colores
              </p>
              <p className="mt-3 text-3xl font-black">{colors.length - 1}</p>
            </div>
            <div className="border border-outline-variant/30 bg-white p-5">
              <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
                Tallas
              </p>
              <p className="mt-3 text-3xl font-black">{sizes.length - 1}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[300px_1fr]">
        <aside className="h-fit border border-outline-variant/30 bg-white p-6 xl:sticky xl:top-28">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-tertiary">
                Filtros
              </p>
              <h2 className="mt-2 font-headline text-2xl font-black uppercase tracking-tighter">
                Catalogo util
              </h2>
            </div>
            <button
              className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant underline underline-offset-4"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setSelectedColor("all");
                setSelectedSize("all");
                setSortBy("featured");
              }}
              type="button"
            >
              Limpiar
            </button>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <label className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                Buscar
              </label>
              <input
                className="mt-3 w-full border border-outline/30 bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-inverse-surface"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tunica, lino, accesorios..."
                type="search"
                value={search}
              />
            </div>

            <div>
              <label className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                Categoria
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`border px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] ${
                      selectedCategory === category
                        ? "border-inverse-surface bg-inverse-surface text-surface"
                        : "border-outline/30 bg-surface hover:border-inverse-surface"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                    type="button"
                  >
                    {category === "all" ? "Todas" : category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                Color
              </label>
              <select
                className="mt-3 w-full border border-outline/30 bg-surface px-4 py-3 text-sm outline-none focus:border-inverse-surface"
                onChange={(event) => setSelectedColor(event.target.value)}
                value={selectedColor}
              >
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color === "all" ? "Todos los colores" : color}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                Talla
              </label>
              <select
                className="mt-3 w-full border border-outline/30 bg-surface px-4 py-3 text-sm outline-none focus:border-inverse-surface"
                onChange={(event) => setSelectedSize(event.target.value)}
                value={selectedSize}
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size === "all" ? "Todas las tallas" : size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                Ordenar
              </label>
              <select
                className="mt-3 w-full border border-outline/30 bg-surface px-4 py-3 text-sm outline-none focus:border-inverse-surface"
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                value={sortBy}
              >
                <option value="featured">Destacado</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name">Nombre</option>
              </select>
            </div>
          </div>
        </aside>

        <div className="space-y-8">
          {highlightProduct ? (
            <article className="grid overflow-hidden border border-outline-variant/30 bg-white lg:grid-cols-[1.1fr_0.9fr]">
              <div className="aspect-[5/4] overflow-hidden bg-surface-container-low">
                <img
                  alt={highlightProduct.name}
                  className="h-full w-full object-cover"
                  src={highlightProduct.image}
                />
              </div>
              <div className="flex flex-col justify-between p-6 md:p-8">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-secondary-container px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-secondary-container">
                      Destacado
                    </span>
                    <span className="border border-outline/30 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                      {highlightProduct.category}
                    </span>
                  </div>
                  <h2 className="mt-5 font-headline text-3xl font-black uppercase tracking-tighter md:text-4xl">
                    {highlightProduct.name}
                  </h2>
                  <p className="mt-3 text-sm uppercase tracking-[0.2em] text-on-surface-variant">
                    {highlightProduct.subtitle}
                  </p>
                  <p className="mt-6 text-sm leading-relaxed text-on-surface">
                    {highlightProduct.description}
                  </p>
                </div>

                <div className="mt-8 space-y-5">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
                        Desde
                      </p>
                      <p className="mt-2 text-3xl font-black">{highlightProduct.priceLabel}</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
                        Variantes
                      </p>
                      <p className="mt-2 text-3xl font-black">
                        {highlightProduct.colors.length} x {highlightProduct.sizes.length}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {highlightProduct.colors.map((color) => (
                      <span
                        key={color}
                        className="border border-outline/30 px-3 py-2 text-[0.65rem] uppercase tracking-[0.2em]"
                      >
                        {color}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      className="bg-inverse-surface px-6 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary"
                      to={`/products/${highlightProduct.slug}`}
                    >
                      Ver detalle
                    </Link>
                    <Link
                      className="border border-inverse-surface px-6 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] hover:bg-inverse-surface hover:text-surface"
                      to={`/products/${highlightProduct.slug}`}
                    >
                      Elegir variante
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ) : null}

          {filteredProducts.length === 0 ? (
            <section className="border border-dashed border-outline/40 bg-white px-6 py-16 text-center">
              <p className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-tertiary">
                Sin resultados
              </p>
              <h2 className="mt-4 font-headline text-3xl font-black uppercase tracking-tighter">
                No encontramos piezas con esos filtros
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-on-surface-variant">
                Cambia la busqueda o limpia los filtros para volver al catalogo completo.
              </p>
            </section>
          ) : (
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);

                return (
                  <article key={product.slug} className="border border-outline-variant/30 bg-white">
                    <Link className="block aspect-[4/5] overflow-hidden bg-surface-container-low" to={`/products/${product.slug}`}>
                      <img
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        src={product.image}
                      />
                    </Link>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
                            {product.category}
                          </p>
                          <h3 className="mt-2 font-headline text-xl font-black uppercase tracking-tighter">
                            {product.name}
                          </h3>
                        </div>
                        <p className="text-lg font-black">{product.priceLabel}</p>
                      </div>

                      <p className="mt-3 min-h-[3.5rem] text-sm leading-relaxed text-on-surface-variant">
                        {product.description}
                      </p>

                      <div className="mt-5 grid grid-cols-3 gap-3 border-y border-outline-variant/20 py-4 text-center">
                        <div>
                          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-on-surface-variant">
                            Colores
                          </p>
                          <p className="mt-2 text-lg font-black">{product.colors.length}</p>
                        </div>
                        <div>
                          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-on-surface-variant">
                            Tallas
                          </p>
                          <p className="mt-2 text-lg font-black">{product.sizes.length}</p>
                        </div>
                        <div>
                          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-on-surface-variant">
                            Stock
                          </p>
                          <p className="mt-2 text-lg font-black">{totalStock}</p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {product.colors.slice(0, 3).map((color) => (
                          <span
                            key={color}
                            className="bg-[#f2f4f4] px-3 py-2 text-[0.65rem] uppercase tracking-[0.2em] text-on-surface-variant"
                          >
                            {color}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 flex gap-3">
                        <Link
                          className="flex-1 border border-inverse-surface px-4 py-3 text-center text-[0.65rem] font-black uppercase tracking-[0.25em] hover:bg-inverse-surface hover:text-surface"
                          to={`/products/${product.slug}`}
                        >
                          Ver detalle
                        </Link>
                        <Link
                          className="flex-1 bg-inverse-surface px-4 py-3 text-center text-[0.65rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary"
                          to={`/products/${product.slug}`}
                        >
                          Comprar
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
