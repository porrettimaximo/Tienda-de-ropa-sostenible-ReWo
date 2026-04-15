import { Link } from "react-router-dom";

import { accountSummary } from "../data/store";

export function AccountPage() {
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

      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="bg-[#f2f4f4] p-8">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-on-surface-variant">
            Perfil
          </p>
          <h2 className="mt-4 font-headline text-3xl font-black uppercase tracking-tighter">
            {accountSummary.tier}
          </h2>
          <p className="mt-3 text-sm">{accountSummary.email}</p>
          <div className="mt-10 border-t border-outline-variant/30 pt-8">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-on-surface-variant">
              Puntos disponibles
            </p>
            <p className="mt-3 text-5xl font-black">{accountSummary.ecoPoints}</p>
            <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
              Próxima recompensa: {accountSummary.nextReward}
            </p>
          </div>
        </section>

        <section className="space-y-6">
          {[
            {
              title: "Última compra",
              body: "Túnica Ancestral Lino / entrega confirmada / +340 puntos"
            },
            {
              title: "Prendas recuperadas",
              body: "2 piezas enviadas al programa circular / +500 puntos"
            },
            {
              title: "Acceso preventa",
              body: "Colección cápsula otoño disponible 48h antes para tu nivel"
            }
          ].map((card) => (
            <article key={card.title} className="border border-outline-variant/30 p-8">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-tertiary">{card.title}</p>
              <p className="mt-4 text-lg leading-relaxed">{card.body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
