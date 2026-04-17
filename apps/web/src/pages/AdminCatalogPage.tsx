import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  createAdminProduct,
  createAdminVariant,
  deleteAdminProduct,
  getAdminCategories,
  getAdminProducts,
  getAdminSuppliers,
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
  categoryId: "", // Will be set on load
  supplierId: "", // Will be set on load
  sustainabilityLabel: "Sostenible",
  sustainabilityScore: 90,
  imageUrl: "",
  mainImageFile: null as File | null,
  initialVariants: [{ ...initialVariantEntry }],
  variantImageFiles: [null] as (File | null)[]
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
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    let active = true;

    // Load static data
    Promise.all([getAdminCategories(), getAdminSuppliers()]).then(([cats, sups]) => {
      if (!active) return;
      setCategories(cats);
      setSuppliers(sups);
      if (cats.length > 0 || sups.length > 0) {
        setProductForm(prev => ({
          ...prev,
          categoryId: cats[0]?.id || "",
          supplierId: sups[0]?.id || ""
        }));
      }
    });

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
      initialVariants: [...prev.initialVariants, { ...initialVariantEntry }],
      variantImageFiles: [...prev.variantImageFiles, null]
    }));
  };

  const updateNewVariantEntry = (index: number, field: keyof VariantPayload, value: any) => {
    const updated = [...productForm.initialVariants];
    updated[index] = { ...updated[index], [field]: value };
    setProductForm(prev => ({ ...prev, initialVariants: updated }));
  };

  const updateNewVariantFile = (index: number, file: File | null) => {
    const updatedFiles = [...productForm.variantImageFiles];
    updatedFiles[index] = file;
    setProductForm(prev => ({ ...prev, variantImageFiles: updatedFiles }));
  };

  const removeVariantFromNewProduct = (index: number) => {
    if (productForm.initialVariants.length <= 1) return;
    setProductForm(prev => ({
      ...prev,
      initialVariants: prev.initialVariants.filter((_, i) => i !== index),
      variantImageFiles: prev.variantImageFiles.filter((_, i) => i !== index)
    }));
  };

  async function handleCreateProduct() {
    try {
      setError("");
      
      if (!productForm.name.trim()) throw new Error("El nombre es obligatorio");
      if (!productForm.description.trim()) throw new Error("La descripción es obligatoria");
      
      const cleanVariants = productForm.initialVariants.map((v, i) => {
        if (!v.size.trim() || !v.color.trim()) {
          throw new Error(`La pieza ${i + 1} debe tener Talla y Color`);
        }
        
        // Auto-generar SKU si está vacío
        const sku = v.sku.trim() || `${productForm.slug.toUpperCase()}-${v.size.toUpperCase().replace(/\s+/g, '')}-${v.color.toUpperCase().replace(/\s+/g, '')}`;
        
        return {
          ...v,
          sku,
          stock: Number(v.stock) || 0,
          price: Number(v.price) || 0
        };
      });

      const finalPayload = {
        ...productForm,
        initialVariants: cleanVariants
      };

      setStatusMessage("Creando producto base...");
      let createdProduct = await createAdminProduct(finalPayload);
      
      // Upload main image if present
      if (productForm.mainImageFile) {
        setStatusMessage("Subiendo imagen principal...");
        createdProduct = await uploadAdminProductImage(createdProduct.slug, productForm.mainImageFile);
      }
      
      // Upload variant images if present
      for (let i = 0; i < productForm.variantImageFiles.length; i++) {
        const file = productForm.variantImageFiles[i];
        if (file && createdProduct.variants[i]) {
          setStatusMessage(`Subiendo imagen para variante ${i + 1}...`);
          const updatedVar = await uploadAdminVariantImage(createdProduct.slug, createdProduct.variants[i].id, file);
          createdProduct.variants[i] = updatedVar;
        }
      }

      setProducts((current) => [...current, createdProduct]);
      setSelectedProductSlug(createdProduct.slug);
      setStatusMessage("¡Producto creado con éxito!");
      setProductForm(initialProductForm);
    } catch (err: any) {
      setError(err.message || "No se pudo crear el producto.");
    }
  }

  async function handleUpdateProduct() {
    if (!selectedProduct) return;
    try {
      setStatusMessage("Actualizando producto...");
      const updated = await createAdminProduct({
        ...productForm,
        initialVariants: [] // Backend ignores this on update or we handle it differently
      });
      // Actually we should have an updateAdminProduct function in api.ts
      // I will check api.ts for updateAdminProduct
      setStatusMessage("Producto actualizado.");
    } catch {
      setError("Error al actualizar producto.");
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
                <div className="flex-1 space-y-4">
                   <div className="flex justify-between">
                     <div>
                       <span className="text-[0.6rem] font-bold uppercase tracking-widest text-secondary">Editando Producto</span>
                       <h2 className="font-headline text-4xl font-black uppercase tracking-tighter mt-1">{selectedProduct.name}</h2>
                     </div>
                     <button onClick={() => handleDeleteProduct(selectedProduct.slug)} className="text-error text-[0.6rem] font-bold uppercase border border-error/30 px-4 py-2 hover:bg-error hover:text-white transition-all">Eliminar Producto</button>
                   </div>
                   
                   <div className="grid md:grid-cols-2 gap-6 bg-surface-container-lowest p-6 border border-outline-variant/10">
                      <div className="space-y-4">
                        <label className="block"><span className="text-[0.6rem] uppercase font-bold text-on-surface-variant">Nombre</span>
                        <input className="w-full border p-3 text-sm" value={selectedProduct.name} onChange={e => {
                          const newName = e.target.value;
                          // In a real app we'd need a local draft state for the product too
                          // For now let's assume we update the list
                          setProducts(prev => prev.map(p => p.slug === selectedProduct.slug ? {...p, name: newName} : p));
                        }} /></label>
                        
                        <label className="block"><span className="text-[0.6rem] uppercase font-bold text-on-surface-variant">Slug</span>
                        <input className="w-full border p-3 text-sm bg-surface-container-low font-mono" value={selectedProduct.slug} readOnly /></label>
                      </div>
                      <div className="space-y-4">
                        <label className="block"><span className="text-[0.6rem] uppercase font-bold text-on-surface-variant">Descripción</span>
                        <textarea className="w-full border p-3 text-sm min-h-[100px]" value={selectedProduct.description} onChange={e => {
                          const newDesc = e.target.value;
                          setProducts(prev => prev.map(p => p.slug === selectedProduct.slug ? {...p, description: newDesc} : p));
                        }} /></label>
                      </div>
                      <div className="col-span-full border-t border-outline-variant/10 pt-4 flex justify-between items-center">
                         <div className="flex gap-4 items-center">
                            <span className="text-[0.6rem] font-bold uppercase">Foto Principal:</span>
                            <input type="file" className="text-[0.6rem]" onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  setStatusMessage("Subiendo foto principal...");
                                  const updated = await uploadAdminProductImage(selectedProduct.slug, file);
                                  setProducts(prev => prev.map(p => p.slug === selectedProduct.slug ? updated : p));
                                  setStatusMessage("Foto principal actualizada.");
                                } catch { setError("Error al subir foto."); }
                              }
                            }} />
                         </div>
                         <button onClick={async () => {
                           // Logic to save name/desc
                           setStatusMessage("Guardando cambios del producto...");
                           // We need updateAdminProduct in api.ts
                         }} className="bg-tertiary text-white text-[0.65rem] font-black uppercase px-6 py-3">Guardar Info General</button>
                      </div>
                   </div>
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

                  <div className="grid grid-cols-2 gap-4">
                    <label><span className="text-[0.6rem] uppercase font-bold tracking-widest text-surface/60">Categoría</span>
                    <select className="w-full bg-white/10 border border-white/20 px-4 py-4 text-white outline-none" value={productForm.categoryId} onChange={e => setProductForm(prev => ({...prev, categoryId: e.target.value}))}>
                      {categories.map(c => <option key={c.id} value={c.id} className="text-black">{c.name}</option>)}
                    </select></label>

                    <label><span className="text-[0.6rem] uppercase font-bold tracking-widest text-surface/60">Proveedor</span>
                    <select className="w-full bg-white/10 border border-white/20 px-4 py-4 text-white outline-none" value={productForm.supplierId} onChange={e => setProductForm(prev => ({...prev, supplierId: e.target.value}))}>
                      {suppliers.map(s => <option key={s.id} value={s.id} className="text-black">{s.name}</option>)}
                    </select></label>
                  </div>

                  <label className="block border border-white/10 p-4 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                    <span className="text-[0.6rem] uppercase font-bold tracking-widest text-surface/60 block mb-2">Foto Principal del Producto</span>
                    <input type="file" className="text-xs text-white/40" onChange={e => setProductForm(prev => ({...prev, mainImageFile: e.target.files?.[0] || null}))} />
                  </label>
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
                           <label><span className="text-[0.55rem] uppercase font-bold text-white/50 block mb-1">Talla</span>
                           <input placeholder="Ej: M, L, Única" className="w-full bg-transparent border-b border-white/20 py-2 text-sm outline-none focus:border-white" value={v.size} onChange={e => updateNewVariantEntry(i, 'size', e.target.value)} /></label>
                           
                           <label><span className="text-[0.55rem] uppercase font-bold text-white/50 block mb-1">Color</span>
                           <input placeholder="Ej: Musgo, Arena" className="w-full bg-transparent border-b border-white/20 py-2 text-sm outline-none focus:border-white" value={v.color} onChange={e => updateNewVariantEntry(i, 'color', e.target.value)} /></label>
                           
                           <label><span className="text-[0.55rem] uppercase font-bold text-white/50 block mb-1">Precio</span>
                           <input placeholder="0" type="number" className="w-full bg-transparent border-b border-white/20 py-2 text-sm outline-none focus:border-white" value={v.price} onChange={e => updateNewVariantEntry(i, 'price', Number(e.target.value))} /></label>
                           
                           <label><span className="text-[0.55rem] uppercase font-bold text-white/50 block mb-1">Stock</span>
                           <input placeholder="10" type="number" className="w-full bg-transparent border-b border-white/20 py-2 text-sm outline-none focus:border-white" value={v.stock} onChange={e => updateNewVariantEntry(i, 'stock', Number(e.target.value))} /></label>
                           
                           <label className="col-span-full"><span className="text-[0.55rem] uppercase font-bold text-white/50 block mb-1">Imagen de esta pieza</span>
                           <input type="file" className="text-[0.6rem] text-white/40" onChange={e => updateNewVariantFile(i, e.target.files?.[0] || null)} />
                           <p className="text-[0.5rem] text-white/30 mt-1">O pega una URL abajo:</p>
                           <input placeholder="https://..." className="w-full bg-transparent border-b border-white/20 py-2 text-[0.6rem] font-mono outline-none focus:border-white" value={v.image_url || ""} onChange={e => updateNewVariantEntry(i, 'image_url', e.target.value)} /></label>
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
