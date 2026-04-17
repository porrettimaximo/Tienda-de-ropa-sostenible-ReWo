import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerClient, signInAuto } from "../lib/api";

type Mode = "login" | "register";

export function LoginPage({ defaultMode = "login" }: { defaultMode?: Mode }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    if (mode === "register") {
      if (!fullName.trim()) {
        setError("El nombre completo es requerido.");
        return false;
      }
      if (!/^\S+@\S+\.\S+$/.test(identifier)) {
        setError("Por favor, introduce un email válido.");
        return false;
      }
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return false;
      }
      if (!/^\d{10}$/.test(phone)) {
        setError("El número de teléfono debe tener 10 dígitos.");
        return false;
      }
    }
    return true;
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      if (mode === "register") {
        await registerClient({ fullName, email: identifier, password, phone });
        navigate("/account");
        return;
      }

      const response = await signInAuto(identifier, password);
      navigate(response.detectedRole === "admin" ? "/admin" : "/account");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo iniciar sesion");
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-88px)] lg:grid-cols-2">
      <section className="hidden bg-inverse-surface p-12 text-surface lg:flex lg:flex-col lg:justify-end">
        <span className="text-[0.7rem] uppercase tracking-[0.3em] text-tertiary-fixed">Acceso</span>
        <h1 className="mt-4 font-headline text-6xl font-black uppercase tracking-tighter">
          Un solo login
        </h1>
        <p className="mt-8 max-w-lg text-base leading-relaxed text-surface-dim">
          Usa este formulario para clientes y administracion. El rol se elige antes de ingresar.
        </p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 md:px-8">
        <form
          className="w-full max-w-xl border border-outline-variant/30 bg-surface p-8 md:p-12"
          onSubmit={handleSubmit}
        >
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
            Acceso
          </span>
          <h2 className="mt-4 font-headline text-4xl font-black uppercase tracking-tighter">
            Acceso ECOWEAR
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              className={`border px-4 py-3 text-[0.7rem] font-black uppercase tracking-[0.25em] ${
                mode === "login"
                  ? "border-inverse-surface bg-inverse-surface text-surface"
                  : "border-outline/30 bg-white hover:border-inverse-surface"
              }`}
              onClick={() => setMode("login")}
              type="button"
            >
              Ingresar
            </button>
            <button
              className={`border px-4 py-3 text-[0.7rem] font-black uppercase tracking-[0.25em] ${
                mode === "register"
                  ? "border-inverse-surface bg-inverse-surface text-surface"
                  : "border-outline/30 bg-white hover:border-inverse-surface"
              }`}
              onClick={() => setMode("register")}
              type="button"
            >
              Registrarme
            </button>
          </div>

          <div className="mt-8 space-y-4">
            {mode === "register" ? (
              <>
                <input
                  className="w-full border border-outline/30 px-4 py-4 text-sm"
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Nombre completo"
                  value={fullName}
                />
                <input
                  className="w-full border border-outline/30 px-4 py-4 text-sm"
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Número de teléfono"
                  value={phone}
                />
              </>
            ) : null}
            <input
              className="w-full border border-outline/30 px-4 py-4 text-sm"
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="Email (o admin)"
              value={identifier}
            />
            <input
              className="w-full border border-outline/30 px-4 py-4 text-sm"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Contrasena"
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
              {mode === "register" ? "Crear cuenta" : "Ingresar"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
