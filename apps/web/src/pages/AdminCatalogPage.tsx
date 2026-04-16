import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  createAdminProduct,
  createAdminVariant,
  getAdminProducts,
  updateAdminVariant,
  type AdminProduct,
  type CatalogVariant
} from "../lib/api";

const initialProductForm = {
  name: "",
  slug: "",
  description: "",
  categoryId: "cat-permanent",
  supplierId: "sup-oaxaca",
  sustainabilityLabel: "",
  sustainabilityScore: 90
};

const initialVariantForm = {
  sku: "",
  size: "",
  color: "",
  stock: 0,
  price: 0
};

export function AdminCatalogPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [selectedProductSlug, setSelectedProductSlug] = useState("");
  const [productForm, setProductForm] = useState(initialProductForm);
  const [variantForms, setVariantForms] = useState<Record<string, CatalogVariant>>({});
  const [newVariantForm, setNewVariantForm] = useState(initialVariantForm);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getAdminProducts().then((data) => {
      if (!active) return;
      setProducts(data);
      setSelectedProductSlug(data[0]?.slug ?? "");
      setVariantForms(
        Object.fromEntries(
          data.flatMap((product) =>
            product.variants.map((variant) => [variant.id, { ...variant }])
          )
        )
      );
    });

    return () => {
      active = false;
    };
  }, []);

  const selectedProduct = products.find((product) => product.slug === selectedProductSlug) ?? products[0];

  async function handleCreateProduct() {
    try {
      setError("");
      setStatusMessage("");
      const createdProduct = await createAdminProduct(productForm);
      setProducts((current) => [...current, createdProduct]);
      setSelectedProductSlug(createdProduct.slug);
      setStatusMessage("Producto creado correctamente.");
      setProductForm(initialProductForm);
    } catch {
      setError("No se pudo crear el producto. Verifica slug, categoria y backend.");
    }
  }

  async function handleUpdateVariant(productSlug: string, variant: CatalogVariant) {
    try {
      setError("");
      setStatusMessage("");
      const updated = await updateAdminVariant(productSlug, variant.id, {
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        stock: variant.stock,
        price: variant.price
      });

      setProducts((current) =>
        current.map((product) =>
          product.slug === productSlug
            ? (() => {
                const updatedVariants = product.variants.map((entry) =>
                  entry.id === updated.id ? updated : entry
                );
                return {
                  ...product,
                  variants: updatedVariants,
                  colors: [...new Set(updatedVariants.map((entry) => entry.color))],
                  sizes: [...new Set(updatedVariants.map((entry) => entry.size))]
                };
              })()
            : product
        )
      );
      setVariantForms((current) => ({ ...current, [variant.id]: updated }));
      setStatusMessage("Variante actualizada correctamente.");
    } catch {
      setError("No se pudo actualizar la variante.");
    }
  }

  async function handleCreateVariant() {
    if (!selectedProduct) return;

    try {
      setError("");
      setStatusMessage("");
      const createdVariant = await createAdminVariant(selectedProduct.slug, newVariantForm);

      setProducts((current) =>
        current.map((product) =>
          product.slug === selectedProduct.slug
            ? {
                ...product,
                variants: [...product.variants, createdVariant],
                colors: [...new Set([...product.colors, createdVariant.color])],
                sizes: [...new Set([...product.sizes, createdVariant.size])]
              }
            : product
        )
      );

      setVariantForms((current) => ({ ...current, [createdVariant.id]: createdVariant }));
      setNewVariantForm(initialVariantForm);
      setStatusMessage("Variante creada correctamente.");
    } catch {
      setError("No se pudo crear la variante.");
    }
  }

  return (
    <main className="px-5 py-12 md:px-8 lg:px-12">
      <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">
            Admin / Catalogo
          </span>
          <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter text-inverse-surface md:text-7xl">
            Productos y variantes
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
            to="/collections"
          >
            Ver tienda
          </Link>
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="overflow-x-auto border border-outline-variant/30">
            <table className="min-w-full border-collapse">
              <thead className="bg-[#f2f4f4]">
                <tr className="text-left text-[0.65rem] uppercase tracking-[0.25em] text-on-surface-variant">
                  <th className="px-6 py-5">Producto</th>
                  <th className="px-6 py-5">Categoria</th>
                  <th className="px-6 py-5">Variantes</th>
                  <th className="px-6 py-5">Precio base</th>
                  <th className="px-6 py-5">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.slug} className="border-t border-outline-variant/20 align-top">
                    <td className="px-6 py-6">
                      <p className="font-headline text-lg font-black uppercase tracking-tighter">
                        {product.name}
                      </p>
                      <p className="mt-2 text-sm text-on-surface-variant">{product.subtitle}</p>
                    </td>
                    <td className="px-6 py-6 text-sm">{product.category}</td>
                    <td className="px-6 py-6 text-sm">{product.variants.length}</td>
                    <td className="px-6 py-6 text-sm font-bold">{product.priceLabel}</td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-3 text-[0.65rem] font-black uppercase tracking-[0.2em]">
                        <button
                          className="text-left underline underline-offset-4 hover:text-secondary"
                          onClick={() => setSelectedProductSlug(product.slug)}
                          type="button"
                        >
                          Gestionar
                        </button>
                        <Link
                          className="underline underline-offset-4 hover:text-secondary"
                          to={`/products/${product.slug}`}
                        >
                          Ver en tienda
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedProduct ? (
            <div className="border border-outline-variant/30 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-tertiary">
                    Variantes activas
                  </p>
                  <h2 className="mt-3 font-headline text-3xl font-black uppercase tracking-tighter">
                    {selectedProduct.name}
                  </h2>
                </div>
                <select
                  className="border border-outline/30 bg-surface px-4 py-3 text-sm outline-none focus:border-inverse-surface"
                  onChange={(event) => setSelectedProductSlug(event.target.value)}
                  value={selectedProduct.slug}
                >
                  {products.map((product) => (
                    <option key={product.slug} value={product.slug}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-8 space-y-5">
                {selectedProduct.variants.map((variant) => {
                  const draft = variantForms[variant.id] ?? variant;

                  return (
                    <article key={variant.id} className="border border-outline-variant/20 p-5">
                      <div className="grid gap-4 md:grid-cols-5">
                        <input
                          className="border border-outline/30 px-4 py-3 text-sm"
                          onChange={(event) =>
                            setVariantForms((current) => ({
                              ...current,
                              [variant.id]: { ...draft, sku: event.target.value }
                            }))
                          }
                          value={draft.sku}
                        />
                        <input
                          className="border border-outline/30 px-4 py-3 text-sm"
                          onChange={(event) =>
                            setVariantForms((current) => ({
                              ...current,
                              [variant.id]: { ...draft, size: event.target.value }
                            }))
                          }
                          value={draft.size}
                        />
                        <input
                          className="border border-outline/30 px-4 py-3 text-sm"
                          onChange={(event) =>
                            setVariantForms((current) => ({
                              ...current,
                              [variant.id]: { ...draft, color: event.target.value }
                            }))
                          }
                          value={draft.color}
                        />
                        <input
                          className="border border-outline/30 px-4 py-3 text-sm"
                          min={0}
                          onChange={(event) =>
                            setVariantForms((current) => ({
                              ...current,
                              [variant.id]: { ...draft, stock: Number(event.target.value) || 0 }
                            }))
                          }
                          type="number"
                          value={draft.stock}
                        />
                        <input
                          className="border border-outline/30 px-4 py-3 text-sm"
                          min={0}
                          onChange={(event) =>
                            setVariantForms((current) => ({
                              ...current,
                              [variant.id]: { ...draft, price: Number(event.target.value) || 0 }
                            }))
                          }
                          type="number"
                          value={draft.price}
                        />
                      </div>
                      <div className="mt-4 flex justify-between gap-4">
                        <p className="text-sm text-on-surface-variant">
                          {draft.color} / {draft.size} / {draft.priceLabel}
                        </p>
                        <button
                          className="bg-inverse-surface px-5 py-3 text-[0.65rem] font-black uppercase tracking-[0.2em] text-surface hover:bg-secondary"
                          onClick={() => handleUpdateVariant(selectedProduct.slug, draft)}
                          type="button"
                        >
                          Guardar variante
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}
        </section>

        <aside className="space-y-6">
          <section className="border border-outline-variant/30 bg-[#f2f4f4] p-6">
            <p className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-tertiary">
              Nuevo producto
            </p>
            <div className="mt-6 grid gap-4">
              <input
                className="border border-outline/30 px-4 py-3 text-sm"
                onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Nombre"
                value={productForm.name}
              />
              <input
                className="border border-outline/30 px-4 py-3 text-sm"
                onChange={(event) => setProductForm((current) => ({ ...current, slug: event.target.value }))}
                placeholder="Slug"
                value={productForm.slug}
              />
              <textarea
                className="min-h-[120px] border border-outline/30 px-4 py-3 text-sm"
                onChange={(event) =>
                  setProductForm((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Descripcion"
                value={productForm.description}
              />
              <select
                className="border border-outline/30 px-4 py-3 text-sm"
                onChange={(event) =>
                  setProductForm((current) => ({ ...current, categoryId: event.target.value }))
                }
                value={productForm.categoryId}
              >
                <option value="cat-permanent">Coleccion permanente</option>
                <option value="cat-accessories">Accesorios</option>
              </select>
              <select
                className="border border-outline/30 px-4 py-3 text-sm"
                onChange={(event) =>
                  setProductForm((current) => ({ ...current, supplierId: event.target.value }))
                }
                value={productForm.supplierId}
              >
                <option value="sup-oaxaca">Comunidades Oaxaquenas</option>
                <option value="sup-biotech">Bio-Tech Queretaro</option>
              </select>
              <input
                className="border border-outline/30 px-4 py-3 text-sm"
                onChange={(event) =>
                  setProductForm((current) => ({
                    ...current,
                    sustainabilityLabel: event.target.value
                  }))
                }
                placeholder="Etiqueta de sostenibilidad"
                value={productForm.sustainabilityLabel}
              />
              <input
                className="border border-outline/30 px-4 py-3 text-sm"
                max={100}
                min={0}
                onChange={(event) =>
                  setProductForm((current) => ({
                    ...current,
                    sustainabilityScore: Number(event.target.value) || 0
                  }))
                }
                type="number"
                value={productForm.sustainabilityScore}
              />
              <button
                className="bg-inverse-surface px-6 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] text-surface hover:bg-secondary"
                onClick={handleCreateProduct}
                type="button"
              >
                Crear producto
              </button>
            </div>
          </section>

          {selectedProduct ? (
            <section className="border border-outline-variant/30 p-6">
              <p className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-tertiary">
                Nueva variante
              </p>
              <div className="mt-6 grid gap-4">
                <input
                  className="border border-outline/30 px-4 py-3 text-sm"
                  onChange={(event) =>
                    setNewVariantForm((current) => ({ ...current, sku: event.target.value }))
                  }
                  placeholder="SKU"
                  value={newVariantForm.sku}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className="border border-outline/30 px-4 py-3 text-sm"
                    onChange={(event) =>
                      setNewVariantForm((current) => ({ ...current, size: event.target.value }))
                    }
                    placeholder="Talla"
                    value={newVariantForm.size}
                  />
                  <input
                    className="border border-outline/30 px-4 py-3 text-sm"
                    onChange={(event) =>
                      setNewVariantForm((current) => ({ ...current, color: event.target.value }))
                    }
                    placeholder="Color"
                    value={newVariantForm.color}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className="border border-outline/30 px-4 py-3 text-sm"
                    min={0}
                    onChange={(event) =>
                      setNewVariantForm((current) => ({
                        ...current,
                        stock: Number(event.target.value) || 0
                      }))
                    }
                    placeholder="Stock"
                    type="number"
                    value={newVariantForm.stock}
                  />
                  <input
                    className="border border-outline/30 px-4 py-3 text-sm"
                    min={0}
                    onChange={(event) =>
                      setNewVariantForm((current) => ({
                        ...current,
                        price: Number(event.target.value) || 0
                      }))
                    }
                    placeholder="Precio"
                    type="number"
                    value={newVariantForm.price}
                  />
                </div>
                <button
                  className="border border-inverse-surface px-6 py-4 text-[0.7rem] font-black uppercase tracking-[0.25em] hover:bg-inverse-surface hover:text-surface"
                  onClick={handleCreateVariant}
                  type="button"
                >
                  Crear variante
                </button>
              </div>
            </section>
          ) : null}

          {statusMessage ? <p className="text-sm text-secondary">{statusMessage}</p> : null}
          {error ? <p className="text-sm text-error">{error}</p> : null}
        </aside>
      </div>
    </main>
  );
}
