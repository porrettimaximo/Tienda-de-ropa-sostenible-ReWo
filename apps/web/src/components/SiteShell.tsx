import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";

type SiteShellProps = {
  children: ReactNode;
  activeNav?: "collections" | "materials" | "manifesto";
};

const navItems: Array<{ label: string; to: string; key: SiteShellProps["activeNav"] }> = [
  { label: "Colecciones", to: "/collections", key: "collections" },
  { label: "Materiales", to: "#", key: "materials" },
  { label: "Manifiesto", to: "#", key: "manifesto" }
];

export function SiteShell({ children, activeNav = "collections" }: SiteShellProps) {
  return (
    <div className="bg-surface text-on-surface">
      <nav className="sticky top-0 z-50 bg-[#f2f4f4]/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between px-5 py-6 md:px-8">
          <Link className="font-headline text-2xl font-black tracking-tighter text-[#0c0f0f]" to="/">
            ECOWEAR
          </Link>

          <div className="hidden gap-10 font-headline text-[0.8rem] font-black uppercase tracking-tighter md:flex">
            {navItems.map((item) =>
              item.to === "#" ? (
                <a
                  key={item.label}
                  className={`transition-colors duration-300 ${
                    activeNav === item.key
                      ? "border-b-2 border-[#0c0f0f] pb-1 text-[#0c0f0f]"
                      : "text-[#2d3435]/60 hover:text-[#0c0f0f]"
                  }`}
                  href="#"
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.label}
                  className={({ isActive }) =>
                    isActive || activeNav === item.key
                      ? "border-b-2 border-[#0c0f0f] pb-1 text-[#0c0f0f]"
                      : "text-[#2d3435]/60 transition-colors duration-300 hover:text-[#0c0f0f]"
                  }
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              )
            )}
          </div>

          <div className="flex items-center gap-6">
            <Link className="material-symbols-outlined text-inverse-surface" to="/cart">
              shopping_bag
            </Link>
            <Link className="material-symbols-outlined text-inverse-surface" to="/login">
              person
            </Link>
          </div>
        </div>
      </nav>

      {children}

      <footer className="bg-[#0c0f0f] px-5 py-16 text-[#f9f9f9] md:px-8 md:py-20">
        <div className="mx-auto grid w-full max-w-[1920px] grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          <div className="flex flex-col gap-8">
            <div className="text-3xl font-black tracking-widest text-white">ECOWEAR</div>
            <p className="max-w-xs text-[0.7rem] uppercase tracking-[0.2em] text-white/40">
              MONOLITHIC SUSTAINABILITY. REDEFINIENDO EL LUJO TEXTIL DESDE MÉXICO PARA EL
              MUNDO.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-[0.7rem] uppercase tracking-[0.2em]">
            <h4 className="mb-2 text-white/40">NAVEGACIÓN</h4>
            <a className="text-white/40 transition-opacity duration-500 hover:text-white" href="#">
              Privacidad
            </a>
            <a className="text-white underline underline-offset-8" href="#">
              Sostenibilidad
            </a>
            <a className="text-white/40 transition-opacity duration-500 hover:text-white" href="#">
              Puntos de Venta
            </a>
            <a className="text-white/40 transition-opacity duration-500 hover:text-white" href="#">
              Contacto
            </a>
          </div>

          <div className="flex flex-col gap-4 text-[0.7rem] uppercase tracking-[0.2em]">
            <h4 className="mb-2 text-white/40">NEWSLETTER</h4>
            <div className="relative w-full max-w-xs border-b border-white/20 pb-2">
              <input
                className="w-full border-none bg-transparent text-[0.7rem] uppercase tracking-widest text-white placeholder:text-white/20 focus:ring-0"
                placeholder="TU EMAIL"
                type="email"
              />
              <button className="material-symbols-outlined absolute right-0 top-0 text-sm">
                arrow_forward
              </button>
            </div>
          </div>

          <div className="lg:text-right">
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-white/40">
              © 2024 ECOWEAR MODA MÉXICO.
              <br />
              TODOS LOS DERECHOS RESERVADOS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
