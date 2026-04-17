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
    <main className="relative flex min-h-[calc(100vh-88px)] items-center justify-center overflow-hidden">
      {/* Cinematic Background */}
      <img
        className="absolute inset-0 h-full w-full object-cover"
        alt="ReWo Sustainable Lifestyle"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp-PUlsXJJLvX2gYfYadWEEsoJhDRuDHpAHh9qsbgCavHqAeDLi8TVRz4lWjuhZxeZYTyovSdQZIl89Ehg4O-prrLjvI9hzFWc3ifz3My4TiNoz4YoFxagha8_-X9GcjfWrbdN3IpfQ2r6Ox6K6J9EJoJntpXXt8HQJuwdgVlPEh5khe8IyDBoFN7_H5UKxk-5V7LE_Bid1AtGPZLrmkci6JPfdDO7OaoIUdTy-WjnVm9vuZBf7ZP4O0vHsZtKzCEAufakRlhsEQPK"
      />
      <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-[2px]" />

      <section className="relative z-10 w-full max-w-2xl px-5 py-16">
        <form
          className="border-none bg-white/95 p-8 shadow-2xl backdrop-blur-xl md:p-14"
          onSubmit={handleSubmit}
        >
          <div className="mb-10 text-center md:text-left">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-tertiary">
              Bienvenido
            </span>
            <h2 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter text-inverse-surface md:text-6xl">
              {mode === "login" ? "Acceso ECOWEAR" : "Únete a ReWo"}
            </h2>
            <p className="mt-6 text-sm font-light leading-relaxed text-on-surface-variant max-w-sm">
              {mode === "login"
                ? "Ingresa para gestionar tu cuenta, ver tus pedidos y acumular puntos de lealtad."
                : "Crea tu cuenta para formar parte de la revolución de la moda sostenible en México."}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-outline/20 bg-outline/20">
            <button
              className={`px-4 py-4 text-[0.65rem] font-black uppercase tracking-[0.25em] transition-all ${
                mode === "login"
                  ? "bg-inverse-surface text-surface"
                  : "bg-surface/50 text-on-surface hover:bg-surface/80"
              }`}
              onClick={() => setMode("login")}
              type="button"
            >
              Login
            </button>
            <button
              className={`px-4 py-4 text-[0.65rem] font-black uppercase tracking-[0.25em] transition-all ${
                mode === "register"
                  ? "bg-inverse-surface text-surface"
                  : "bg-surface/50 text-on-surface hover:bg-surface/80"
              }`}
              onClick={() => setMode("register")}
              type="button"
            >
              Registro
            </button>
          </div>

          <div className="mt-10 space-y-4">
            {mode === "register" ? (
              <>
                <input
                  className="w-full border border-outline/20 bg-surface/50 px-5 py-4 text-sm transition-focus focus:bg-white focus:outline-none focus:ring-1 focus:ring-inverse-surface"
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Nombre completo"
                  value={fullName}
                />
                <input
                  className="w-full border border-outline/20 bg-surface/50 px-5 py-4 text-sm transition-focus focus:bg-white focus:outline-none focus:ring-1 focus:ring-inverse-surface"
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Número de teléfono (10 dígitos)"
                  value={phone}
                />
              </>
            ) : null}
            <input
              className="w-full border border-outline/20 bg-surface/50 px-5 py-4 text-sm transition-focus focus:bg-white focus:outline-none focus:ring-1 focus:ring-inverse-surface"
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="Email"
              value={identifier}
            />
            <input
              className="w-full border border-outline/20 bg-surface/50 px-5 py-4 text-sm transition-focus focus:bg-white focus:outline-none focus:ring-1 focus:ring-inverse-surface"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Contraseña"
              type="password"
              value={password}
            />
          </div>

          {error ? (
            <div className="mt-6 bg-error/5 px-4 py-3 border-l-4 border-error">
              <p className="text-xs font-bold uppercase tracking-widest text-error">{error}</p>
            </div>
          ) : null}

          <div className="mt-12">
            <button
              className="w-full bg-inverse-surface px-8 py-5 text-center text-[0.7rem] font-black uppercase tracking-[0.35em] text-surface transition-all hover:bg-secondary active:scale-[0.98]"
              type="submit"
            >
              {mode === "register" ? "Crear cuenta ahora" : "Ingresar a mi cuenta"}
            </button>
            <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
              Seguridad encriptada ReWo
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
