export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  price: string;
  numericPrice: number;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
  sustainability: string;
  composition: string;
  featured?: boolean;
};

export const products: Product[] = [
  {
    slug: "tunica-ancestral-lino",
    name: "Túnica Ancestral Lino",
    subtitle: "Fibras Naturales Teñidas a Mano",
    price: "$3,450 MXN",
    numericPrice: 3450,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJogMYLMMxYnYjk0W2w_KPNCtfdPwAEEV7cGEoQzbTkU_5h4qFUE7-YBh-mj5SIfJpfSnHuhgWXDJOKOEGLMCjstokvm2wRhpmH4KVtpPpKFZkZVXE1sJAWQaaSU0IpFok8UbV_iW1bQXkRSz6MrVngVY2yUwicRKyTdeF4pA8te2hj3c_tkqTInjl4wev4wEFJ1dWFWqIaDAK_AHf_z2Fs0N9ifkfd7zCQz6Jqc1yPmToWkIZaaE4n9Ms01Qj8DovLqbHAWdggVxW",
    description:
      "Silueta amplia en lino premium con acabado lavado y teñido artesanal para una caída ligera y arquitectónica.",
    colors: ["Arena", "Musgo", "Terracota"],
    sizes: ["S", "M", "L"],
    sustainability: "Impacto bajo / teñido natural",
    composition: "100% lino premium"
  },
  {
    slug: "pantalon-canamo-estructural",
    name: "Pantalón Cáñamo Estructural",
    subtitle: "Sastrería suave de origen vegetal",
    price: "$2,800 MXN",
    numericPrice: 2800,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4wKsmj7XfxRflI-lufBdqS4Hw4c8HyXHSQoYY3CXLCBX4ao-MrS80T6caIhfgsW5uth4caozpRQiB40NLjkpX539gzLHiPXdhnPdd7hl9shrF8COh6YNz7ru1mU_1j-fLIG46852inT1JJJvoEBVdLltM3veAoXDaCQpgvUESH8tW1AjvLl3HfdJXvtF1F8vaa_OnZqUuCB_c1YpglLxdA7cAIgU1JSMNiKHbGaqnbZKVI8TO3qHIfKlrDQi6Q_uJqnmu2x1mWFao",
    description:
      "Pantalón de cáñamo con estructura relajada, cintura alta y construcción duradera para uso diario.",
    colors: ["Grafito", "Arcilla"],
    sizes: ["S", "M", "L", "XL"],
    sustainability: "Fibra regenerativa",
    composition: "70% cáñamo / 30% algodón orgánico"
  },
  {
    slug: "camisa-algodon-crudo",
    name: "Camisa Algodón Crudo",
    subtitle: "Básico refinado para capas ligeras",
    price: "$1,950 MXN",
    numericPrice: 1950,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwW-iYNnnJk3H_gKBAhSOgyF-eJOC3CAoUTtBCsaNszogI0zelCWnegauhpJT86SR_BUniJQgFz3hBO3aRjuX_dPYKVw1oI2qleOKEb5Dvr6gvFZ31tJoTS6_lYvSsyMw0PSDe5PqoPsTUBiu0JZam4IR-2gelYWJdonZ_GkgexSZZK349OYwPgFwl_6kGPQHrHagWzQMrVI2SsTfh46RgDRm-Ut2bcL5BbiuGYfLQVa2RlHIlYvk-9_jGSXaygEN--Ah0_dZeN6wi",
    description:
      "Camisa estructurada en algodón orgánico crudo con cuello limpio y textura visible de alta calidad.",
    colors: ["Crudo", "Marfil"],
    sizes: ["S", "M", "L"],
    sustainability: "Algodón orgánico certificado",
    composition: "100% algodón orgánico"
  },
  {
    slug: "chaleco-reciclado-sage",
    name: "Chaleco Reciclado Sage",
    subtitle: "Capa intermedia de lana reciclada",
    price: "$2,200 MXN",
    numericPrice: 2200,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSJHz0Lmeg_X-Av84FBb5V4A_wIBw_6mf1sXhdYsk6J0QQ-nIqmUlO0W4_I8aWVcvm--DpwNsVAeeauTDYsDtq-KDw-3kFIsE9oziMXvGI0rTWJG-Qjv9qX1KniN8iRLKf1ThrpjD4vDXPMbkB991ena888L9aKlJxUdGk88ojlYORc7VsBTkI5kR1LSsV-eVM-OyZEJDGfs1u3KUIAkSf0WikjTmRurPj-iLSwzxshQIZncfpn_TCKchKZSlhZFf2xjTHl60E33fl",
    description:
      "Chaleco sin mangas con cuerpo suave, color terroso y confección pensada para combinar capas.",
    colors: ["Sage", "Tierra"],
    sizes: ["M", "L"],
    sustainability: "Lana reciclada posconsumo",
    composition: "60% lana reciclada / 40% mezcla técnica"
  },
  {
    slug: "bolso-piel-de-nopal",
    name: "Bolso Piel de Nopal",
    subtitle: "Accesorio de lujo vegetal",
    price: "$4,100 MXN",
    numericPrice: 4100,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBiNcAO3AMrE8E_9CapoazVqP-B2tgnNA1KDZZcEcvPZWL6Jh23deB0_pRm7j2aUwQcW1tncj2Gz7tX5uBEgA91Go3POCUtK5ZJCzMKDNQsqA87E1GV9gn1p76cdztksp2-vQpTyIAiPMgGUToxz_iYvdvxag_56281vkddXnrKCj6SJk_P1iue3BoDh-bRxRYaiBVSm6S8SrZJB50MbT-WR1ZJ49JF6sETFX3LTXmy9uY3qzNfqn4Y3uuOqxFRQyKuEC0TeVL08ccT",
    description:
      "Bolso estructurado con acabado mate y herrajes discretos, hecho en material vegetal de nopal.",
    colors: ["Negro", "Tierra"],
    sizes: ["Única"],
    sustainability: "Alternativa vegetal al cuero",
    composition: "Piel de nopal / forro reciclado"
  },
  {
    slug: "tshirt-carbon-organico",
    name: "T-Shirt Carbón Orgánico",
    subtitle: "Básico esencial de gramaje alto",
    price: "$850 MXN",
    numericPrice: 850,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBUH_dwq0qEfeeYVeBm2Ap_EJLrrWkKyiZpkeM43MimlkCNZ-0n4LY1ymylHnI_lIlQ6XpG7oQSv8x1nXBMl5oIZU5vBLm05koaQe3tG8uFT37NXQgu-qZycsrhAbUFNjKL8WSayFPh8vGpGhbzJl1DDD19oEJZHMrk1XarO2fi-8DBLW62NQ6sBbjCkpP3gp5b1WN45N_CjIJj8FX7Eniu3CBAspmxgMLN-nkitfBGY55P9xlEGQqEhJhN1spH9_DwwN3b6cHMdqT",
    description:
      "Playera de algodón orgánico de tacto firme, cuello compacto y estética sobria para rotación permanente.",
    colors: ["Carbón", "Hueso"],
    sizes: ["S", "M", "L", "XL"],
    sustainability: "Básico durable / menor recambio",
    composition: "100% algodón orgánico"
  },
  {
    slug: "capa-lino-asimetrica",
    name: "Capa Lino Asimétrica",
    subtitle: "Volumen ligero para transición",
    price: "$2,900 MXN",
    numericPrice: 2900,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiOzmd3otopw6BGnoKDauOYvtEi46QhwAwVnnHrg84IKpcy8kbdn7FzuPyEtXCiKu3RESrnej9KUxAv3h5ivEdB-7y4Dbi4WwgOPmp18T6q8mUXPy1izX-wD9NORgJcW-CQYOO7qwJz7SOVu3df-g8bz_MkQWJOkND6a7pM4WZrZ1idpdt1gigN5x0ZPBcDZqRPwERABciiG_QOcJgCpLAneunBNK7sX5ke-XFP0eYSbIpr9ElE5mMrecepEd1u-4WhKNrCvzh_e5r",
    description:
      "Capa asimétrica de lino con vuelo suave y caída limpia para looks de transición entre estaciones.",
    colors: ["Bone", "Arena"],
    sizes: ["M", "L"],
    sustainability: "Lino de bajo impacto",
    composition: "100% lino lavado"
  }
];

export const cartItems = [
  { productSlug: "tunica-ancestral-lino", size: "M", color: "Musgo", quantity: 1 },
  { productSlug: "tshirt-carbon-organico", size: "L", color: "Carbón", quantity: 2 }
];

export const accountSummary = {
  name: "María Fernández",
  email: "maria@ecowear.mx",
  ecoPoints: 1280,
  tier: "VIP Tierra",
  nextReward: "20% de descuento en colección cápsula"
};

export const adminSummary = {
  lowStockVariants: 4,
  activePromotions: 3,
  ethicalSuppliers: 12,
  salesToday: "$18,540 MXN"
};

export const physicalStoreDraft = {
  storeName: "Flagship Polanco",
  seller: "Andrea Ruiz",
  saleChannel: "store",
  customerName: "Cliente mostrador",
  paymentMethod: "Tarjeta",
  loyaltyDocument: "maria@ecowear.mx"
};

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
