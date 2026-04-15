import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <main className="grid min-h-[calc(100vh-88px)] lg:grid-cols-2">
      <section className="hidden bg-inverse-surface p-12 text-surface lg:flex lg:flex-col lg:justify-end">
        <span className="text-[0.7rem] uppercase tracking-[0.3em] text-tertiary-fixed">
          Acceso / Comunidad
        </span>
        <h1 className="mt-4 font-headline text-6xl font-black uppercase tracking-tighter">
          Puntos eco y compras conscientes
        </h1>
        <p className="mt-8 max-w-lg text-base leading-relaxed text-surface-dim">
          Inicia sesión para revisar tus puntos, historial de compras, recompensas y
          próximos lanzamientos de colección.
        </p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 md:px-8">
        <div className="w-full max-w-xl border border-outline-variant/30 bg-surface p-8 md:p-12">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
            Login cliente
          </span>
          <h2 className="mt-4 font-headline text-4xl font-black uppercase tracking-tighter">
            Entra a tu cuenta
          </h2>
          <div className="mt-8 space-y-4">
            <input className="w-full border border-outline/30 px-4 py-4 text-sm" placeholder="Correo electrónico" />
            <input className="w-full border border-outline/30 px-4 py-4 text-sm" placeholder="Contraseña" type="password" />
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <Link
              className="bg-inverse-surface px-8 py-4 text-center text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary"
              to="/account"
            >
              Ingresar
            </Link>
            <Link
              className="border border-inverse-surface px-8 py-4 text-center text-[0.7rem] font-black uppercase tracking-[0.25em] hover:bg-inverse-surface hover:text-surface"
              to="/admin/login"
            >
              Acceso administrador
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
