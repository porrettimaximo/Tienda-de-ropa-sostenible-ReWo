import { Link } from "react-router-dom";

export function AdminLoginPage() {
  return (
    <main className="grid min-h-[calc(100vh-88px)] lg:grid-cols-2">
      <section className="hidden bg-[#f2f4f4] p-12 lg:flex lg:flex-col lg:justify-end">
        <span className="text-[0.7rem] uppercase tracking-[0.3em] text-tertiary">
          Acceso interno
        </span>
        <h1 className="mt-4 font-headline text-6xl font-black uppercase tracking-tighter text-inverse-surface">
          Operación, stock y reportes
        </h1>
        <p className="mt-8 max-w-lg text-base leading-relaxed text-on-surface-variant">
          Panel para administrar productos, variantes, promociones, proveedores y ventas
          por canal.
        </p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 md:px-8">
        <div className="w-full max-w-xl border border-outline-variant/30 bg-surface p-8 md:p-12">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
            Login admin
          </span>
          <h2 className="mt-4 font-headline text-4xl font-black uppercase tracking-tighter">
            Administración ECOWEAR
          </h2>
          <div className="mt-8 space-y-4">
            <input className="w-full border border-outline/30 px-4 py-4 text-sm" placeholder="Usuario" />
            <input className="w-full border border-outline/30 px-4 py-4 text-sm" placeholder="Contraseña" type="password" />
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <Link
              className="bg-inverse-surface px-8 py-4 text-center text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary"
              to="/admin"
            >
              Ingresar al panel
            </Link>
            <Link
              className="text-center text-[0.7rem] uppercase tracking-[0.2em] underline underline-offset-4"
              to="/login"
            >
              Volver a login cliente
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
