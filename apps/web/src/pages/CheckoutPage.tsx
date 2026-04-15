import { Link } from "react-router-dom";

export function CheckoutPage() {
  return (
    <main className="px-5 py-12 md:px-8 lg:px-12">
      <header className="mb-14">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
          Checkout / Confirmación
        </span>
        <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter text-inverse-surface md:text-7xl">
          Cierre consciente
        </h1>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
        <section className="space-y-8">
          {[
            "Datos de contacto",
            "Dirección de entrega",
            "Método de envío",
            "Pago"
          ].map((title) => (
            <div key={title} className="border border-outline-variant/30 p-8">
              <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">{title}</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <input className="border border-outline/30 bg-surface px-4 py-4 text-sm" placeholder="Nombre" />
                <input className="border border-outline/30 bg-surface px-4 py-4 text-sm" placeholder="Apellido" />
                <input className="border border-outline/30 bg-surface px-4 py-4 text-sm md:col-span-2" placeholder="Correo electrónico" />
                <input className="border border-outline/30 bg-surface px-4 py-4 text-sm md:col-span-2" placeholder="Dirección / dato de ejemplo" />
              </div>
            </div>
          ))}
        </section>

        <aside className="h-fit bg-[#f2f4f4] p-8">
          <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">Resumen final</h2>
          <div className="mt-8 space-y-4 border-b border-outline-variant/30 pb-8 text-sm uppercase tracking-[0.2em]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$5,150 MXN</span>
            </div>
            <div className="flex justify-between">
              <span>Promoción combo</span>
              <span className="text-secondary">-$350 MXN</span>
            </div>
            <div className="flex justify-between">
              <span>Puntos a ganar</span>
              <span className="text-secondary">+480</span>
            </div>
          </div>
          <p className="mt-8 text-3xl font-black">$4,800 MXN</p>
          <button className="mt-8 w-full bg-inverse-surface px-8 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary">
            Confirmar compra
          </button>
          <Link
            className="mt-4 block text-center text-[0.7rem] font-black uppercase tracking-[0.25em] underline underline-offset-4"
            to="/cart"
          >
            Volver a bolsa
          </Link>
        </aside>
      </div>
    </main>
  );
}
