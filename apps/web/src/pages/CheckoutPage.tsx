import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../components/CartContext";
import { 
  getStoredUser, 
  submitCheckout,
  getPromotions,
  calculateBestPromotion,
  type Promotion
} from "../lib/api";

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [storedUser, setStoredUser] = useState(() => getStoredUser());
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loadingPromotions, setLoadingPromotions] = useState(true);
  const [customerEmail, setCustomerEmail] = useState(() => storedUser?.email ?? "jorgegonzalez@email.com");
  const [customerFirstName, setCustomerFirstName] = useState("Jorge");
  const [customerLastName, setCustomerLastName] = useState("Gonzalez");
  const [customerDni, setCustomerDni] = useState("29077077");
  const [shippingAddressLine1, setShippingAddressLine1] = useState("Calle 1234");
  const [shippingAddressLine2, setShippingAddressLine2] = useState("1° A");
  const [shippingCountry, setShippingCountry] = useState("Argentina");
  const [shippingProvince, setShippingProvince] = useState("");
  const [shippingCity, setShippingCity] = useState("Caballito");
  const [shippingPostalCode, setShippingPostalCode] = useState("1405");
  const [shippingPhone, setShippingPhone] = useState("1112345678");
  const [shippingMethod, setShippingMethod] = useState<"retiro_sucursal" | "envio_domicilio">(
    "retiro_sucursal"
  );
  const [paymentMethod, setPaymentMethod] = useState("Tarjeta");
  const [notes, setNotes] = useState("");
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [invoiceRequired, setInvoiceRequired] = useState(false);
  const [invoiceRfc, setInvoiceRfc] = useState("");
  const [invoiceBusinessName, setInvoiceBusinessName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<{
    orderId: string;
    loyaltyPoints: number;
    total: number;
    discountTotal: number;
    promotionLabel: string | null;
  } | null>(null);

  const isLoggedIn = Boolean(storedUser);
  const customerName = `${customerFirstName} ${customerLastName}`.trim();

  // Cargar promociones activas
  useEffect(() => {
    setLoadingPromotions(true);
    getPromotions(true)
      .then(setPromotions)
      .catch(() => setPromotions([]))
      .finally(() => setLoadingPromotions(false));
  }, []);

  // Calcular descuentos dinámicamente según promociones activas
  const { discountAmount: estimatedPromotionDiscount, appliedPromotion } = 
    calculateBestPromotion(
      items.map(item => ({ productSlug: item.productSlug, quantity: item.quantity })),
      promotions,
      subtotal
    );
  
  const totalAfterPromo = Math.max(0, subtotal - estimatedPromotionDiscount);
  const redeemablePoints = redeemPoints > 0 ? Math.floor(redeemPoints / 500) * 500 : 0;
  const loyaltyDiscountPreview = redeemablePoints > 0 ? Math.floor(redeemablePoints / 500) * 100 : 0;
  const maxRedeemPointsByTotal = Math.floor(totalAfterPromo / 100) * 500;
  const effectiveRedeemPoints = isLoggedIn ? Math.min(redeemablePoints, maxRedeemPointsByTotal) : 0;
  const effectiveLoyaltyDiscount =
    isLoggedIn && effectiveRedeemPoints > 0 ? Math.floor(effectiveRedeemPoints / 500) * 100 : 0;
  const estimatedTotal = Math.max(0, totalAfterPromo - effectiveLoyaltyDiscount);
  const loyaltyPreview = Math.floor(estimatedTotal / 10);

  useEffect(() => {
    const handler = () => setStoredUser(getStoredUser());
    window.addEventListener("storage", handler);
    window.addEventListener("ecowear_user_changed", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("ecowear_user_changed", handler);
    };
  }, []);

  useEffect(() => {
    if (!storedUser) return;
    if (storedUser.email) setCustomerEmail(storedUser.email);
    if (storedUser.name) {
      const parts = storedUser.name.trim().split(/\s+/);
      if (parts.length >= 1) setCustomerFirstName(parts[0]);
      if (parts.length >= 2) setCustomerLastName(parts.slice(1).join(" "));
    }
  }, [storedUser]);

  if (items.length === 0 && !confirmation) {
    return (
      <main className="px-5 py-16 md:px-8 lg:px-12">
        <section className="border border-dashed border-outline/40 bg-white px-6 py-20 text-center">
          <p className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-tertiary">
            Checkout vacio
          </p>
          <h1 className="mt-4 font-headline text-4xl font-black uppercase tracking-tighter md:text-6xl">
            Agrega piezas antes de confirmar la compra
          </h1>
          <Link
            className="mt-8 inline-block bg-inverse-surface px-8 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary"
            to="/collections"
          >
            Volver al catalogo
          </Link>
        </section>
      </main>
    );
  }

  const handleSubmit = async () => {
    if (items.length === 0) return;

    try {
      setSubmitting(true);
      setError("");

      const order = await submitCheckout({
        customerId: storedUser?.id,
        customerName: customerName || undefined,
        customerFirstName: customerFirstName || undefined,
        customerLastName: customerLastName || undefined,
        customerEmail,
        customerDni: customerDni || undefined,
        paymentMethod,
        notes,
        redeemPoints: isLoggedIn && effectiveRedeemPoints > 0 ? effectiveRedeemPoints : undefined,
        invoiceRequired,
        invoiceRfc: invoiceRequired ? invoiceRfc : undefined,
        invoiceBusinessName: invoiceRequired ? invoiceBusinessName : undefined,
        shippingMethod,
        shippingAddressLine1: shippingAddressLine1 || undefined,
        shippingAddressLine2: shippingAddressLine2 || undefined,
        shippingCountry: shippingCountry || undefined,
        shippingProvince: shippingProvince || undefined,
        shippingCity: shippingCity || undefined,
        shippingPostalCode: shippingPostalCode || undefined,
        shippingPhone: shippingPhone || undefined,
        items: items.map((item) => ({
          productSlug: item.productSlug,
          variantId: item.variantId,
          quantity: item.quantity
        }))
      });

      setConfirmation({
        orderId: order.id,
        loyaltyPoints: order.loyalty_points_earned,
        total: order.total,
        discountTotal: order.discount_total ?? 0,
        promotionLabel: order.promotion_label ?? null
      });
      clearCart();
    } catch {
      setError("No se pudo confirmar la compra. Revisa que el backend este corriendo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <main className="px-5 py-16 md:px-8 lg:px-12">
        <section className="border border-outline-variant/30 bg-white px-6 py-16 text-center">
          <p className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-tertiary">
            Compra confirmada
          </p>
          <h1 className="mt-4 font-headline text-4xl font-black uppercase tracking-tighter md:text-6xl">
            Pedido {confirmation.orderId}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-on-surface-variant">
            El checkout ya paso por el backend y la orden fue registrada correctamente.
          </p>

          <div className="mx-auto mt-10 grid max-w-3xl gap-4 md:grid-cols-3">
            <ConfirmationCard label="Total" value={`$${confirmation.total.toLocaleString("es-MX")} MXN`} />
            <ConfirmationCard label="Puntos eco" value={`+${confirmation.loyaltyPoints}`} />
            <ConfirmationCard label="Estado" value="Registrado" />
          </div>
          {confirmation.discountTotal > 0 ? (
            <p className="mx-auto mt-8 max-w-xl text-sm text-on-surface-variant">
              Promocion aplicada: {confirmation.promotionLabel ?? "Combo"} (-$
              {confirmation.discountTotal.toLocaleString("es-MX")} MXN)
            </p>
          ) : null}

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              className="bg-inverse-surface px-8 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary"
              to="/account"
            >
              Ver mi cuenta
            </Link>
            <Link
              className="border border-inverse-surface px-8 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] hover:bg-inverse-surface hover:text-surface"
              to="/collections"
            >
              Seguir comprando
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="px-5 py-10 md:px-8 lg:px-12">
      <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-tertiary">
            Checkout / Confirmacion
          </span>
          <h1 className="mt-4 font-headline text-4xl font-black uppercase tracking-tighter text-inverse-surface md:text-6xl">
            Cierre consciente
          </h1>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-on-surface-variant">
          Esta pantalla ya usa las variantes reales elegidas en la bolsa y puede disparar el
          endpoint de checkout del backend.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <section className="space-y-6">
          <div className="border border-outline-variant/30 bg-white p-6">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
              Direccion de envio
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="flex items-center justify-between text-[0.7rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                  <span>Correo electronico</span>
                  {!isLoggedIn ? (
                    <span className="flex items-center gap-2 text-[0.65rem] font-bold normal-case tracking-normal text-on-surface-variant">
                      <span className="material-symbols-outlined text-base" aria-hidden>
                        info
                      </span>
                      Podes crear tu cuenta luego de finalizar tu compra.
                    </span>
                  ) : null}
                </label>
                <input
                  className="mt-3 w-full border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  placeholder="jorgegonzalez@email.com"
                  type="email"
                  value={customerEmail}
                />
              </div>

              <div>
                <label className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                  Nombre
                </label>
                <input
                  className="mt-3 w-full border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                  onChange={(event) => setCustomerFirstName(event.target.value)}
                  placeholder="Jorge"
                  value={customerFirstName}
                />
              </div>
              <div>
                <label className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                  Apellido
                </label>
                <input
                  className="mt-3 w-full border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                  onChange={(event) => setCustomerLastName(event.target.value)}
                  placeholder="Gonzalez"
                  value={customerLastName}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                  Direccion (Calle, Altura)
                </label>
                <input
                  className="mt-3 w-full border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                  onChange={(event) => setShippingAddressLine1(event.target.value)}
                  placeholder="Calle 1234"
                  value={shippingAddressLine1}
                />
              </div>

              <div>
                <label className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                  Piso/Depto.
                </label>
                <input
                  className="mt-3 w-full border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                  onChange={(event) => setShippingAddressLine2(event.target.value)}
                  placeholder="1° A"
                  value={shippingAddressLine2}
                />
              </div>

              <div>
                <label className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                  Pais
                </label>
                <select
                  className="mt-3 w-full border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                  onChange={(event) => setShippingCountry(event.target.value)}
                  value={shippingCountry}
                >
                  <option value="Argentina">Argentina</option>
                  <option value="Mexico">Mexico</option>
                </select>
              </div>

              <div>
                <label className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                  Provincia
                </label>
                <input
                  className="mt-3 w-full border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                  onChange={(event) => setShippingProvince(event.target.value)}
                  placeholder="Por favor seleccione region, estado o provincia."
                  value={shippingProvince}
                />
              </div>

              <div>
                <label className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                  Ciudad
                </label>
                <input
                  className="mt-3 w-full border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                  onChange={(event) => setShippingCity(event.target.value)}
                  placeholder="Caballito"
                  value={shippingCity}
                />
              </div>

              <div>
                <label className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                  Codigo Postal
                </label>
                <input
                  className="mt-3 w-full border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                  onChange={(event) => setShippingPostalCode(event.target.value)}
                  placeholder="1405"
                  value={shippingPostalCode}
                />
              </div>

              <div>
                <label className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                  Numero de telefono
                </label>
                <input
                  className="mt-3 w-full border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                  onChange={(event) => setShippingPhone(event.target.value)}
                  placeholder="1112345678"
                  value={shippingPhone}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                  DNI
                </label>
                <input
                  className="mt-3 w-full border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                  onChange={(event) => setCustomerDni(event.target.value)}
                  placeholder="29077077"
                  value={customerDni}
                />
              </div>
            </div>
          </div>

          {!isLoggedIn ? (
            <div className="border border-outline-variant/30 bg-[#f2f4f4] p-6">
              <p className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-tertiary">
                Beneficios de crear cuenta
              </p>
              <h3 className="mt-4 font-headline text-2xl font-black uppercase tracking-tighter">
                Suma puntos y canjea descuentos
              </h3>
              <ul className="mt-6 space-y-2 text-sm text-on-surface-variant">
                <li>1 punto cada $10 MXN (Puntos Eco).</li>
                <li>500 puntos = $100 MXN de descuento.</li>
                <li>Historial de compras y acceso rapido a tu perfil.</li>
              </ul>
              <Link
                className="mt-6 inline-block border border-inverse-surface bg-white px-6 py-3 text-[0.7rem] font-black uppercase tracking-[0.25em] hover:bg-inverse-surface hover:text-surface"
                to="/login"
              >
                Iniciar sesion / Registrarme
              </Link>
            </div>
          ) : null}

          <div className="border border-outline-variant/30 bg-white p-6">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
              Metodos de envio
            </h2>
            <div className="mt-6 grid gap-3">
              <label className="flex cursor-pointer items-center justify-between border border-outline/30 bg-surface px-4 py-4 text-sm">
                <div>
                  <p className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-inverse-surface">
                    Envio a domicilio
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant">Entrega estandar (gratis en demo).</p>
                </div>
                <input
                  checked={shippingMethod === "envio_domicilio"}
                  className="h-4 w-4 rounded-none border-outline checked:bg-inverse-surface"
                  onChange={() => setShippingMethod("envio_domicilio")}
                  type="radio"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between border border-outline/30 bg-surface px-4 py-4 text-sm">
                <div>
                  <p className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-inverse-surface">
                    Retiro por sucursal
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant">Solo retiro con DNI del titular.</p>
                </div>
                <input
                  checked={shippingMethod === "retiro_sucursal"}
                  className="h-4 w-4 rounded-none border-outline checked:bg-inverse-surface"
                  onChange={() => setShippingMethod("retiro_sucursal")}
                  type="radio"
                />
              </label>

              <div className="border border-outline-variant/30 bg-[#f2f4f4] p-4">
                <p className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-tertiary">
                  Importante
                </p>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Solo el TITULAR de la compra podra retirar el pedido por la sucursal, sin excepciones.
                </p>
              </div>
            </div>
          </div>

          <div className="border border-outline-variant/30 bg-white p-6">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
              Pago y notas
            </h2>
            <div className="mt-6 grid gap-4">
              <select
                className="border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                onChange={(event) => setPaymentMethod(event.target.value)}
                value={paymentMethod}
              >
                <option value="Tarjeta">Tarjeta</option>
                <option value="TDD">TDD</option>
                <option value="Efectivo">Efectivo</option>
              </select>

              <div>
                <input
                  className="w-full border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!isLoggedIn}
                  min={0}
                  onChange={(event) => setRedeemPoints(Number(event.target.value) || 0)}
                  placeholder={isLoggedIn ? "Canjear puntos (multiplo de 500)" : "Inicia sesion para canjear puntos"}
                  type="number"
                  value={redeemPoints}
                />
              </div>

              <label className="flex items-center gap-3 text-sm">
                <input
                  checked={invoiceRequired}
                  className="h-4 w-4 rounded-none border-outline checked:bg-inverse-surface"
                  onChange={(event) => setInvoiceRequired(event.target.checked)}
                  type="checkbox"
                />
                Requiere factura
              </label>

              {invoiceRequired ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className="border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                    onChange={(event) => setInvoiceRfc(event.target.value)}
                    placeholder="RFC"
                    value={invoiceRfc}
                  />
                  <input
                    className="border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                    onChange={(event) => setInvoiceBusinessName(event.target.value)}
                    placeholder="Razon social"
                    value={invoiceBusinessName}
                  />
                </div>
              ) : null}

              <textarea
                className="min-h-[140px] border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Notas para entrega, empaquetado o preferencia de contacto"
                value={notes}
              />
            </div>
          </div>

          <div className="border border-outline-variant/30 bg-white p-6">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
              Resumen de items
            </h2>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex items-center justify-between gap-4 border-b border-outline-variant/20 pb-4 last:border-b-0 last:pb-0"
                >
                  <div>
                    <p className="font-headline text-lg font-black uppercase tracking-tighter">
                      {item.productName}
                    </p>
                    <p className="mt-1 text-sm uppercase tracking-[0.2em] text-on-surface-variant">
                      {item.color} / {item.size} / {item.quantity} pieza(s)
                    </p>
                  </div>
                  <p className="text-lg font-black">
                    ${(item.quantity * item.unitPrice).toLocaleString("es-MX")} MXN
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit border border-outline-variant/30 bg-[#f2f4f4] p-6 lg:sticky lg:top-28">
          <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
            Resumen final
          </h2>
          <div className="mt-8 space-y-4 border-b border-outline-variant/30 pb-8 text-sm uppercase tracking-[0.2em]">
            <SummaryRow label="Subtotal" value={`$${subtotal.toLocaleString("es-MX")} MXN`} />
            {estimatedPromotionDiscount > 0 && appliedPromotion && (
              <SummaryRow
                label={`Promocion: ${appliedPromotion.name}`}
                value={`-$${estimatedPromotionDiscount.toLocaleString("es-MX")} MXN`}
                valueClassName="text-secondary"
              />
            )}
            {estimatedPromotionDiscount > 0 && !appliedPromotion && (
              <SummaryRow
                label="Promocion"
                value={`-$${estimatedPromotionDiscount.toLocaleString("es-MX")} MXN`}
                valueClassName="text-secondary"
              />
            )}
            <SummaryRow
              label="Canje puntos"
              value={`-$${effectiveLoyaltyDiscount.toLocaleString("es-MX")} MXN`}
              valueClassName="text-secondary"
            />
            <SummaryRow label="Puntos a ganar" value={`+${loyaltyPreview}`} valueClassName="text-secondary" />
          </div>

          <p className="mt-8 text-3xl font-black">${estimatedTotal.toLocaleString("es-MX")} MXN</p>

          <button
            className="mt-8 w-full bg-inverse-surface px-8 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting}
            onClick={handleSubmit}
            type="button"
          >
            {submitting ? "Procesando..." : "Confirmar compra"}
          </button>
          <Link
            className="mt-4 block text-center text-[0.7rem] font-black uppercase tracking-[0.25em] underline underline-offset-4"
            to="/cart"
          >
            Volver a bolsa
          </Link>
          {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}
        </aside>
      </div>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  valueClassName = ""
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}

function ConfirmationCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-outline-variant/30 bg-[#f2f4f4] p-5">
      <p className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black">{value}</p>
    </div>
  );
}
