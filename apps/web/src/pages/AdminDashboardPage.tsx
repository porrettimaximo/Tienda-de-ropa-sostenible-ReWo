import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { adminSummary as fallbackAdminSummary } from "../data/store";
import { getAdminSummary, getSalesReport, type SalesReportRow } from "../lib/api";

export function AdminDashboardPage() {
  const [adminSummary, setAdminSummary] = useState(fallbackAdminSummary);
  const [salesReport, setSalesReport] = useState<SalesReportRow[]>([]);

  useEffect(() => {
    let active = true;

    getAdminSummary().then((data) => {
      if (active) {
        setAdminSummary(data);
      }
    });

    getSalesReport().then((data) => {
      if (active) {
        setSalesReport(data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const topRows = [...salesReport]
    .sort((left, right) => right.units - left.units)
    .slice(0, 4);

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
          Vista inicial para coordinar catalogo, stock por variante, promociones, loyalty y
          reportes comerciales con datos del backend.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Stock bajo", value: adminSummary.lowStockVariants.toString() },
          { label: "Promociones activas", value: adminSummary.activePromotions.toString() },
          { label: "Proveedores eticos", value: adminSummary.ethicalSuppliers.toString() },
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
            Acciones rapidas
          </h2>
          <div className="mt-8 grid gap-4">
            <Link
              className="border border-outline/30 px-5 py-4 text-left text-[0.75rem] font-black uppercase tracking-[0.2em] hover:bg-inverse-surface hover:text-surface"
              to="/admin/catalog"
            >
              Gestionar productos y variantes
            </Link>
            <Link
              className="border border-outline/30 px-5 py-4 text-left text-[0.75rem] font-black uppercase tracking-[0.2em] hover:bg-inverse-surface hover:text-surface"
              to="/admin/store-sales"
            >
              Registrar venta de tienda fisica
            </Link>
            <Link
              className="border border-outline/30 px-5 py-4 text-left text-[0.75rem] font-black uppercase tracking-[0.2em] hover:bg-inverse-surface hover:text-surface"
              to="/collections"
            >
              Ver catalogo publico
            </Link>
            <button className="border border-outline/30 px-5 py-4 text-left text-[0.75rem] font-black uppercase tracking-[0.2em] hover:bg-inverse-surface hover:text-surface">
              Publicar combo de temporada
            </button>
          </div>
        </div>

        <div className="border border-outline-variant/30 p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
                Reporte rapido talla / color
              </h2>
              <p className="mt-3 text-sm text-on-surface-variant">
                Resumen real de ventas agrupadas por variante.
              </p>
            </div>
            <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-tertiary">
              {salesReport.length} filas
            </span>
          </div>

          <div className="mt-8 space-y-4">
            {topRows.map((row) => (
              <div
                key={`${row.size}-${row.color}-${row.channel}`}
                className="grid gap-3 border-b border-outline-variant/20 pb-4 text-sm md:grid-cols-[1fr_auto_auto]"
              >
                <span>
                  {row.size} / {row.color} / {row.channel}
                </span>
                <span className="uppercase tracking-[0.2em] text-secondary">
                  {row.units} unidades
                </span>
                <span className="font-bold">{row.revenueLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
