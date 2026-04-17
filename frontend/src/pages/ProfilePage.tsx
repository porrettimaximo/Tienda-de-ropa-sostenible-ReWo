import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCustomerProfile, updateCustomerProfile } from "../lib/api";

export function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState("");
  const [role, setRole] = useState<"client" | "admin">("client");
  const [ecoPoints, setEcoPoints] = useState(0);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getCustomerProfile()
      .then((data) => {
        if (!active) return;
        setProfileId(data.id);
        setRole(data.role);
        setEcoPoints(data.ecoPoints);
        setFullName(data.fullName);
        setEmail(data.email);
        setPhone(data.phone);
      })
      .catch((fetchError) => {
        if (!active) return;
        setError(fetchError instanceof Error ? fetchError.message : "No se pudo cargar el perfil");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSave() {
    setError("");
    setStatus("");

    try {
      const updated = await updateCustomerProfile({ fullName, email, phone });
      setStatus("Perfil actualizado.");
      setEcoPoints(updated.loyalty_points);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo guardar");
    }
  }

  return (
    <main className="px-5 py-12 md:px-8 lg:px-12">
      <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
            Cuenta / Perfil
          </span>
          <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter text-inverse-surface md:text-7xl">
            Mi perfil
          </h1>
        </div>
        <Link className="text-[0.7rem] uppercase tracking-[0.2em] underline underline-offset-4" to="/account">
          Volver a mi cuenta
        </Link>
      </header>

      {loading ? (
        <section className="border border-outline-variant/30 bg-white p-8">
          <p className="text-sm text-on-surface-variant">Cargando perfil...</p>
        </section>
      ) : (
        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="border border-outline-variant/30 bg-white p-8">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-on-surface-variant">
              Datos de usuario
            </p>

            <div className="mt-8 grid gap-4">
              <label className="block">
                <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                  Nombre completo
                </span>
                <input
                  className="mt-3 w-full border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                  onChange={(event) => setFullName(event.target.value)}
                  value={fullName}
                />
              </label>

              <label className="block">
                <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                  Email
                </span>
                <input
                  className="mt-3 w-full border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  value={email}
                />
              </label>

              <label className="block">
                <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-on-surface-variant">
                  Telefono
                </span>
                <input
                  className="mt-3 w-full border border-outline/30 bg-surface px-4 py-4 text-sm outline-none focus:border-inverse-surface"
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+52 55 0000 0000"
                  value={phone}
                />
              </label>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                className="bg-inverse-surface px-8 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary"
                onClick={handleSave}
                type="button"
              >
                Guardar cambios
              </button>
              <Link
                className="border border-inverse-surface px-8 py-4 text-center text-[0.7rem] font-black uppercase tracking-[0.25em] hover:bg-inverse-surface hover:text-surface"
                to="/collections"
              >
                Volver al catalogo
              </Link>
            </div>

            {status ? <p className="mt-4 text-sm text-secondary">{status}</p> : null}
            {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}
          </section>

          <aside className="space-y-6">
            <article className="bg-[#f2f4f4] p-8">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-on-surface-variant">
                Resumen
              </p>
              <h2 className="mt-4 font-headline text-3xl font-black uppercase tracking-tighter">
                {role === "admin" ? "Admin" : "Cliente"}
              </h2>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Metric label="ID" value={profileId || "-"} />
                <Metric label="Puntos Eco" value={ecoPoints.toLocaleString("es-MX")} />
              </div>
              <p className="mt-6 text-sm leading-relaxed text-on-surface-variant">
                Los datos se guardan en el backend y se usan para lealtad, ventas y facturacion.
              </p>
            </article>

            <article className="border border-outline-variant/30 bg-white p-8">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-tertiary">
                Tip
              </p>
              <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
                Si queres factura en ventas, asegurate de tener tu email actualizado y a mano.
              </p>
            </article>
          </aside>
        </div>
      )}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-outline-variant/30 bg-white p-5">
      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-on-surface-variant">{label}</p>
      <p className="mt-2 break-words text-sm font-black">{value}</p>
    </div>
  );
}

