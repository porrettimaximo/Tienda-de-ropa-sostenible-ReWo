import { Link } from "react-router-dom";

import { products } from "../data/store";

export function AdminCatalogPage() {
  return (
    <main className="px-5 py-12 md:px-8 lg:px-12">
      <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
            Admin / Catálogo
          </span>
          <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter text-inverse-surface md:text-7xl">
            Productos y variantes
          </h1>
        </div>
        <div className="flex gap-4">
          <Link
            className="border border-inverse-surface px-6 py-3 text-[0.65rem] font-black uppercase tracking-[0.2em] hover:bg-inverse-surface hover:text-surface"
            to="/admin"
          >
            Volver al panel
          </Link>
          <button className="bg-inverse-surface px-6 py-3 text-[0.65rem] font-black uppercase tracking-[0.2em] text-surface hover:bg-secondary">
            Nuevo producto
          </button>
        </div>
      </header>

      <div className="overflow-x-auto border border-outline-variant/30">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#f2f4f4]">
            <tr className="text-left text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
              <th className="px-6 py-5">Producto</th>
              <th className="px-6 py-5">Colores</th>
              <th className="px-6 py-5">Tallas</th>
              <th className="px-6 py-5">Composición</th>
              <th className="px-6 py-5">Precio base</th>
              <th className="px-6 py-5">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.slug} className="border-t border-outline-variant/20 align-top">
                <td className="px-6 py-6">
                  <p className="font-headline text-lg font-black uppercase tracking-tighter">
                    {product.name}
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant">{product.subtitle}</p>
                </td>
                <td className="px-6 py-6 text-sm">{product.colors.join(", ")}</td>
                <td className="px-6 py-6 text-sm">{product.sizes.join(", ")}</td>
                <td className="px-6 py-6 text-sm">{product.composition}</td>
                <td className="px-6 py-6 text-sm font-bold">{product.price}</td>
                <td className="px-6 py-6">
                  <div className="flex flex-col gap-3 text-[0.65rem] font-black uppercase tracking-[0.2em]">
                    <button className="text-left underline underline-offset-4 hover:text-secondary">
                      Editar producto
                    </button>
                    <button className="text-left underline underline-offset-4 hover:text-secondary">
                      Editar variantes
                    </button>
                    <Link
                      className="underline underline-offset-4 hover:text-secondary"
                      to={`/products/${product.slug}`}
                    >
                      Ver en tienda
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
