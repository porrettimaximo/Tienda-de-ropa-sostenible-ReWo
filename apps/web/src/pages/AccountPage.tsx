import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { accountSummary as fallbackAccountSummary } from "../data/store";
import { getCustomerAccount, getCustomerOrders, type CustomerOrder } from "../lib/api";

export function AccountPage() {
  const [accountSummary, setAccountSummary] = useState(fallbackAccountSummary);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  useEffect(() => {
    let active = true;

    getCustomerAccount().then((data) => {
      if (active) {
        setAccountSummary(data);
      }
    });

    getCustomerOrders().then((data) => {
      if (active) {
        setOrders(data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const latestOrder = orders[0];
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <main className="px-5 py-12 md:px-8 lg:px-12">
      <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
            Mi cuenta / Puntos Eco
          </span>
          <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter text-inverse-surface md:text-7xl">
            Hola, {accountSummary.name.split(" ")[0]}
          </h1>
        </div>
        <Link className="text-[0.7rem] uppercase tracking-[0.2em] underline underline-offset-4" to="/collections">
          Seguir comprando
        </Link>
      </header>

      <div className="grid gap-8 xl:grid-cols-[0.75fr_1.25fr]">
        <section className="space-y-6">
          <article className="bg-[#f2f4f4] p-8">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-on-surface-variant">
              Perfil
            </p>
            <h2 className="mt-4 font-headline text-3xl font-black uppercase tracking-tighter">
              {accountSummary.tier}
            </h2>
            <p className="mt-3 text-sm">{accountSummary.email}</p>
            <Link
              className="mt-6 inline-block text-[0.7rem] font-black uppercase tracking-[0.25em] underline underline-offset-4"
              to="/profile"
            >
              Editar perfil
            </Link>
            <div className="mt-10 border-t border-outline-variant/30 pt-8">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-on-surface-variant">
                Puntos disponibles
              </p>
              <p className="mt-3 text-5xl font-black">{accountSummary.ecoPoints}</p>
              <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
                Proxima recompensa: {accountSummary.nextReward}
              </p>
            </div>
          </article>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            <MetricCard label="Ordenes registradas" value={String(totalOrders)} />
            <MetricCard
              label="Total invertido"
              value={`$${totalSpent.toLocaleString("es-MX")} MXN`}
            />
            <MetricCard
              label="Ultimo canal"
              value={latestOrder ? (latestOrder.channel === "online" ? "Online" : "Tienda") : "Sin compras"}
            />
          </div>
        </section>

        <section className="space-y-6">
          <article className="border border-outline-variant/30 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-tertiary">
                  Historial real
                </p>
                <h2 className="mt-3 font-headline text-3xl font-black uppercase tracking-tighter">
                  Compras registradas
                </h2>
              </div>
              {latestOrder ? (
                <p className="text-sm text-on-surface-variant">
                  Ultimo pedido: {latestOrder.id}
                </p>
              ) : null}
            </div>

            <div className="mt-8 space-y-5">
              {orders.length === 0 ? (
                <div className="border border-dashed border-outline/40 px-5 py-10 text-center">
                  <p className="text-sm text-on-surface-variant">
                    Todavia no hay compras registradas para esta cuenta.
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <article key={order.id} className="border border-outline-variant/20 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-tertiary">
                          Pedido {order.id}
                        </p>
                        <h3 className="mt-2 font-headline text-xl font-black uppercase tracking-tighter">
                          {order.channel === "online" ? "Compra online" : "Venta en tienda"}
                        </h3>
                        <p className="mt-2 text-sm text-on-surface-variant">
                          {order.items.length} item(s) / +{order.loyaltyPoints} puntos eco
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-lg font-black">{order.totalLabel}</p>
                        <p className="mt-1 text-sm text-on-surface-variant">
                          {order.paymentMethod ?? "Pago registrado"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3 border-t border-outline-variant/20 pt-4">
                      {order.items.map((item) => (
                        <div
                          key={`${order.id}-${item.productSlug}-${item.size}-${item.color}`}
                          className="flex flex-col gap-2 text-sm md:flex-row md:items-center md:justify-between"
                        >
                          <span>
                            {item.productName} / {item.color} / {item.size} / {item.quantity} pieza(s)
                          </span>
                          <span className="font-bold">{item.lineTotalLabel}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                ))
              )}
            </div>
          </article>

          <article className="border border-outline-variant/30 p-8">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-tertiary">
              Beneficios activos
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <InfoCard title="Lealtad" body={`Nivel ${accountSummary.tier} activo para recompensas.`} />
              <InfoCard
                title="Circularidad"
                body="Puedes sumar mas puntos entregando prendas al programa de recuperacion."
              />
              <InfoCard
                title="Preventa"
                body="Tienes acceso prioritario a lanzamientos capsula y combos de temporada."
              />
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="border border-outline-variant/30 bg-white p-5">
      <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">{label}</p>
      <p className="mt-3 text-2xl font-black">{value}</p>
    </article>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-[#f2f4f4] p-5">
      <p className="text-[0.65rem] uppercase tracking-[0.25em] text-tertiary">{title}</p>
      <p className="mt-3 text-sm leading-relaxed text-on-surface">{body}</p>
    </div>
  );
}
