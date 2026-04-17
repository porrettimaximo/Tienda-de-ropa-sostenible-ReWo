import { Link } from "react-router-dom";

export function ManifestoPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative flex min-h-[720px] items-end overflow-hidden md:h-[921px]">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          alt="Nuestra razón de ser"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB7iEjgb_odwIuAM3_w6QD3kDnCyGKerVf5RCxltuWMIqyQ61YYaPZac1EFAOMz-rrW7lEtJ09mB1cEMD32_bOKYL3EvsXqRQqMJYMSb9wtbA6uQW-Axifsc1PGZeIUW5Xl-3zKdnm9fNVVgSR2e5c0HYHAjEDM-ZX9k1r2mu_ifmLlP_0FpxpsUNUpqYa1O5fWr5wMjhz-9z2tEH6DgUW99JOW-9_ZBpMI_02G8vak6VjtsmqnjfDapztHewxWLWj2z3f6Sd9Xx58"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 to-transparent" />
        <div className="relative z-10 max-w-4xl px-5 pb-16 md:px-12 md:pb-24">
          <span className="mb-6 inline-block bg-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-container">
            El Manifiesto
          </span>
          <h1 className="font-headline text-5xl font-black leading-none tracking-tighter text-white md:text-8xl xl:text-9xl mb-8 uppercase">
            Nuestra Razón de Ser
          </h1>
          <p className="text-xl md:text-2xl font-light leading-relaxed max-w-xl text-white">
            En la intersección entre la herencia ancestral y la arquitectura moderna, EcoWear redefine la permanencia de lo esencial.
          </p>
        </div>
      </section>

      {/* Manifiesto Section */}
      <section className="py-32 bg-surface">
        <div className="max-w-screen-xl mx-auto px-8 text-center">
          <div className="mb-12">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-tertiary">La Filosofía</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-inverse-surface mb-12 max-w-4xl mx-auto leading-tight uppercase">
            La sostenibilidad no es una tendencia, es una monolítica verdad.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left items-start">
            <p className="text-lg leading-relaxed text-on-surface">
              Nuestra visión rechaza lo efímero. Cada fibra de EcoWear Moda México nace de un compromiso inquebrantable con el entorno. No diseñamos para la temporada; diseñamos para la eternidad. Utilizamos materiales que regresan a la tierra, honrando el ciclo natural que nos provee de vida.
            </p>
            <p className="text-lg leading-relaxed text-on-surface">
              Buscamos la pureza en la forma y la ética en la función. En un mundo saturado de exceso, elegimos el silencio de la calidad. Nuestras piezas son monumentos a la artesanía consciente, creadas para resistir el paso del tiempo y las mareas del consumo rápido.
            </p>
          </div>
        </div>
      </section>

      {/* El Proceso */}
      <section className="bg-surface-container-low py-32">
        <div className="max-w-screen-2xl mx-auto px-8">
          <h2 className="text-4xl font-black tracking-tighter mb-16 uppercase">El Proceso</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 group">
              <div className="aspect-[16/9] overflow-hidden bg-surface-dim">
                <img
                  className="w-full h-full object-cover grayscale transition-transform duration-700 hover:scale-105"
                  alt="Materia prima"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0rEBbanxULs2KNU8yqm4_hTtIsGp5T_UUD2H_uhfhdglgNJN_SJH8B4nlcFySGkhIGxdFqse9bdX87ScwcliwbHS9DKG_CU2oxXrDQkNqdX8yBXJecf4BWn-6aBTsIBwj4IYqjnHO1FvODRi5bTx2GY9RMeLUzYpVvFWqLPDYdNw_weCxsJDoRsmxIFiH_tHWRElx8d9hmwjFyKHJJj_sJ02NIvpU8OunXJ-cGNIYPtxWDhU0PIOYiKmpJzhT8DxtcXUomRBKiGjB"
                />
              </div>
              <div className="mt-6 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight uppercase">Materia Prima Orgánica</h3>
                  <p className="text-on-surface-variant mt-2 max-w-md">Seleccionamos únicamente fibras de lino y algodón certificado, cultivados sin pesticidas en tierras mexicanas.</p>
                </div>
                <span className="text-6xl font-black text-outline-variant opacity-20">01</span>
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col justify-end">
              <div className="aspect-[3/4] overflow-hidden bg-surface-dim mb-6">
                <img
                  className="w-full h-full object-cover grayscale transition-transform duration-700 hover:scale-105"
                  alt="Manos maestras"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiKAus3TG0T6Cx3qpE21dhujNBKziYXIkshQYtIjSSyu6WiDw9zzlMgXefApuzaBY3BzOJDITtkgsfCXK-JqGcKvFZuUUyfiAuax6y6dSXMiefMcXR5jmNP8sIXd_bVqDnvnJMNUpOk4_a_kviBkX26xhpVZM57Y2ueRkVUB47YZl7d9quXGk4e6iEqVjYStofiMc3CXOsZCC5TxIw2lvQJvrm0aNV5LLczklzFX5WfACQoMIxhJ34TfHJ8MxSOSRtdiZ-uecJVx16"
                />
              </div>
              <h3 className="text-xl font-bold tracking-tight uppercase">Manos Maestras</h3>
              <p className="text-on-surface-variant mt-2">Cada costura cuenta una historia de siglos. Colaboramos con comunidades artesanales bajo esquemas de comercio justo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Compromiso Circular */}
      <section className="py-32 bg-surface">
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <div className="inline-block px-4 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold tracking-widest uppercase mb-6">Iniciativa Cero</div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-8 uppercase">Compromiso Circular</h2>
              <p className="text-lg text-on-surface-variant mb-12">No permitimos que nuestras prendas terminen en vertederos. Hemos creado un ecosistema donde tu lealtad se traduce en regeneración.</p>
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 flex items-center justify-center bg-surface-container text-tertiary">
                    <span className="material-symbols-outlined text-2xl">refresh</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Retorno Consciente</h4>
                    <p className="text-on-surface-variant">Trae tus piezas usadas de EcoWear y recibe créditos para tu próxima adquisición atemporal.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 flex items-center justify-center bg-surface-container text-tertiary">
                    <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Segunda Vida</h4>
                    <p className="text-on-surface-variant">Las fibras son procesadas y reintegradas en nuevas colecciones o donadas para proyectos de infraestructura artesanal.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="bg-surface-container-low p-12 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-[120px] text-tertiary/30">eco</span>
                  <div className="mt-8">
                    <div className="text-4xl font-black text-inverse-surface uppercase">100%</div>
                    <div className="text-xs font-bold tracking-widest uppercase text-tertiary mt-2 uppercase">Reintegración</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 bg-inverse-surface text-surface flex flex-col items-center justify-center px-8 text-center">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-12 uppercase leading-none max-w-4xl">
          Forma parte de la permanencia
        </h2>
        <Link
          className="inline-block bg-surface text-inverse-surface px-12 py-5 text-sm font-bold tracking-[0.2em] uppercase transition-transform hover:-translate-y-1 active:scale-95 duration-300"
          to="/collections"
        >
          Explorar Colección
        </Link>
      </section>
    </main>
  );
}
