import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  createAdminSupplier,
  getAdminSuppliers,
  updateAdminSupplier,
  type Supplier
} from "../lib/api";

const initialForm = {
  name: "",
  country: "",
  organicCertification: "",
  materials: "",
  notes: ""
};

function parseMaterials(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAdminSuppliers()
      .then((data) => {
        if (!active) return;
        setSuppliers(data);
        setSelectedId(data[0]?.id ?? "");
      })
      .catch(() => {
        if (!active) return;
        setSuppliers([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const selectedSupplier = useMemo(
    () => suppliers.find((item) => item.id === selectedId),
    [suppliers, selectedId]
  );

  useEffect(() => {
    if (!selectedSupplier) return;
    setForm({
      name: selectedSupplier.name,
      country: selectedSupplier.country ?? "",
      organicCertification: selectedSupplier.organicCertification ?? "",
      materials: (selectedSupplier.materials ?? []).join(", "),
      notes: selectedSupplier.notes ?? ""
    });
  }, [selectedSupplier]);

  async function handleCreate() {
    try {
      setError("");
      setStatus("");
      const created = await createAdminSupplier({
        name: form.name,
        country: form.country || undefined,
        organicCertification: form.organicCertification || undefined,
        materials: parseMaterials(form.materials),
        notes: form.notes || undefined
      });
      setSuppliers((current) => [...current, created]);
      setSelectedId(created.id);
      setStatus("Proveedor creado.");
      setForm(initialForm);
    } catch {
      setError("No se pudo crear el proveedor.");
    }
  }

  async function handleSave() {
    if (!selectedSupplier) return;
    try {
      setError("");
      setStatus("");
      const updated = await updateAdminSupplier(selectedSupplier.id, {
        name: form.name,
        country: form.country || undefined,
        organicCertification: form.organicCertification || undefined,
        materials: parseMaterials(form.materials),
        notes: form.notes || undefined
      });
      setSuppliers((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setStatus("Proveedor actualizado.");
    } catch {
      setError("No se pudo actualizar el proveedor.");
    }
  }

  return (
    <main className="px-5 py-12 md:px-8 lg:px-12">
      <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
            Admin / Proveedores
          </span>
          <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter text-inverse-surface md:text-7xl">
            Proveedores internos
          </h1>
        </div>
        <Link
          className="w-fit border border-inverse-surface px-6 py-3 text-[0.65rem] font-black uppercase tracking-[0.2em] hover:bg-inverse-surface hover:text-surface"
          to="/admin"
        >
          Volver al panel
        </Link>
      </header>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="border border-outline-variant/30 bg-white">
          <div className="flex items-end justify-between gap-4 border-b border-outline-variant/20 p-6">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">Lista</p>
              <h2 className="mt-2 font-headline text-2xl font-black uppercase tracking-tighter">
                Proveedores
              </h2>
            </div>
            <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-tertiary">
              {suppliers.length} total
            </span>
          </div>

          <div className="divide-y divide-outline-variant/20">
            {suppliers.map((supplier) => (
              <button
                key={supplier.id}
                className={`w-full px-6 py-5 text-left transition-colors hover:bg-[#f2f4f4] ${
                  supplier.id === selectedId ? "bg-[#f2f4f4]" : ""
                }`}
                onClick={() => setSelectedId(supplier.id)}
                type="button"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-tertiary">
                      {supplier.country ?? "Sin pais"}
                    </p>
                    <p className="mt-2 font-headline text-xl font-black uppercase tracking-tighter">
                      {supplier.name}
                    </p>
                    <p className="mt-2 text-sm text-on-surface-variant">
                      {supplier.organicCertification ?? "Sin certificacion"}
                    </p>
                    <p className="mt-2 text-sm text-on-surface-variant">
                      Materiales: {(supplier.materials ?? []).join(", ") || "Sin materiales"}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-on-surface-variant">{supplier.id}</p>
                </div>
              </button>
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
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="border border-outline/30 px-4 py-3 text-sm"
                  onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))}
                  placeholder="Pais"
                  value={form.country}
                />
                <input
                  className="border border-outline/30 px-4 py-3 text-sm"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, organicCertification: event.target.value }))
                  }
                  placeholder="Certificacion organica"
                  value={form.organicCertification}
                />
              </div>
              <input
                className="border border-outline/30 px-4 py-3 text-sm"
                onChange={(event) => setForm((current) => ({ ...current, materials: event.target.value }))}
                placeholder="Materiales (separados por coma)"
                value={form.materials}
              />
              <textarea
                className="min-h-[110px] border border-outline/30 px-4 py-3 text-sm"
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Notas internas"
                value={form.notes}
              />

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
                  disabled={!selectedSupplier}
                  onClick={handleSave}
                  type="button"
                >
                  Guardar
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

