import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signInClient } from "../lib/api";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      await signInClient(email, password);
      navigate("/account");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo iniciar sesión");
    }
  }

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
        <form
          className="w-full max-w-xl border border-outline-variant/30 bg-surface p-8 md:p-12"
          onSubmit={handleSubmit}
        >
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
            Login cliente
          </span>
          <h2 className="mt-4 font-headline text-4xl font-black uppercase tracking-tighter">
            Entra a tu cuenta
          </h2>
          <div className="mt-8 space-y-4">
            <input
              className="w-full border border-outline/30 px-4 py-4 text-sm"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Correo electrónico"
              value={email}
            />
            <input
              className="w-full border border-outline/30 px-4 py-4 text-sm"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Contraseña"
              type="password"
              value={password}
            />
          </div>
          {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}
          <div className="mt-8 flex flex-col gap-4">
            <button
              className="bg-inverse-surface px-8 py-4 text-center text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary"
              type="submit"
            >
              Ingresar
            </button>
            <Link
              className="border border-inverse-surface px-8 py-4 text-center text-[0.7rem] font-black uppercase tracking-[0.25em] hover:bg-inverse-surface hover:text-surface"
              to="/admin/login"
            >
              Acceso administrador
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
