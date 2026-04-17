import { Link } from "react-router-dom";
import { getStoredUser } from "../lib/api";


const supplierCards = [
  {
    title: "Comunidades Oaxaqueñas",
    subtitle: "Tejidos a mano / Tintes naturales",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCp-PUlsXJJLvX2gYfYadWEEsoJhDRuDHpAHh9qsbgCavHqAeDLi8TVRz4lWjuhZxeZYTyovSdQZIl89Ehg4O-prrLjvI9hzFWc3ifz3My4TiNoz4YoFxagha8_-X9GcjfWrbdN3IpfQ2r6Ox6K6J9EJoJntpXXt8HQJuwdgVlPEh5khe8IyDBoFN7_H5UKxk-5V7LE_Bid1AtGPZLrmkci6JPfdDO7OaoIUdTy-WjnVm9vuZBf7ZP4O0vHsZtKzCEAufakRlhsEQPK"
  },
  {
    title: "Bio-Tech Querétaro",
    subtitle: "Fibras recicladas / Cero desperdicio",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgkce08UlC1w6Umqq5_ojpemdExmxANonH5IrkZlNwOtNWdKKIc_4jcx7Xjp-lTOe-CXtrBShz6_ixoBOWFHJBSb0YC1ONrP9bwvnHgfsXmNrzYIPPHAi0mivTPDvH7jSyT5AA8tXkYEg235Z4ghIOk1bYmWnvW1cd9njz0pDraIpg1HJg1TmzvxwlevKhyuSuH6y0SRAUHNfkbG5RudvEspPHdmwoWS8sOWxC2qoG-xerP1-CsUV16u0zEBDZAqHy1MdjgbC5jyG9"
  },
  {
    title: "Cultivos Regenerativos",
    subtitle: "Certificación Orgánica / Agua reciclada",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtYI3VLReOMUAN1VcRgmu2_RM2WIyPmVx7mxWKJaJ-CyMONqXhPRSfKSrvBnKqHvjsKNu5T0eg2A64-PNn8n3G26Ph-4yaAxBeTK2UN7-IyUKQ6yx385BzQD73KICrFT8B0wFIwl7DIwWskMgApaLKmyU2TvnXeaZU6n4Q3OeoLi5JwOYIbCJxImn3w_0r2z9bK1LG1DOP7YNgPbsOT4cpr6_4T7DTkJ5zhdhp0apfjNvAyzpA7N2HNXSHkFZOigwqn3RHCcXkSTj1"
  }
];

export function HomePage() {
  const user = getStoredUser();

  return (

    <main>
      <section className="relative flex min-h-[720px] items-end overflow-hidden md:h-[921px]">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          alt="Modelo con ropa sostenible en entorno arquitectónico"
          src="/hero/moda_que_respira.png"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 to-transparent" />
        <div className="relative z-10 max-w-4xl px-5 pb-16 md:px-12 md:pb-24">
          <img src="/icon-512.png" alt="Logo ReWo" className="mb-8 h-32 w-32 object-contain" />
          <span className="mb-6 inline-block bg-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-container">
            Sostenibilidad Monolítica
          </span>
          <h1 className="font-headline text-5xl font-black leading-none tracking-tighter text-white md:text-8xl xl:text-9xl">
            MODA QUE RESPIRA
          </h1>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              className="bg-inverse-surface px-8 py-4 text-center text-sm font-bold uppercase tracking-tight text-surface transition-all hover:bg-neutral-800 active:scale-95 md:px-10 md:py-5"
              to="/collections"
            >
              Ver Colección
            </Link>
            <Link
              className="border border-white/20 bg-white/10 px-8 py-4 text-sm font-bold uppercase tracking-tight text-white backdrop-blur-md transition-all hover:bg-white hover:text-black active:scale-95 md:px-10 md:py-5"
              to="/manifesto"
            >
              Nuestra Historia
            </Link>
          </div>
        </div>
      </section>



      <section className="mx-5 mb-16 mt-24 flex flex-col bg-inverse-surface md:mx-12 md:mb-24 md:mt-32 md:flex-row">

        <div className="flex flex-1 flex-col justify-center p-10 md:p-16">
          <h2 className="font-headline text-4xl font-black uppercase tracking-tighter text-white md:text-5xl">
            Combos de Temporada
          </h2>
          <p className="mb-10 mt-6 max-w-md text-lg font-light leading-relaxed text-surface-dim">
            Optimiza tu armario con sets curados. Sostenibilidad multiplicada por un precio consciente.
          </p>
          <div className="flex">
            <Link
              className="bg-secondary px-10 py-5 text-sm font-bold uppercase tracking-tight text-on-secondary transition-all hover:opacity-90"
              to="/combos"
            >
              Ver Combos
            </Link>
          </div>
        </div>
        <div className="relative min-h-[320px] flex-1 md:min-h-[400px]">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            alt="Tres camisetas orgánicas apiladas"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrZQSMKRThG9QvDedXAtfSpU83qcz1kKdfENqQY4_BDECOw04JINiKgFO6iFhGgRtyUBRwbCBMpBd5sIawF4_8h6fIzZjXvwrf_h0lEL3uyJ5w8pNhzAlsapN8s-_PAjQ4dLUoW7STjyUq7ZLx16E4MsC6WBJ4JNq8CRN5LaD8060MDWrMNCnO8y1-O5dg3NkUuu782EHMbpDHzX5eGp-dD55y2NSjh2wUAgmJJ4a0Xfl48bmX2-D7d_46Mm_UmXRLYmwL2JBBv8cg"
          />
        </div>
      </section>

      <section className="bg-surface-container-low px-5 py-16 md:px-12 md:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-16 md:grid-cols-2 md:gap-24">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-tertiary">Puntos Eco</span>
            <h2 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter leading-[0.9] md:text-6xl">
              Programa de Lealtad
            </h2>
            <p className="mb-12 mt-8 text-lg leading-relaxed text-on-surface">
              Cada gramo de CO2 evitado se traduce en beneficios reales. Únete a la comunidad que está rediseñando el futuro de la moda en México.
            </p>
            {user ? (
              <div className="bg-secondary/10 px-6 py-6 border border-secondary/30">
                <p className="font-headline text-xl font-black uppercase tracking-tighter text-secondary">¡Ya eres parte!</p>
                <p className="text-sm mt-2 font-light text-on-surface">Gracias por ser parte de la revolución sostenible, <span className="font-bold">{user.name}</span>. Acumula puntos con cada compra.</p>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-block bg-inverse-surface px-8 py-4 text-sm font-bold uppercase tracking-tight text-surface transition-all hover:bg-neutral-800"
              >
                Inicia sesión para unirte
              </Link>
            )}
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div className="flex aspect-square flex-col justify-between bg-surface-container-lowest p-8">
              <span className="text-3xl font-black">-$100</span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Descuento por cada 500 Puntos Eco
              </p>
            </div>
            <div className="flex aspect-square flex-col justify-between bg-inverse-surface p-8">
              <span className="text-3xl font-black text-white">VIP</span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-surface-dim">
                Acceso a preventas exclusivas
              </p>
            </div>
            <div className="relative col-span-2 aspect-[2/1] overflow-hidden">
              <img
                className="h-full w-full object-cover"
                alt="Textiles colgando en taller luminoso"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5sRARfkyDFoBn0oB8S8rRY9QuljRMmceN_stf_i03ab0She8b5tpvlcEvDLLoFKNtNYfaUZHdWZ3wFIXcLLwRoE1lJxN9rvqTjM2Ph9jVyV1JgFl8IX7hPPeDIytm2yv8uZcz10L7DjVMOG6BrWe63sVxTy4NEofsnvWnbbtcS2o7TdMxLst1Zj3_Ff8Bpvs4XDqCbxawQgkoKEBUNluJCqYQ7WN81u78_MGGceXqr1_TaOBRGFa1XZxvF2inicJ7K55_vpsCGO-0"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 md:px-12 md:py-32">
        <div className="mx-auto mb-20 max-w-4xl text-center">
          <h2 className="font-headline text-4xl font-black uppercase tracking-tighter">Proveedores Éticos</h2>
          <p className="mt-6 leading-loose text-on-surface-variant">
            Nuestra cadena de suministro no es una línea, es un ecosistema. Trabajamos directamente con artesanos en Oaxaca y fábricas de textiles tecnológicos en Querétaro para asegurar salarios dignos y transparencia radical.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {supplierCards.map((supplier) => (
            <div key={supplier.title} className="group text-center">
              <div className="mb-8 aspect-[4/5] overflow-hidden">
                <img
                  className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                  alt={supplier.title}
                  src={supplier.image}
                />
              </div>
              <h4 className="font-headline mb-2 text-xl font-black uppercase tracking-tighter">{supplier.title}</h4>
              <p className="text-xs uppercase tracking-widest text-on-surface-variant">{supplier.subtitle}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
