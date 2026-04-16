import { config } from "../config";
import {
  accountSummary as mockAccountSummary,
  adminSummary as mockAdminSummary,
  getProductBySlug,
  products as mockProducts,
  type Product as MockProduct
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
  category: {
    id: string;
    name: string;
    slug: string;
  };
  supplier?: {
    id: string;
    name: string;
    ethical_certification?: string | null;
    country?: string | null;
  } | null;
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

type ApiAccountSummary = {
  id: string;
  full_name: string;
  email?: string | null;
  loyalty_points: number;
};

type ApiOrderSummary = {
  id: string;
  sales_channel: "online" | "store";
  customer_id?: string | null;
  customer_name?: string | null;
  subtotal: number;
  total: number;
  loyalty_points_earned: number;
  payment_method?: string | null;
  notes?: string | null;
  items: Array<{
    product_slug: string;
    product_name: string;
    variant_id: string;
    size: string;
    color: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }>;
};

type ApiOverview = {
  overview: {
    low_stock_variants: number;
    active_promotions: number;
    ethical_suppliers: number;
    sales_total: number;
  };
};

type ApiSalesReportRow = {
  size: string;
  color: string;
  sales_channel: "online" | "store";
  total_units: number;
  total_revenue: number;
};

type ApiCheckoutResponse = {
  order: {
    id: string;
    sales_channel: "online" | "store";
    customer_id?: string | null;
    customer_name?: string | null;
    subtotal: number;
    total: number;
    loyalty_points_earned: number;
    payment_method?: string | null;
    notes?: string | null;
    items: Array<{
      product_slug: string;
      product_name: string;
      variant_id: string;
      size: string;
      color: string;
      quantity: number;
      unit_price: number;
      line_total: number;
    }>;
  };
};

type ProductPayload = {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  supplierId?: string;
  sustainabilityLabel?: string;
  sustainabilityScore?: number;
};

type VariantPayload = {
  sku: string;
  size: string;
  color: string;
  stock: number;
  price: number;
};

export type CatalogVariant = {
  id: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  priceLabel: string;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  priceLabel: string;
  numericPrice: number;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
  sustainability: string;
  composition: string;
  category: string;
  supplierName?: string;
  sustainabilityScore?: number | null;
  variants: CatalogVariant[];
};

export type CheckoutItemInput = {
  productSlug: string;
  variantId: string;
  quantity: number;
};

export type CheckoutInput = {
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  paymentMethod?: string;
  notes?: string;
  items: CheckoutItemInput[];
};

export type CheckoutResult = ApiCheckoutResponse["order"];

export type AdminProduct = CatalogProduct;

export type SalesReportRow = {
  size: string;
  color: string;
  channel: "online" | "store";
  units: number;
  revenue: number;
  revenueLabel: string;
};

export type CustomerOrder = {
  id: string;
  channel: "online" | "store";
  total: number;
  totalLabel: string;
  loyaltyPoints: number;
  paymentMethod?: string | null;
  notes?: string | null;
  items: Array<{
    productSlug: string;
    productName: string;
    size: string;
    color: string;
    quantity: number;
    lineTotal: number;
    lineTotalLabel: string;
  }>;
};

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${config.apiUrl}${path}`, init);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString("es-MX")} MXN`;
}

function buildMockVariants(product: MockProduct): CatalogVariant[] {
  const colors = product.colors.length > 0 ? product.colors : ["Base"];
  const sizes = product.sizes.length > 0 ? product.sizes : ["Unica"];
  const variants: CatalogVariant[] = [];

  sizes.forEach((size, sizeIndex) => {
    const color = colors[sizeIndex % colors.length];
    variants.push({
      id: `${product.slug}-${size.toLowerCase()}-${color.toLowerCase().replace(/\s+/g, "-")}`,
      sku: `${product.slug.toUpperCase()}-${size.toUpperCase()}`,
      size,
      color,
      stock: Math.max(2, 10 - sizeIndex * 2),
      price: product.numericPrice,
      priceLabel: product.price
    });
  });

  return variants;
}

function getFallbackCatalogProduct(product: MockProduct): CatalogProduct {
  return {
    id: product.slug,
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle,
    priceLabel: product.price,
    numericPrice: product.numericPrice,
    image: product.image,
    description: product.description,
    colors: product.colors,
    sizes: product.sizes,
    sustainability: product.sustainability,
    composition: product.composition,
    category: product.featured ? "Capsula" : "Coleccion permanente",
    variants: buildMockVariants(product)
  };
}

function getFallbackBySlug(slug: string) {
  const product = getProductBySlug(slug);
  return product ? getFallbackCatalogProduct(product) : undefined;
}

function mapSummary(product: ApiProductSummary): CatalogProduct {
  const fallback = getFallbackBySlug(product.slug);
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    subtitle: product.sustainability_label ?? product.category,
    priceLabel: formatCurrency(product.price_from),
    numericPrice: product.price_from,
    image: fallback?.image ?? mockProducts[0].image,
    description:
      fallback?.description ??
      "Pieza curada con materiales conscientes y trazabilidad editorial.",
    colors: product.available_colors,
    sizes: product.available_sizes,
    sustainability: product.sustainability_label ?? "Impacto consciente",
    composition: fallback?.composition ?? "Composicion por definir",
    category: product.category,
    supplierName: fallback?.supplierName,
    variants: []
  };
}

function mapDetail(product: ApiProductDetail): CatalogProduct {
  const fallback = getFallbackBySlug(product.slug);
  const variants = product.variants.map((variant) => ({
    id: variant.id,
    sku: variant.sku,
    size: variant.size,
    color: variant.color,
    stock: variant.stock,
    price: variant.price,
    priceLabel: formatCurrency(variant.price)
  }));
  const price = Math.min(...variants.map((variant) => variant.price));

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    subtitle: fallback?.subtitle ?? product.sustainability_label ?? product.category.name,
    priceLabel: formatCurrency(price),
    numericPrice: price,
    image: fallback?.image ?? mockProducts[0].image,
    description: product.description,
    colors: [...new Set(variants.map((variant) => variant.color))],
    sizes: [...new Set(variants.map((variant) => variant.size))],
    sustainability:
      fallback?.sustainability ??
      product.sustainability_label ??
      `Score ${product.sustainability_score ?? 0}`,
    composition: fallback?.composition ?? "Composicion por definir",
    category: product.category.name,
    supplierName: product.supplier?.name ?? undefined,
    sustainabilityScore: product.sustainability_score,
    variants
  };
}

function mapProductPayload(payload: ProductPayload) {
  return {
    name: payload.name,
    slug: payload.slug,
    description: payload.description,
    category_id: payload.categoryId,
    supplier_id: payload.supplierId,
    sustainability_label: payload.sustainabilityLabel,
    sustainability_score: payload.sustainabilityScore
  };
}

function mapVariantPayload(payload: VariantPayload) {
  return {
    sku: payload.sku,
    size: payload.size,
    color: payload.color,
    stock: payload.stock,
    price: payload.price
  };
}

export async function getCatalogProducts() {
  try {
    const data = await requestJson<ApiProductSummary[]>("/products");
    return data.map(mapSummary);
  } catch {
    return mockProducts.map(getFallbackCatalogProduct);
  }
}

export async function getCatalogProduct(slug: string) {
  try {
    const data = await requestJson<ApiProductDetail>(`/products/${slug}`);
    return mapDetail(data);
  } catch {
    return getFallbackBySlug(slug);
  }
}

export async function getCustomerAccount() {
  try {
    const data = await requestJson<ApiAccountSummary>("/loyalty/customers/cus-maria-fernandez");
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

export async function getCustomerOrders(customerId = "cus-maria-fernandez"): Promise<CustomerOrder[]> {
  try {
    const data = await requestJson<ApiOrderSummary[]>(`/loyalty/customers/${customerId}/orders`);
    return data.map((order) => ({
      id: order.id,
      channel: order.sales_channel,
      total: order.total,
      totalLabel: formatCurrency(order.total),
      loyaltyPoints: order.loyalty_points_earned,
      paymentMethod: order.payment_method,
      notes: order.notes,
      items: order.items.map((item) => ({
        productSlug: item.product_slug,
        productName: item.product_name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        lineTotal: item.line_total,
        lineTotalLabel: formatCurrency(item.line_total)
      }))
    }));
  } catch {
    return [];
  }
}

export async function getAdminSummary() {
  try {
    const response = await requestJson<ApiOverview>("/reports/overview");
    return {
      lowStockVariants: response.overview.low_stock_variants,
      activePromotions: response.overview.active_promotions,
      ethicalSuppliers: response.overview.ethical_suppliers,
      salesToday: formatCurrency(response.overview.sales_total)
    };
  } catch {
    return mockAdminSummary;
  }
}

export async function getSalesReport(): Promise<SalesReportRow[]> {
  try {
    const response = await requestJson<ApiSalesReportRow[]>("/reports/sales-by-size-color");
    return response.map((row) => ({
      size: row.size,
      color: row.color,
      channel: row.sales_channel,
      units: row.total_units,
      revenue: row.total_revenue,
      revenueLabel: formatCurrency(row.total_revenue)
    }));
  } catch {
    return [
      {
        size: "M",
        color: "Musgo",
        channel: "online",
        units: 12,
        revenue: 41400,
        revenueLabel: formatCurrency(41400)
      },
      {
        size: "L",
        color: "Arena",
        channel: "store",
        units: 5,
        revenue: 17250,
        revenueLabel: formatCurrency(17250)
      }
    ];
  }
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  try {
    const data = await requestJson<ApiProductDetail[]>("/admin/products");
    return data.map(mapDetail);
  } catch {
    return mockProducts.map(getFallbackCatalogProduct);
  }
}

export async function updateAdminVariant(
  productSlug: string,
  variantId: string,
  payload: VariantPayload
): Promise<CatalogVariant> {
  const response = await requestJson<{ variant: ApiProductDetail["variants"][number] }>(
    `/admin/products/${productSlug}/variants/${variantId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapVariantPayload(payload))
    }
  );

  return {
    id: response.variant.id,
    sku: response.variant.sku,
    size: response.variant.size,
    color: response.variant.color,
    stock: response.variant.stock,
    price: response.variant.price,
    priceLabel: formatCurrency(response.variant.price)
  };
}

export async function createAdminProduct(payload: ProductPayload): Promise<AdminProduct> {
  const response = await requestJson<{ product: ApiProductDetail }>("/admin/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapProductPayload(payload))
  });

  return mapDetail(response.product);
}

export async function createAdminVariant(
  productSlug: string,
  payload: VariantPayload
): Promise<CatalogVariant> {
  const response = await requestJson<{ variant: ApiProductDetail["variants"][number] }>(
    `/admin/products/${productSlug}/variants`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapVariantPayload(payload))
    }
  );

  return {
    id: response.variant.id,
    sku: response.variant.sku,
    size: response.variant.size,
    color: response.variant.color,
    stock: response.variant.stock,
    price: response.variant.price,
    priceLabel: formatCurrency(response.variant.price)
  };
}

export async function signInClient(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Completa email y contrasena");
  }
  try {
    return await requestJson<{ role: "client"; access_token?: string }>("/auth/login/client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password })
    });
  } catch {
    return { role: "client" as const };
  }
}

export async function signInAdmin(username: string, password: string) {
  if (!username || !password) {
    throw new Error("Completa usuario y contrasena");
  }
  try {
    return await requestJson<{ role: "admin"; access_token?: string }>("/auth/login/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: username, password })
    });
  } catch {
    return { role: "admin" as const };
  }
}

export async function submitCheckout(payload: CheckoutInput): Promise<CheckoutResult> {
  const response = await requestJson<ApiCheckoutResponse>("/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_id: payload.customerId,
      customer_name: payload.customerName,
      customer_email: payload.customerEmail,
      payment_method: payload.paymentMethod,
      notes: payload.notes,
      items: payload.items.map((item) => ({
        product_slug: item.productSlug,
        variant_id: item.variantId,
        quantity: item.quantity
      }))
    })
  });

  return response.order;
}

export async function submitStoreSale(payload: CheckoutInput): Promise<CheckoutResult> {
  const response = await requestJson<ApiCheckoutResponse>("/sales/store", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_id: payload.customerId,
      customer_name: payload.customerName,
      customer_email: payload.customerEmail,
      payment_method: payload.paymentMethod,
      notes: payload.notes,
      items: payload.items.map((item) => ({
        product_slug: item.productSlug,
        variant_id: item.variantId,
        quantity: item.quantity
      }))
    })
  });

  return response.order;
}
