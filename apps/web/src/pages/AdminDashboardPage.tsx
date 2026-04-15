import { adminSummary } from "../data/store";

export function AdminDashboardPage() {
  return (
    <main className="px-5 py-12 md:px-8 lg:px-12">
      <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
            Admin / Control central
          </span>
          <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter text-inverse-surface md:text-7xl">
            Panel operativo
          </h1>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-on-surface-variant">
          Vista inicial para coordinar catálogo, stock por variante, promociones, loyalty
          y reportes comerciales.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Stock bajo", value: adminSummary.lowStockVariants.toString() },
          { label: "Promociones activas", value: adminSummary.activePromotions.toString() },
          { label: "Proveedores éticos", value: adminSummary.ethicalSuppliers.toString() },
          { label: "Ventas hoy", value: adminSummary.salesToday }
        ].map((card) => (
          <article key={card.label} className="bg-[#f2f4f4] p-8">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-on-surface-variant">
              {card.label}
            </p>
            <p className="mt-4 text-4xl font-black tracking-tighter">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border border-outline-variant/30 p-8">
          <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
            Acciones rápidas
          </h2>
          <div className="mt-8 grid gap-4">
            {[
              "Crear producto nuevo",
              "Actualizar variante con stock crítico",
              "Registrar venta de tienda física",
              "Publicar combo de temporada"
            ].map((action) => (
              <button
                key={action}
                className="border border-outline/30 px-5 py-4 text-left text-[0.75rem] font-black uppercase tracking-[0.2em] hover:bg-inverse-surface hover:text-surface"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-outline-variant/30 p-8">
          <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
            Reporte rápido talla / color
          </h2>
          <div className="mt-8 space-y-4">
            {[
              "M / Musgo / online / 12 unidades",
              "L / Arena / store / 5 unidades",
              "M / Crema / online / 18 unidades"
            ].map((line) => (
              <div key={line} className="flex justify-between border-b border-outline-variant/20 pb-4 text-sm">
                <span>{line}</span>
                <span className="uppercase tracking-[0.2em] text-secondary">activo</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
