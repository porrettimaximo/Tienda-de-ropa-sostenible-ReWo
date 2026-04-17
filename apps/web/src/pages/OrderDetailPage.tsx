import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getCustomerOrder, type CustomerOrder } from "../lib/api";

export function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<CustomerOrder | null>(null);

  useEffect(() => {
    if (orderId) {
      getCustomerOrder(orderId).then(setOrder);
    }
  }, [orderId]);

  if (!order) {
    return (
      <main className="px-5 py-12 md:px-8 lg:px-12">
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main className="px-5 py-12 md:px-8 lg:px-12">
      <header className="mb-14">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
          Pedido {order.id}
        </span>
        <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter text-inverse-surface md:text-7xl">
          {order.channel === "online" ? "Compra online" : "Venta en tienda"}
        </h1>
      </header>

      <div className="space-y-6">
        <article className="border border-outline-variant/30 p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.25em] text-tertiary">
                Total
              </p>
              <h3 className="mt-2 font-headline text-3xl font-black uppercase tracking-tighter">
                {order.totalLabel}
              </h3>
            </div>
            <div className="text-left md:text-right">
              <p className="text-lg font-black">{order.paymentMethod ?? "Pago registrado"}</p>
              <p className="mt-1 text-sm text-on-surface-variant">
                {order.items.length} item(s) / +{order.loyaltyPoints} puntos eco
              </p>
            </div>
          </div>
        </article>

        <article className="border border-outline-variant/30 p-8">
          <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
            Detalles de entrega
          </h2>
          <div className="mt-5 grid gap-4 border-t border-outline-variant/20 pt-4 text-sm md:grid-cols-2">
            <div>
              <p className="font-bold uppercase tracking-[0.1em] text-on-surface-variant">
                Metodo de envio
              </p>
              <p className="mt-1">
                {order.shippingMethod === "retiro_sucursal"
                  ? "Retiro por sucursal"
                  : order.shippingMethod === "envio_domicilio"
                  ? "Envio a domicilio"
                  : order.shippingMethod || "No especificado"}
              </p>
            </div>

            {order.shippingMethod === "envio_domicilio" && (
              <div>
                <p className="font-bold uppercase tracking-[0.1em] text-on-surface-variant">
                  Direccion
                </p>
                <p className="mt-1">
                  {order.shippingAddressLine1} {order.shippingAddressLine2}
                  <br />
                  {order.shippingCity}, {order.shippingProvince} {order.shippingPostalCode}
                  <br />
                  {order.shippingCountry}
                </p>
              </div>
            )}

            {order.shippingPhone && (
              <div>
                <p className="font-bold uppercase tracking-[0.1em] text-on-surface-variant">
                  Telefono de contacto
                </p>
                <p className="mt-1">{order.shippingPhone}</p>
              </div>
            )}

            {order.notes && (
              <div className="md:col-span-2">
                <p className="font-bold uppercase tracking-[0.1em] text-on-surface-variant">
                  Notas de la orden
                </p>
                <p className="mt-1 whitespace-pre-wrap rounded bg-surface p-3 italic">
                  {order.notes}
                </p>
              </div>
            )}
          </div>
        </article>

        <article className="border border-outline-variant/30 p-8">
          <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
            Articulos
          </h2>
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
      </div>
    </main>
  );
}
