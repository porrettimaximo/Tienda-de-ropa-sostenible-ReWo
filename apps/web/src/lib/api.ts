import { config } from "../config";
import {
  accountSummary as mockAccountSummary,
  adminSummary as mockAdminSummary,
  getProductBySlug,
  products as mockProducts
} from "../data/store";

type ApiProductSummary = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price_from: number;
  sustainability_label?: string | null;
  available_colors: string[];
  available_sizes: string[];
};

type ApiProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sustainability_label?: string | null;
  sustainability_score?: number | null;
  variants: Array<{
    id: string;
    sku: string;
    size: string;
    color: string;
    stock: number;
    price: number;
  }>;
};

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(`${config.apiUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString("es-MX")} MXN`;
}

export async function getCatalogProducts() {
  try {
    const data = await requestJson<ApiProductSummary[]>("/products");
    return data.map((product) => ({
      slug: product.slug,
      name: product.name,
      subtitle: product.sustainability_label ?? product.category,
      price: formatCurrency(product.price_from),
      numericPrice: product.price_from,
      image: getProductBySlug(product.slug)?.image ?? mockProducts[0].image,
      description:
        getProductBySlug(product.slug)?.description ??
        "Pieza curada con materiales conscientes y trazabilidad editorial.",
      colors: product.available_colors,
      sizes: product.available_sizes,
      sustainability: product.sustainability_label ?? "Impacto consciente",
      composition: getProductBySlug(product.slug)?.composition ?? "Composición por definir"
    }));
  } catch {
    return mockProducts;
  }
}

export async function getCatalogProduct(slug: string) {
  try {
    const data = await requestJson<ApiProductDetail>(`/products/${slug}`);
    const fallback = getProductBySlug(slug);
    const prices = data.variants.map((variant) => variant.price);
    const firstPrice = prices[0] ?? fallback?.numericPrice ?? 0;

    return {
      slug: data.slug,
      name: data.name,
      subtitle: fallback?.subtitle ?? data.sustainability_label ?? "Colección permanente",
      price: formatCurrency(firstPrice),
      numericPrice: firstPrice,
      image: fallback?.image ?? mockProducts[0].image,
      description: data.description,
      colors: [...new Set(data.variants.map((variant) => variant.color))],
      sizes: [...new Set(data.variants.map((variant) => variant.size))],
      sustainability:
        fallback?.sustainability ??
        data.sustainability_label ??
        `Score ${data.sustainability_score ?? 0}`,
      composition: fallback?.composition ?? "Composición por definir"
    };
  } catch {
    return getProductBySlug(slug);
  }
}

export async function getCustomerAccount() {
  try {
    const data = await requestJson<{
      id: string;
      full_name: string;
      email?: string | null;
      loyalty_points: number;
    }>("/loyalty/customers/cus-maria-fernandez");

    return {
      ...mockAccountSummary,
      name: data.full_name,
      email: data.email ?? mockAccountSummary.email,
      ecoPoints: data.loyalty_points
    };
  } catch {
    return mockAccountSummary;
  }
}

export async function getAdminSummary() {
  try {
    const report = await requestJson<
      Array<{
        size: string;
        color: string;
        sales_channel: string;
        total_units: number;
        total_revenue: number;
      }>
    >("/reports/sales-by-size-color");

    return {
      ...mockAdminSummary,
      lowStockVariants: report.length,
      salesToday: formatCurrency(
        report.reduce((sum, item) => sum + Number(item.total_revenue ?? 0), 0)
      )
    };
  } catch {
    return mockAdminSummary;
  }
}

export async function signInClient(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Completa email y contraseña");
  }
  return { role: "client" as const };
}

export async function signInAdmin(username: string, password: string) {
  if (!username || !password) {
    throw new Error("Completa usuario y contraseña");
  }
  return { role: "admin" as const };
}
