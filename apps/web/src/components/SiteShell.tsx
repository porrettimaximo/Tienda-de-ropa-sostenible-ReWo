import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { useCart } from "./CartContext";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const { itemCount } = useCart();

  return (
    <div className="bg-surface text-on-surface">
      <nav className="sticky top-0 z-50 bg-[#f2f4f4]/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between px-5 py-6 md:px-8">
          <Link className="font-headline text-2xl font-black tracking-tighter text-[#0c0f0f]" to="/">
            ECOWEAR
          </Link>

          <div className="flex items-center gap-6">
            <Link className="relative text-inverse-surface" to="/cart">
              <span className="material-symbols-outlined">shopping_bag</span>
              {itemCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-inverse-surface px-1 text-[0.6rem] font-black text-surface">
                  {itemCount}
                </span>
              ) : null}
            </Link>
            <Link className="material-symbols-outlined text-inverse-surface" to="/login">
              person
            </Link>
          </div>
        </div>
      </nav>

      {children}

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

