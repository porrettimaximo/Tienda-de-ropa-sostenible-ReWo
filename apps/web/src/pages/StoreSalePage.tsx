import { Link } from "react-router-dom";

import { physicalStoreDraft, products } from "../data/store";

export function StoreSalePage() {
  return (
    <main className="px-5 py-12 md:px-8 lg:px-12">
      <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
            Admin / Venta física
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

      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-8 border border-outline-variant/30 p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="border border-outline/30 px-4 py-4 text-sm"
              defaultValue={physicalStoreDraft.storeName}
            />
            <input
              className="border border-outline/30 px-4 py-4 text-sm"
              defaultValue={physicalStoreDraft.seller}
            />
            <input
              className="border border-outline/30 px-4 py-4 text-sm md:col-span-2"
              defaultValue={physicalStoreDraft.customerName}
            />
            <input
              className="border border-outline/30 px-4 py-4 text-sm"
              defaultValue={physicalStoreDraft.paymentMethod}
            />
            <input
              className="border border-outline/30 px-4 py-4 text-sm"
              defaultValue={physicalStoreDraft.loyaltyDocument}
            />
          </div>

          <div className="border-t border-outline-variant/30 pt-8">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
              Selección de productos
            </h2>
            <div className="mt-6 space-y-4">
              {products.slice(0, 3).map((product) => (
                <div
                  key={product.slug}
                  className="flex flex-col gap-4 border border-outline-variant/20 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-headline text-lg font-black uppercase tracking-tighter">
                      {product.name}
                    </p>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      {product.colors[0]} / {product.sizes[0]} / {product.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      className="w-20 border border-outline/30 px-3 py-3 text-center text-sm"
                      defaultValue="1"
                    />
                    <button className="bg-inverse-surface px-5 py-3 text-[0.65rem] font-black uppercase tracking-[0.2em] text-surface hover:bg-secondary">
                      Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit bg-[#f2f4f4] p-8">
          <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
            Ticket de venta
          </h2>
          <div className="mt-8 space-y-4 border-b border-outline-variant/30 pb-8">
            <div className="flex justify-between text-sm">
              <span>Túnica Ancestral Lino</span>
              <span>$3,450 MXN</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Camisa Algodón Crudo</span>
              <span>$1,950 MXN</span>
            </div>
            <div className="flex justify-between text-sm text-secondary">
              <span>Puntos Eco generados</span>
              <span>+540</span>
            </div>
          </div>
          <p className="mt-8 text-3xl font-black">$5,400 MXN</p>
          <button className="mt-8 w-full bg-inverse-surface px-8 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary">
            Registrar venta física
          </button>
        </aside>
      </div>
    </main>
  );
}
