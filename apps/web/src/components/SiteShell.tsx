import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useCart } from "./CartContext";
import { getStoredUser, logout } from "../lib/api";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const location = useLocation();
  const { itemCount } = useCart();
  const hideActions = location.pathname === "/login" || location.pathname === "/admin/login";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(() => getStoredUser()?.email ?? null);
  const [userRole, setUserRole] = useState<"client" | "admin" | null>(() => getStoredUser()?.role ?? null);

  useEffect(() => {
    const handler = () => {
      const user = getStoredUser();
      setUserEmail(user?.email ?? null);
      setUserRole(user?.role ?? null);
    };
    window.addEventListener("storage", handler);
    window.addEventListener("ecowear_user_changed", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("ecowear_user_changed", handler);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="bg-surface text-on-surface">
      <nav className="sticky top-0 z-50 bg-[#f2f4f4]/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between px-5 py-6 md:px-8">
          <Link className="font-headline text-2xl font-black tracking-tighter text-[#0c0f0f]" to="/">
            ECOWEAR
          </Link>

          {!hideActions ? (
            <div className="flex items-center gap-6">
              <Link className="relative text-inverse-surface" to="/cart" aria-label="Bolsa">
                <span className="material-symbols-outlined">shopping_bag</span>
                {itemCount > 0 ? (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-inverse-surface px-1 text-[0.6rem] font-black text-surface">
                    {itemCount}
                  </span>
                ) : null}
              </Link>
              <div className="flex items-center gap-3">
                {userEmail ? (
                  <span
                    className="hidden max-w-[220px] truncate text-[0.7rem] font-black uppercase tracking-[0.2em] text-inverse-surface md:block"
                    title={userEmail}
                  >
                    {userEmail}
                  </span>
                ) : null}
                <button
                  className="material-symbols-outlined text-inverse-surface"
                  aria-label="Menu de cuenta"
                  onClick={() => {
                    const user = getStoredUser();
                    if (!user) {
                      setIsMenuOpen(false);
                      window.location.assign("/login");
                      return;
                    }
                    setIsMenuOpen((current) => !current);
                  }}
                  type="button"
                >
                  person
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </nav>

      {children}

      {!hideActions ? (
        <>
          <div
            className={`fixed inset-0 z-50 bg-black/30 transition-opacity ${
              isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={() => setIsMenuOpen(false)}
          />
          <aside
            className={`fixed right-0 top-0 z-[60] h-full w-[320px] border-l border-outline-variant/30 bg-white shadow-xl transition-transform ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            aria-hidden={!isMenuOpen}
          >
            <div className="flex h-full flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-tertiary">
                    Cuenta
                  </p>
                  <p className="mt-2 break-words text-sm font-bold text-on-surface">
                    {userEmail ?? "Sesion"}
                  </p>
                  <p className="mt-1 text-[0.7rem] uppercase tracking-[0.2em] text-on-surface-variant">
                    {userRole === "admin" ? "Dashboard" : "Mi cuenta"}
                  </p>
                </div>
                <button
                  className="material-symbols-outlined text-inverse-surface"
                  aria-label="Cerrar"
                  onClick={() => setIsMenuOpen(false)}
                  type="button"
                >
                  close
                </button>
              </div>

              <div className="mt-8 grid gap-3">
                <Link
                  className="border border-outline/30 px-5 py-4 text-left text-[0.75rem] font-black uppercase tracking-[0.2em] hover:bg-inverse-surface hover:text-surface"
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mi cuenta
                </Link>
                <Link
                  className="border border-outline/30 px-5 py-4 text-left text-[0.75rem] font-black uppercase tracking-[0.2em] hover:bg-inverse-surface hover:text-surface"
                  to={userRole === "admin" ? "/admin" : "/account"}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  className="mt-2 border border-outline/30 px-5 py-4 text-left text-[0.75rem] font-black uppercase tracking-[0.2em] hover:border-error hover:text-error"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                    window.location.href = "/";
                  }}
                  type="button"
                >
                  Log Out
                </button>
              </div>

              <div className="mt-auto border-t border-outline-variant/30 pt-6">
                <p className="text-xs leading-relaxed text-on-surface-variant">
                  En modo demo, el acceso admin es con usuario <span className="font-bold">admin</span>.
                </p>
              </div>
            </div>
          </aside>
        </>
      ) : null}

      <footer className="bg-[#0c0f0f] px-5 py-16 text-[#f9f9f9] md:px-8 md:py-20">
        <div className="mx-auto grid w-full max-w-[1920px] grid-cols-1 gap-12 md:grid-cols-2 md:items-end">
          <div className="flex flex-col gap-8">
            <div className="text-3xl font-black tracking-widest text-white">ECOWEAR</div>
            <p className="max-w-xs text-[0.7rem] uppercase tracking-[0.2em] text-white/40">
              MONOLITHIC SUSTAINABILITY. REDEFINIENDO EL LUJO TEXTIL DESDE MEXICO PARA EL MUNDO.
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-white/40">
              MAXIMO PORRETTI. TODOS LOS DERECHOS RESERVADOS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
