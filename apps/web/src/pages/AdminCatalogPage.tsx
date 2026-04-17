import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  createAdminProduct,
  createAdminVariant,
  deleteAdminProduct,
  getAdminProducts,
  updateAdminProductImage,
  uploadAdminProductImage,
  updateAdminVariant,
  uploadAdminVariantImage,
  type AdminProduct,
  type CatalogVariant,
  type VariantPayload
} from "../lib/api";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

const initialVariantEntry: VariantPayload = {
  sku: "",
  size: "",
  color: "",
  stock: 10,
  price: 0,
  image_url: ""
};

const initialProductForm = {
  name: "",
  slug: "",
  description: "",
  categoryId: "cat-permanent",
  supplierId: "sup-oaxaca",
  sustainabilityLabel: "Sostenible",
  sustainabilityScore: 90,
  imageUrl: "",
  initialVariants: [{ ...initialVariantEntry }]
};

const initialVariantForm = {
  sku: "",
  size: "",
  color: "",
  stock: 0,
  price: 0,
  image_url: ""
};

export function AdminCatalogPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [selectedProductSlug, setSelectedProductSlug] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [productForm, setProductForm] = useState(initialProductForm);
  const [variantForms, setVariantForms] = useState<Record<string, CatalogVariant>>({});
  const [newVariantForm, setNewVariantForm] = useState(initialVariantForm);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    let active = true;
    getAdminProducts()
      .then((data) => {
        if (!active) return;
        setProducts(data);
        if (data.length > 0) setSelectedProductSlug(data[0].slug);
        setVariantForms(
          Object.fromEntries(
            data.flatMap((product) =>
              product.variants.map((variant) => [variant.id, { ...variant }])
            )
          )
        );
      })
      .catch((error) => {
        if (!active) return;
        setError(error instanceof Error ? error.message : "Error al cargar productos");
      });
    return () => { active = false; };
  }, []);

  const selectedProduct = products.find((product) => product.slug === selectedProductSlug);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNameChange = (name: string) => {
    setProductForm(prev => ({
      ...prev,
      name,
      slug: slugify(name)
    }));
  };

  const addVariantToNewProduct = () => {
    setProductForm(prev => ({
      ...prev,
      initialVariants: [...prev.initialVariants, { ...initialVariantEntry }]
    }));
  };

  const updateNewVariantEntry = (index: number, field: keyof VariantPayload, value: any) => {
    const updated = [...productForm.initialVariants];
    updated[index] = { ...updated[index], [field]: value };
    setProductForm(prev => ({ ...prev, initialVariants: updated }));
  };

  const removeVariantFromNewProduct = (index: number) => {
    if (productForm.initialVariants.length <= 1) return;
    setProductForm(prev => ({
      ...prev,
      initialVariants: prev.initialVariants.filter((_, i) => i !== index)
    }));
  };

  async function handleCreateProduct() {
    try {
      setError("");
      setStatusMessage("Creando producto y variantes...");
      const createdProduct = await createAdminProduct(productForm);
      setProducts((current) => [...current, createdProduct]);
      setSelectedProductSlug(createdProduct.slug);
      setStatusMessage("Producto creado correctamente con sus variantes.");
      setProductForm(initialProductForm);
    } catch (err: any) {
      setError(err.message || "No se pudo crear el producto.");
    }
  }

  async function handleDeleteProduct(slug: string) {
    if (!confirm("¿Eliminar este producto y todas sus variantes?")) return;
    try {
      await deleteAdminProduct(slug);
      setProducts((current) => current.filter((p) => p.slug !== slug));
      if (selectedProductSlug === slug) setSelectedProductSlug("");
      setStatusMessage("Producto eliminado.");
    } catch {
      setError("No se pudo eliminar.");
    }
  }

  async function handleUpdateVariant(productSlug: string, variant: CatalogVariant) {
    try {
      const updated = await updateAdminVariant(productSlug, variant.id, {
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        stock: variant.stock,
        price: variant.price,
        image_url: variant.image_url
      });
      setProducts((current) =>
        current.map((p) =>
          p.slug === productSlug
            ? { ...p, variants: p.variants.map((v) => (v.id === updated.id ? updated : v)) }
            : p
        )
      );
      setStatusMessage("Variante actualizada.");
    } catch {
      setError("Error al actualizar variante.");
    }
  }

  async function handleCreateVariant() {
    if (!selectedProduct) return;
    try {
      const created = await createAdminVariant(selectedProduct.slug, newVariantForm);
      setProducts((current) =>
        current.map((p) =>
          p.slug === selectedProduct.slug ? { ...p, variants: [...p.variants, created] } : p
        )
      );
      setNewVariantForm(initialVariantForm);
      setStatusMessage("Variante añadida.");
    } catch {
      setError("Error al crear variante.");
    }
  }

  async function handleUploadVariantImage(variantId: string, file: File) {
    if (!selectedProduct) return;
    try {
      setStatusMessage("Subiendo imagen...");
      const updatedVariant = await uploadAdminVariantImage(selectedProduct.slug, variantId, file);
      
      setProducts((current) =>
        current.map((p) =>
          p.slug === selectedProduct.slug
            ? { ...p, variants: p.variants.map((v) => (v.id === variantId ? updatedVariant : v)) }
            : p
        )
      );
      
      setVariantForms((prev) => ({
        ...prev,
        [variantId]: { ...prev[variantId], image_url: updatedVariant.image_url }
      }));
      
      setStatusMessage("Imagen subida correctamente.");
    } catch (err) {
      setError("Error al subir la imagen.");
    }
  }

  return (
    <main className="px-5 py-12 md:px-8 lg:px-12 bg-surface">
      <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-outline-variant/30 pb-8">
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-tertiary">Admin / Inventario</span>
          <h1 className="mt-4 font-headline text-5xl font-black uppercase tracking-tighter text-inverse-surface">Catálogo Maestro</h1>
        </div>
        <div className="flex gap-4">
          <Link className="border border-inverse-surface px-6 py-3 text-[0.65rem] font-black uppercase tracking-[0.2em] hover:bg-inverse-surface hover:text-surface" to="/admin">Panel</Link>
          <Link className="bg-inverse-surface px-6 py-3 text-[0.65rem] font-black uppercase tracking-[0.2em] text-surface hover:bg-secondary" to="/collections">Ver Tienda</Link>
        </div>
      </header>

      <div className="grid gap-12 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-8">
          {/* Listado de Productos */}
          <div className="border border-outline-variant/30 bg-white shadow-sm overflow-hidden">
             <div className="p-4 bg-surface-container-low border-b border-outline-variant/30">
               <input
                 className="w-full bg-white border border-outline/30 px-4 py-3 text-sm focus:border-inverse-surface outline-none"
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Buscar producto..."
                 type="text"
                 value={searchTerm}
               />
             </div>
             <div className="max-h-[500px] overflow-y-auto">
               <table className="w-full text-left">
                 <thead className="bg-[#f2f4f4] text-[0.6rem] uppercase tracking-widest text-on-surface-variant sticky top-0">
                   <tr>
                     <th className="px-6 py-4">Producto</th>
                     <th className="px-6 py-4">Categoría</th>
                     <th className="px-6 py-4 text-center">Variantes</th>
                     <th className="px-6 py-4">Acciones</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-outline-variant/10">
                   {filteredProducts.map((p) => (
                     <tr key={p.slug} className={`hover:bg-surface-container-lowest transition-colors ${selectedProductSlug === p.slug ? 'bg-secondary-container/10' : ''}`}>
                       <td className="px-6 py-5">
                         <span className="block font-headline font-black uppercase tracking-tight">{p.name}</span>
                         <span className="text-[0.65rem] text-on-surface-variant font-mono">{p.slug}</span>
                       </td>
                       <td className="px-6 py-5 text-sm">{p.category}</td>
                       <td className="px-6 py-5 text-sm text-center font-bold">{p.variants.length}</td>
                       <td className="px-6 py-5">
                         <div className="flex gap-4 text-[0.6rem] font-black uppercase">
                           <button onClick={() => setSelectedProductSlug(p.slug)} className="text-tertiary hover:underline">Gestionar</button>
                           <button onClick={() => handleDeleteProduct(p.slug)} className="text-error hover:underline">Borrar</button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>

          {/* Gestion de Variantes */}
          {selectedProduct && (
            <div className="border border-outline-variant/30 bg-white p-8 space-y-8">
              <div className="flex justify-between items-start border-b border-outline-variant/30 pb-6">
                <div>
                   <span className="text-[0.6rem] font-bold uppercase tracking-widest text-secondary">Editando Producto</span>
                   <h2 className="font-headline text-4xl font-black uppercase tracking-tighter mt-1">{selectedProduct.name}</h2>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest border-l-4 border-inverse-surface pl-3">Variantes Activas</h3>
                <div className="grid gap-4">
                  {selectedProduct.variants.map((v) => {
                    const draft = variantForms[v.id] ?? v;
                    return (
                      <div key={v.id} className="border border-outline-variant/20 p-6 bg-surface-container-lowest grid md:grid-cols-[1fr_auto] gap-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <label className="col-span-2 md:col-span-1"><span className="text-[0.55rem] uppercase block mb-1">SKU</span><input className="w-full border p-2 text-xs" value={draft.sku} onChange={e => setVariantForms(prev => ({...prev, [v.id]: {...draft, sku: e.target.value}}))} /></label>
                          <label><span className="text-[0.55rem] uppercase block mb-1">Talla</span><input className="w-full border p-2 text-xs" value={draft.size} onChange={e => setVariantForms(prev => ({...prev, [v.id]: {...draft, size: e.target.value}}))} /></label>
                          <label><span className="text-[0.55rem] uppercase block mb-1">Color</span><input className="w-full border p-2 text-xs" value={draft.color} onChange={e => setVariantForms(prev => ({...prev, [v.id]: {...draft, color: e.target.value}}))} /></label>
                          <label><span className="text-[0.55rem] uppercase block mb-1">Stock</span><input type="number" className="w-full border p-2 text-xs" value={draft.stock} onChange={e => setVariantForms(prev => ({...prev, [v.id]: {...draft, stock: Number(e.target.value)}}))} /></label>
                          <label><span className="text-[0.55rem] uppercase block mb-1">Precio</span><input type="number" className="w-full border p-2 text-xs" value={draft.price} onChange={e => setVariantForms(prev => ({...prev, [v.id]: {...draft, price: Number(e.target.value)}}))} /></label>
                          <label className="col-span-full"><span className="text-[0.55rem] uppercase block mb-1">Imagen de la pieza</span>
                            <div className="flex gap-4 items-center">
                              <div className="w-16 h-20 bg-surface-container-low border border-outline-variant/30 flex-shrink-0 overflow-hidden">
                                {draft.image_url ? (
                                  <img src={draft.image_url} alt="Vista" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[0.5rem] text-on-surface-variant/40">Sin foto</div>
                                )}
                              </div>
                              <div className="flex-1 space-y-2">
                                <input className="w-full border p-2 text-[0.65rem] font-mono" placeholder="URL de imagen..." value={draft.image_url || ""} onChange={e => setVariantForms(prev => ({...prev, [v.id]: {...draft, image_url: e.target.value}}))} />
                                <div className="flex items-center gap-2">
                                  <span className="text-[0.6rem] text-on-surface-variant font-bold uppercase">O subir archivo:</span>
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    className="text-[0.6rem]" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleUploadVariantImage(v.id, file);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </label>
                        </div>
                        <div className="flex flex-col justify-end">
                           <button onClick={() => handleUpdateVariant(selectedProduct.slug, draft)} className="bg-inverse-surface text-surface text-[0.6rem] font-bold uppercase px-4 py-3 hover:bg-secondary transition-colors">Guardar Datos</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Formulario Creación */}
        <aside className="space-y-8">
          <section className="bg-inverse-surface text-surface p-10 shadow-xl">
             <h2 className="font-headline text-3xl font-black uppercase tracking-tighter mb-8">Nuevo Producto Maestro</h2>
             <div className="space-y-6">
                <div className="grid gap-4">
                  <label><span className="text-[0.6rem] uppercase font-bold tracking-widest text-surface/60">Nombre del producto</span>
                  <input className="w-full bg-white/10 border border-white/20 px-4 py-4 text-white outline-none focus:border-white transition-colors" value={productForm.name} onChange={e => handleNameChange(e.target.value)} /></label>
                  
                  <label><span className="text-[0.6rem] uppercase font-bold tracking-widest text-surface/60">Slug (URL amigable)</span>
                  <input className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white/50 text-xs font-mono outline-none" value={productForm.slug} readOnly /></label>
                  
                  <label><span className="text-[0.6rem] uppercase font-bold tracking-widest text-surface/60">Descripción técnica</span>
                  <textarea className="w-full bg-white/10 border border-white/20 px-4 py-4 text-white min-h-[100px]" value={productForm.description} onChange={e => setProductForm(prev => ({...prev, description: e.target.value}))}></textarea></label>
                </div>

                <div className="border-t border-white/10 pt-8 mt-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-black uppercase tracking-widest">Configurar Variantes Iniciales</h3>
                    <button onClick={addVariantToNewProduct} className="text-[0.6rem] bg-white text-inverse-surface px-4 py-2 font-black uppercase hover:bg-secondary hover:text-white transition-colors">+ Añadir Pieza</button>
                  </div>
                  
                  <div className="space-y-4">
                    {productForm.initialVariants.map((v, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 p-6 relative group">
                        <button onClick={() => removeVariantFromNewProduct(i)} className="absolute -top-2 -right-2 bg-error text-white w-6 h-6 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">X</button>
                        <div className="grid grid-cols-2 gap-4">
                           <input placeholder="Talla" className="bg-transparent border-b border-white/20 py-2 text-sm outline-none focus:border-white" value={v.size} onChange={e => updateNewVariantEntry(i, 'size', e.target.value)} />
                           <input placeholder="Color" className="bg-transparent border-b border-white/20 py-2 text-sm outline-none focus:border-white" value={v.color} onChange={e => updateNewVariantEntry(i, 'color', e.target.value)} />
                           <input placeholder="Precio" type="number" className="bg-transparent border-b border-white/20 py-2 text-sm outline-none focus:border-white" value={v.price} onChange={e => updateNewVariantEntry(i, 'price', Number(e.target.value))} />
                           <input placeholder="Stock" type="number" className="bg-transparent border-b border-white/20 py-2 text-sm outline-none focus:border-white" value={v.stock} onChange={e => updateNewVariantEntry(i, 'stock', Number(e.target.value))} />
                           <input placeholder="URL Imagen de esta pieza" className="col-span-full bg-transparent border-b border-white/20 py-2 text-xs font-mono outline-none focus:border-white" value={v.image_url || ""} onChange={e => updateNewVariantEntry(i, 'image_url', e.target.value)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={handleCreateProduct} className="w-full bg-secondary hover:bg-tertiary text-white py-5 font-black uppercase tracking-[0.3em] transition-all text-sm mt-8">Finalizar y Publicar Producto</button>
             </div>
          </section>

          {statusMessage && <div className="p-4 bg-secondary/10 border border-secondary text-secondary text-xs font-bold uppercase text-center">{statusMessage}</div>}
          {error && <div className="p-4 bg-error/10 border border-error text-error text-xs font-bold uppercase text-center">{error}</div>}
        </aside>
      </div>
    </main>
  );
}
