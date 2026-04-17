import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  createAdminPromotion,
  deleteAdminPromotion,
  getAdminPromotions,
  setAdminPromotionActive,
  updateAdminPromotion,
  type Promotion
} from "../lib/api";

type PromotionType = "percentage" | "fixed" | "combo";

const initialForm = {
  name: "",
  description: "",
  promotionType: "combo" as PromotionType,
  discountValue: 350,
  minSubtotal: 0,
  minItems: 1,
  isActive: true,
  startsAt: "",
  endsAt: ""
};

export function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [form, setForm] = useState<{
    name: string;
    description: string;
    promotionType: PromotionType;
    discountValue: number;
    minSubtotal: number;
    minItems: number;
    isActive: boolean;
    startsAt: string;
    endsAt: string;
  }>(initialForm);
  const [selectedId, setSelectedId] = useState<string>("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAdminPromotions().then((data) => {
      if (!active) return;
      setPromotions(data);
      setSelectedId(data[0]?.id ?? "");
    });
    return () => {
      active = false;
    };
  }, []);

  const selectedPromotion = useMemo(
    () => promotions.find((promo) => promo.id === selectedId),
    [promotions, selectedId]
  );

  useEffect(() => {
    if (!selectedPromotion) return;
    setForm({
      name: selectedPromotion.name || "",
      description: selectedPromotion.description || "",
      promotionType: selectedPromotion.promotionType || "combo",
      discountValue: selectedPromotion.discountValue || 0,
      minSubtotal: selectedPromotion.minSubtotal || 0,
      minItems: selectedPromotion.minItems || 1,
      isActive: selectedPromotion.isActive ?? true,
      startsAt: selectedPromotion.startsAt ? selectedPromotion.startsAt.split('T')[0] : "",
      endsAt: selectedPromotion.endsAt ? selectedPromotion.endsAt.split('T')[0] : ""
    });
  }, [selectedPromotion]);

  async function handleCreate() {
    try {
      setError("");
      setStatus("");
      const created = await createAdminPromotion(form);
      setPromotions((current) => [...current, created]);
      setSelectedId(created.id);
      setStatus("Promocion creada.");
      setForm(initialForm);
    } catch {
      setError("No se pudo crear la promocion.");
    }
  }

  async function handleSave() {
    if (!selectedPromotion) return;
    try {
      setError("");
      setStatus("");
      const updated = await updateAdminPromotion(selectedPromotion.id, form);
      setPromotions((current) => current.map((promo) => (promo.id === updated.id ? updated : promo)));
      setStatus("Promocion actualizada.");
    } catch {
      setError("No se pudo actualizar la promocion.");
    }
  }

  async function handleToggle(promo: Promotion) {
    try {
      setError("");
      setStatus("");
      const updated = await setAdminPromotionActive(promo.id, !promo.isActive);
      setPromotions((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)));
      setStatus(updated.isActive ? "Promocion activada." : "Promocion desactivada.");
    } catch {
      setError("No se pudo cambiar el estado.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta promoción?")) return;
    try {
      setError("");
      setStatus("");
      await deleteAdminPromotion(id);
      setPromotions((current) => current.filter((p) => p.id !== id));
      if (selectedId === id) {
        setSelectedId("");
      }
      setStatus("Promocion eliminada.");
    } catch {
      setError("No se pudo eliminar la promocion.");
    }
  }

  return (
    <main className="px-5 py-12 md:px-8 lg:px-12">
      <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
            Admin / Promociones
          </span>
          <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter text-inverse-surface md:text-7xl">
            Combos y descuentos
          </h1>
        </div>
        <div className="flex gap-4">
          <Link
            className="border border-inverse-surface px-6 py-3 text-[0.65rem] font-black uppercase tracking-[0.2em] hover:bg-inverse-surface hover:text-surface"
            to="/admin"
          >
            Volver al panel
          </Link>
          <Link
            className="bg-inverse-surface px-6 py-3 text-[0.65rem] font-black uppercase tracking-[0.2em] text-surface hover:bg-secondary"
            to="/combos"
          >
            Ver en tienda
          </Link>
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="border border-outline-variant/30 bg-white">
          <div className="flex items-end justify-between gap-4 border-b border-outline-variant/20 p-6">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
                Promociones
              </p>
              <h2 className="mt-2 font-headline text-2xl font-black uppercase tracking-tighter">
                Lista
              </h2>
            </div>
            <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-tertiary">
              {promotions.length} total
            </span>
          </div>

          <div className="divide-y divide-outline-variant/20">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className={`w-full px-6 py-5 text-left transition-colors cursor-pointer ${
                  promo.id === selectedId ? "bg-[#f2f4f4]" : "hover:bg-[#f8f9f9]"
                }`}
                onClick={() => setSelectedId(promo.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedId(promo.id);
                  }
                }}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-tertiary">
                      {promo.promotionType}
                    </p>
                    <p className="mt-2 font-headline text-xl font-black uppercase tracking-tighter">
                      {promo.name}
                    </p>
                    <p className="mt-2 text-sm text-on-surface-variant">
                      {promo.description ?? "Sin descripcion"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {promo.minSubtotal > 0 && (
                        <span className="bg-surface border border-outline/20 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-wider">
                          Min: ${promo.minSubtotal.toLocaleString()}
                        </span>
                      )}
                      {promo.minItems > 1 && (
                        <span className="bg-surface border border-outline/20 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-wider">
                          Min: {promo.minItems} productos
                        </span>
                      )}
                      {promo.startsAt && (
                        <span className="bg-surface border border-outline/20 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-wider">
                          Desde: {new Date(promo.startsAt).toLocaleDateString()}
                        </span>
                      )}
                      {promo.endsAt && (
                        <span className="bg-surface border border-outline/20 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-error">
                          Vence: {new Date(promo.endsAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-lg font-black">{promo.discountLabel}</p>
                    <p className={`mt-2 text-sm font-bold ${promo.isActive ? "text-secondary" : "text-on-surface-variant"}`}>
                      {promo.isActive ? "Activa" : "Inactiva"}
                    </p>
                    <button
                      className="mt-3 border border-outline/30 px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.2em] hover:border-inverse-surface"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleToggle(promo);
                      }}
                      type="button"
                    >
                      {promo.isActive ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      className="mt-3 border border-error/30 px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.2em] text-error hover:bg-error hover:text-white"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(promo.id);
                      }}
                      type="button"
                    >
                      Eliminar
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="border border-outline-variant/30 bg-[#f2f4f4] p-6">
            <p className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-tertiary">
              Editar / Crear
            </p>

            <div className="mt-6 grid gap-4">
              <input
                className="border border-outline/30 px-4 py-3 text-sm"
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Nombre"
                value={form.name}
              />
              <textarea
                className="min-h-[110px] border border-outline/30 px-4 py-3 text-sm"
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Descripcion"
                value={form.description}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  className="border border-outline/30 px-4 py-3 text-sm"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      promotionType: event.target.value as "percentage" | "fixed" | "combo"
                    }))
                  }
                  value={form.promotionType}
                >
                  <option value="combo">Combo</option>
                  <option value="fixed">Fijo</option>
                  <option value="percentage">Porcentaje</option>
                </select>
                <input
                  className="border border-outline/30 px-4 py-3 text-sm"
                  min={0}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, discountValue: Number(event.target.value) || 0 }))
                  }
                  placeholder="Valor Descuento"
                  type="number"
                  value={form.discountValue}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-[0.6rem] font-black uppercase tracking-widest text-on-surface-variant mb-1 block">Subtotal Mínimo</label>
                  <input
                    className="w-full border border-outline/30 px-4 py-3 text-sm"
                    min={0}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, minSubtotal: Number(event.target.value) || 0 }))
                    }
                    type="number"
                    value={form.minSubtotal}
                  />
                </div>
                <div>
                  <label className="text-[0.6rem] font-black uppercase tracking-widest text-on-surface-variant mb-1 block">Variedad Mínima (Productos)</label>
                  <input
                    className="w-full border border-outline/30 px-4 py-3 text-sm"
                    min={1}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, minItems: Number(event.target.value) || 1 }))
                    }
                    type="number"
                    value={form.minItems}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-[0.6rem] font-black uppercase tracking-widest text-on-surface-variant mb-1 block">Fecha Inicio</label>
                  <input
                    className="w-full border border-outline/30 px-4 py-3 text-sm"
                    onChange={(event) => setForm((current) => ({ ...current, startsAt: event.target.value }))}
                    type="date"
                    value={form.startsAt}
                  />
                </div>
                <div>
                  <label className="text-[0.6rem] font-black uppercase tracking-widest text-on-surface-variant mb-1 block">Fecha Vencimiento</label>
                  <input
                    className="w-full border border-outline/30 px-4 py-3 text-sm"
                    onChange={(event) => setForm((current) => ({ ...current, endsAt: event.target.value }))}
                    type="date"
                    value={form.endsAt}
                  />
                </div>
              </div>
              <label className="flex items-center gap-3 text-sm">
                <input
                  checked={form.isActive}
                  onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
                  type="checkbox"
                />
                Activa
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <button
                  className="bg-inverse-surface px-6 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary"
                  onClick={handleCreate}
                  type="button"
                >
                  Crear
                </button>
                <button
                  className="border border-inverse-surface px-6 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] hover:bg-inverse-surface hover:text-surface disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!selectedPromotion}
                  onClick={handleSave}
                  type="button"
                >
                  Guardar
                </button>
                <button
                  className="col-span-2 border border-error/30 px-6 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] text-error hover:bg-error hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!selectedPromotion}
                  onClick={() => selectedPromotion && handleDelete(selectedPromotion.id)}
                  type="button"
                >
                  Eliminar Permanentemente
                </button>
              </div>
            </div>
          </section>

          {status ? <p className="text-sm text-secondary">{status}</p> : null}
          {error ? <p className="text-sm text-error">{error}</p> : null}
        </aside>
      </div>
    </main>
  );
}
