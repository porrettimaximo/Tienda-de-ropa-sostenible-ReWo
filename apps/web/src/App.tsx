const featuredProducts = [
  {
    name: "Campera Luma",
    description: "Exterior reciclado, abrigo liviano y paleta tierra.",
    price: "$89.900"
  },
  {
    name: "Buzo Nativa",
    description: "Algodon organico con fit relajado para uso diario.",
    price: "$46.500"
  },
  {
    name: "Pantalon Raiz",
    description: "Tela durable y corte amplio pensado para combinar.",
    price: "$58.700"
  }
];

function App() {
  return (
    <div className="min-h-screen bg-sand text-bark">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-moss/70">ReWo</p>
          <h1 className="font-serif text-2xl">Tienda de ropa sostenible</h1>
        </div>
        <nav className="hidden gap-6 text-sm md:flex">
          <a href="#coleccion">Coleccion</a>
          <a href="#impacto">Impacto</a>
          <a href="#newsletter">Newsletter</a>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-16 pt-4">
        <section className="grid gap-8 rounded-[2rem] bg-white p-8 shadow-card md:grid-cols-[1.2fr_0.8fr] md:p-12">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-clay">Nueva temporada</p>
            <div className="space-y-4">
              <h2 className="max-w-xl font-serif text-5xl leading-none">
                Moda responsable con identidad calida y urbana.
              </h2>
              <p className="max-w-lg text-base leading-7 text-bark/75">
                Esta pantalla es un placeholder inicial. Cuando me mandes tu primera
                ventana, replico exactamente su estilo y construyo las demas sobre esa base.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-full bg-moss px-6 py-3 text-sm font-medium text-white">
                Ver coleccion
              </button>
              <button className="rounded-full border border-bark/15 px-6 py-3 text-sm font-medium">
                Conocer impacto
              </button>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-gradient-to-br from-moss via-moss to-clay p-8 text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-white/70">Impacto positivo</p>
            <div className="mt-10 space-y-6">
              <div>
                <p className="text-4xl font-semibold">87%</p>
                <p className="mt-2 text-sm text-white/80">materiales de bajo impacto en la coleccion destacada</p>
              </div>
              <div>
                <p className="text-4xl font-semibold">1.240 L</p>
                <p className="mt-2 text-sm text-white/80">ahorro estimado de agua por prenda seleccionada</p>
              </div>
            </div>
          </div>
        </section>

        <section id="coleccion" className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-clay">Destacados</p>
              <h3 className="font-serif text-3xl">Coleccion esencial</h3>
            </div>
            <p className="max-w-md text-sm leading-6 text-bark/70">
              Dejamos una base visual simple para avanzar rapido. Luego copiamos tu primera pantalla y hacemos consistente todo el producto.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <article key={product.name} className="rounded-[1.5rem] bg-white p-6 shadow-card">
                <div className="mb-5 h-52 rounded-[1.25rem] bg-gradient-to-br from-sand to-[#ddd2c4]" />
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold">{product.name}</h4>
                  <p className="text-sm leading-6 text-bark/70">{product.description}</p>
                  <p className="pt-2 text-lg font-medium">{product.price}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
