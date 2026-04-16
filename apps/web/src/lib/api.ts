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
    country?: string | null;
    organic_certification?: string | null;
    materials?: string[] | null;
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
  phone?: string | null;
  loyalty_points: number;
};

type ApiOrderSummary = {
  id: string;
  sales_channel: "online" | "store";
  customer_id?: string | null;
  customer_name?: string | null;
  subtotal: number;
  promotion_discount_total?: number | null;
  loyalty_discount_total?: number | null;
  discount_total?: number | null;
  total: number;
  redeemed_points?: number | null;
  loyalty_points_earned: number;
  payment_method?: string | null;
  store_name?: string | null;
  seller?: string | null;
  invoice_required?: boolean | null;
  invoice_rfc?: string | null;
  invoice_business_name?: string | null;
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

type ApiSalesKpis = {
  sales_channel?: "online" | "store" | null;
  start_date?: string | null;
  end_date?: string | null;
  total_orders: number;
  ticket_average: number;
  units_sold: number;
  total_revenue: number;
  top_products: Array<{
    product_slug: string;
    product_name: string;
    total_units: number;
    total_revenue: number;
  }>;
};

type ApiCheckoutResponse = {
  order: {
    id: string;
    sales_channel: "online" | "store";
    customer_id?: string | null;
    customer_name?: string | null;
    subtotal: number;
    promotion_discount_total?: number | null;
    loyalty_discount_total?: number | null;
    discount_total?: number | null;
    total: number;
    promotion_label?: string | null;
    redeemed_points?: number | null;
    loyalty_points_earned: number;
    payment_method?: string | null;
    store_name?: string | null;
    seller?: string | null;
    invoice_required?: boolean | null;
    invoice_rfc?: string | null;
    invoice_business_name?: string | null;
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
  customerFirstName?: string;
  customerLastName?: string;
  customerDni?: string;
  paymentMethod?: string;
  notes?: string;
  redeemPoints?: number;
  storeName?: string;
  seller?: string;
  invoiceRequired?: boolean;
  invoiceRfc?: string;
  invoiceBusinessName?: string;
  shippingMethod?: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingCountry?: string;
  shippingProvince?: string;
  shippingCity?: string;
  shippingPostalCode?: string;
  shippingPhone?: string;
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

export type SalesKpis = {
  totalOrders: number;
  ticketAverageLabel: string;
  unitsSold: number;
  totalRevenueLabel: string;
  topProducts: Array<{
    productSlug: string;
    productName: string;
    units: number;
    revenueLabel: string;
  }>;
};

export type Promotion = {
  id: string;
  name: string;
  description?: string | null;
  promotionType: "percentage" | "fixed" | "combo";
  discountValue: number;
  isActive: boolean;
  discountLabel: string;
};

export type Supplier = {
  id: string;
  name: string;
  country?: string | null;
  organicCertification?: string | null;
  materials: string[];
  notes?: string | null;
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
  const storedToken =
    typeof window !== "undefined" ? window.localStorage.getItem("ecowear_access_token") : null;
  const headers = new Headers(init?.headers);
  if (storedToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${storedToken}`);
  }

  const response = await fetch(`${config.apiUrl}${path}`, { ...init, headers });
  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const data = (await response.json()) as { detail?: string };
      if (data?.detail) {
        message = data.detail;
      }
    } catch {
      // ignore body parsing errors
    }
    throw new ApiError(response.status, message);
  }
  return response.json() as Promise<T>;
}

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type StoredUser = {
  id: string;
  name: string;
  email?: string | null;
  role: "client" | "admin";
};

const userStorageKey = "ecowear_user";

function storeUser(user: StoredUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(userStorageKey, JSON.stringify(user));
  window.dispatchEvent(new Event("ecowear_user_changed"));
}

function readStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(userStorageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function getStoredUser() {
  return readStoredUser();
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("ecowear_access_token");
  window.localStorage.removeItem(userStorageKey);
  window.dispatchEvent(new Event("ecowear_user_changed"));
}

export async function registerClient(payload: {
  fullName: string;
  email: string;
  password: string;
}) {
  if (!payload.fullName || !payload.email || !payload.password) {
    throw new Error("Completa nombre, email y contrasena");
  }

  const response = await requestJson<{
    access_token: string;
    token_type: string;
    user: { id: string; name: string; email?: string | null; role: "client" | "admin" };
  }>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: payload.fullName,
      email: payload.email,
      password: payload.password
    })
  });

  if (!response.access_token) {
    throw new Error("No se pudo registrar");
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem("ecowear_access_token", response.access_token);
  }
  storeUser({
    id: response.user.id,
    name: response.user.name,
    email: response.user.email ?? null,
    role: response.user.role
  });

  return response;
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
    const user = readStoredUser();
    const customerId = user?.id ?? "cus-maria-fernandez";
    const data = await requestJson<ApiAccountSummary>(`/loyalty/customers/${customerId}`);
    return {
      ...mockAccountSummary,
      name: data.full_name,
      email: data.email ?? mockAccountSummary.email,
      ecoPoints: data.loyalty_points,
      phone: data.phone ?? ""
    };
  } catch {
    return mockAccountSummary;
  }
}

export async function getCustomerOrders(customerId = "cus-maria-fernandez"): Promise<CustomerOrder[]> {
  try {
    const user = readStoredUser();
    const effectiveId = user?.id ?? customerId;
    const data = await requestJson<ApiOrderSummary[]>(`/loyalty/customers/${effectiveId}/orders`);
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

export async function getCustomerOrder(orderId: string): Promise<CustomerOrder | null> {
  try {
    const data = await requestJson<ApiOrderSummary>(`/loyalty/orders/${orderId}`);
    return {
      id: data.id,
      channel: data.sales_channel,
      total: data.total,
      totalLabel: formatCurrency(data.total),
      loyaltyPoints: data.loyalty_points_earned,
      paymentMethod: data.payment_method,
      notes: data.notes,
      items: data.items.map((item) => ({
        productSlug: item.product_slug,
        productName: item.product_name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        lineTotal: item.line_total,
        lineTotalLabel: formatCurrency(item.line_total)
      }))
    };
  } catch {
    return null;
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

export async function getSalesKpis(params?: {
  startDate?: string;
  endDate?: string;
  channel?: "online" | "store";
}): Promise<SalesKpis> {
  const normalizeDate = (value: string, endOfDay = false) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return endOfDay ? `${value}T23:59:59Z` : `${value}T00:00:00Z`;
    }
    return value;
  };

  const query = new URLSearchParams();
  if (params?.startDate) query.set("start_date", normalizeDate(params.startDate, false));
  if (params?.endDate) query.set("end_date", normalizeDate(params.endDate, true));
  if (params?.channel) query.set("sales_channel", params.channel);
  const suffix = query.toString().length > 0 ? `?${query.toString()}` : "";

  try {
    const response = await requestJson<ApiSalesKpis>(`/reports/kpis${suffix}`);
    return {
      totalOrders: response.total_orders,
      ticketAverageLabel: formatCurrency(response.ticket_average),
      unitsSold: response.units_sold,
      totalRevenueLabel: formatCurrency(response.total_revenue),
      topProducts: response.top_products.map((item) => ({
        productSlug: item.product_slug,
        productName: item.product_name,
        units: item.total_units,
        revenueLabel: formatCurrency(item.total_revenue)
      }))
    };
  } catch {
    return {
      totalOrders: 0,
      ticketAverageLabel: formatCurrency(0),
      unitsSold: 0,
      totalRevenueLabel: formatCurrency(0),
      topProducts: []
    };
  }
}

export async function getPromotions(activeOnly = true): Promise<Promotion[]> {
  try {
    const response = await requestJson<
      Array<{
        id: string;
        name: string;
        description?: string | null;
        promotion_type: "percentage" | "fixed" | "combo";
        discount_value: number;
        is_active: boolean;
      }>
    >(`/promotions?active_only=${String(activeOnly)}`);

    return response.map((promo) => ({
      id: promo.id,
      name: promo.name,
      description: promo.description,
      promotionType: promo.promotion_type,
      discountValue: promo.discount_value,
      isActive: promo.is_active,
      discountLabel:
        promo.promotion_type === "percentage"
          ? `${promo.discount_value}%`
          : `$${promo.discount_value.toLocaleString("es-MX")} MXN`
    }));
  } catch {
    return [
      {
        id: "promo-combo-temporada",
        name: "Combo de temporada",
        description: "-$350 MXN en compras desde $5,000 con 2 productos distintos.",
        promotionType: "combo",
        discountValue: 350,
        isActive: true,
        discountLabel: "$350 MXN"
      }
    ];
  }
}

export async function getAdminPromotions(): Promise<Promotion[]> {
  try {
    const response = await requestJson<
      Array<{
        id: string;
        name: string;
        description?: string | null;
        promotion_type: "percentage" | "fixed" | "combo";
        discount_value: number;
        is_active: boolean;
      }>
    >("/admin/promotions?active_only=false");

    return response.map((promo) => ({
      id: promo.id,
      name: promo.name,
      description: promo.description,
      promotionType: promo.promotion_type,
      discountValue: promo.discount_value,
      isActive: promo.is_active,
      discountLabel:
        promo.promotion_type === "percentage"
          ? `${promo.discount_value}%`
          : `$${promo.discount_value.toLocaleString("es-MX")} MXN`
    }));
  } catch {
    return getPromotions(false);
  }
}

export async function getAdminSuppliers(): Promise<Supplier[]> {
  const response = await requestJson<
    Array<{
      id: string;
      name: string;
      country?: string | null;
      organic_certification?: string | null;
      materials?: string[] | null;
      notes?: string | null;
    }>
  >("/admin/suppliers");

  return response.map((row) => ({
    id: row.id,
    name: row.name,
    country: row.country ?? null,
    organicCertification: row.organic_certification ?? null,
    materials: row.materials ?? [],
    notes: row.notes ?? null
  }));
}

export async function createAdminSupplier(payload: {
  name: string;
  country?: string;
  organicCertification?: string;
  materials: string[];
  notes?: string;
}): Promise<Supplier> {
  const response = await requestJson<{
    id: string;
    name: string;
    country?: string | null;
    organic_certification?: string | null;
    materials?: string[] | null;
    notes?: string | null;
  }>("/admin/suppliers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name,
      country: payload.country ?? null,
      organic_certification: payload.organicCertification ?? null,
      materials: payload.materials,
      notes: payload.notes ?? null
    })
  });

  return {
    id: response.id,
    name: response.name,
    country: response.country ?? null,
    organicCertification: response.organic_certification ?? null,
    materials: response.materials ?? [],
    notes: response.notes ?? null
  };
}

export async function updateAdminSupplier(
  supplierId: string,
  payload: {
    name: string;
    country?: string;
    organicCertification?: string;
    materials: string[];
    notes?: string;
  }
): Promise<Supplier> {
  const response = await requestJson<{
    id: string;
    name: string;
    country?: string | null;
    organic_certification?: string | null;
    materials?: string[] | null;
    notes?: string | null;
  }>(`/admin/suppliers/${supplierId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name,
      country: payload.country ?? null,
      organic_certification: payload.organicCertification ?? null,
      materials: payload.materials,
      notes: payload.notes ?? null
    })
  });

  return {
    id: response.id,
    name: response.name,
    country: response.country ?? null,
    organicCertification: response.organic_certification ?? null,
    materials: response.materials ?? [],
    notes: response.notes ?? null
  };
}

export async function createAdminPromotion(payload: {
  name: string;
  description?: string;
  promotionType: "percentage" | "fixed" | "combo";
  discountValue: number;
  isActive: boolean;
}): Promise<Promotion> {
  const response = await requestJson<{
    promotion: {
      id: string;
      name: string;
      description?: string | null;
      promotion_type: "percentage" | "fixed" | "combo";
      discount_value: number;
      is_active: boolean;
    };
  }>("/admin/promotions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name,
      description: payload.description ?? null,
      promotion_type: payload.promotionType,
      discount_value: payload.discountValue,
      is_active: payload.isActive
    })
  });

  const promo = response.promotion;
  return {
    id: promo.id,
    name: promo.name,
    description: promo.description,
    promotionType: promo.promotion_type,
    discountValue: promo.discount_value,
    isActive: promo.is_active,
    discountLabel:
      promo.promotion_type === "percentage"
        ? `${promo.discount_value}%`
        : `$${promo.discount_value.toLocaleString("es-MX")} MXN`
  };
}

export async function updateAdminPromotion(
  promotionId: string,
  payload: {
    name: string;
    description?: string;
    promotionType: "percentage" | "fixed" | "combo";
    discountValue: number;
    isActive: boolean;
  }
): Promise<Promotion> {
  const response = await requestJson<{
    promotion: {
      id: string;
      name: string;
      description?: string | null;
      promotion_type: "percentage" | "fixed" | "combo";
      discount_value: number;
      is_active: boolean;
    };
  }>(`/admin/promotions/${promotionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name,
      description: payload.description ?? null,
      promotion_type: payload.promotionType,
      discount_value: payload.discountValue,
      is_active: payload.isActive
    })
  });

  const promo = response.promotion;
  return {
    id: promo.id,
    name: promo.name,
    description: promo.description,
    promotionType: promo.promotion_type,
    discountValue: promo.discount_value,
    isActive: promo.is_active,
    discountLabel:
      promo.promotion_type === "percentage"
        ? `${promo.discount_value}%`
        : `$${promo.discount_value.toLocaleString("es-MX")} MXN`
  };
}

export async function setAdminPromotionActive(
  promotionId: string,
  isActive: boolean
): Promise<Promotion> {
  const response = await requestJson<{
    promotion: {
      id: string;
      name: string;
      description?: string | null;
      promotion_type: "percentage" | "fixed" | "combo";
      discount_value: number;
      is_active: boolean;
    };
  }>(`/admin/promotions/${promotionId}/active?is_active=${String(isActive)}`, {
    method: "PUT"
  });

  const promo = response.promotion;
  return {
    id: promo.id,
    name: promo.name,
    description: promo.description,
    promotionType: promo.promotion_type,
    discountValue: promo.discount_value,
    isActive: promo.is_active,
    discountLabel:
      promo.promotion_type === "percentage"
        ? `${promo.discount_value}%`
        : `$${promo.discount_value.toLocaleString("es-MX")} MXN`
  };
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  try {
    const data = await requestJson<ApiProductDetail[]>("/admin/products");
    return data.map(mapDetail);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      throw error;
    }
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
    const response = await requestJson<{
      access_token: string;
      token_type: string;
      user: { id: string; name: string; email?: string | null; role: "client" | "admin" };
    }>("/auth/login/client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password })
    });
    if (!response.access_token) {
      throw new Error("No se pudo iniciar sesion");
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ecowear_access_token", response.access_token);
    }
    storeUser({
      id: response.user.id,
      name: response.user.name,
      email: response.user.email ?? null,
      role: response.user.role
    });
    return response;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      throw new Error("Credenciales invalidas");
    }
    throw error instanceof Error ? error : new Error("No se pudo iniciar sesion");
  }
}

export async function signInAdmin(username: string, password: string) {
  if (!username || !password) {
    throw new Error("Completa usuario y contrasena");
  }
  try {
    const response = await requestJson<{
      access_token: string;
      token_type: string;
      user: { id: string; name: string; email?: string | null; role: "client" | "admin" };
    }>("/auth/login/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: username, password })
    });
    if (!response.access_token) {
      throw new Error("No se pudo iniciar sesion");
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ecowear_access_token", response.access_token);
    }
    storeUser({
      id: response.user.id,
      name: response.user.name,
      email: response.user.email ?? null,
      role: response.user.role
    });
    return response;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      throw new Error("Credenciales invalidas");
    }
    if (error instanceof ApiError && error.status === 403) {
      throw new Error("No tenes permisos de administrador");
    }
    throw error instanceof Error ? error : new Error("No se pudo iniciar sesion");
  }
}

export async function signInAuto(identifier: string, password: string) {
  try {
    const response = await signInAdmin(identifier, password);
    return { ...response, detectedRole: "admin" as const };
  } catch (error) {
    // If it's not an admin (401/403), try as client.
    const isNotAdmin =
      (error instanceof Error && error.message.includes("permisos")) ||
      (error instanceof Error && error.message.includes("Credenciales"));

    if (!isNotAdmin) {
      // Still try client anyway; if it fails, it'll throw.
    }

    const response = await signInClient(identifier, password);
    return { ...response, detectedRole: "client" as const };
  }
}

export async function updateCustomerProfile(payload: { fullName: string; email: string; phone: string }) {
  const user = readStoredUser();
  if (!user) {
    throw new Error("Necesitas iniciar sesion");
  }
  const response = await requestJson<ApiAccountSummary>(`/loyalty/customers/${user.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: payload.fullName,
      email: payload.email,
      phone: payload.phone || null
    })
  });
  storeUser({ ...user, name: response.full_name, email: response.email ?? null });
  return response;
}

export async function getCustomerProfile() {
  const user = readStoredUser();
  const customerId = user?.id ?? "cus-maria-fernandez";
  const data = await requestJson<ApiAccountSummary>(`/loyalty/customers/${customerId}`);
  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email ?? "",
    phone: data.phone ?? "",
    ecoPoints: data.loyalty_points,
    role: user?.role ?? "client"
  };
}

export async function submitCheckout(payload: CheckoutInput): Promise<CheckoutResult> {
  const response = await requestJson<ApiCheckoutResponse>("/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_id: payload.customerId,
      customer_name: payload.customerName,
      customer_first_name: payload.customerFirstName ?? null,
      customer_last_name: payload.customerLastName ?? null,
      customer_email: payload.customerEmail,
      customer_dni: payload.customerDni ?? null,
      payment_method: payload.paymentMethod,
      notes: payload.notes,
      redeem_points: payload.redeemPoints ?? null,
      invoice_required: payload.invoiceRequired ?? null,
      invoice_rfc: payload.invoiceRfc ?? null,
      invoice_business_name: payload.invoiceBusinessName ?? null,
      shipping_method: payload.shippingMethod ?? null,
      shipping_address_line1: payload.shippingAddressLine1 ?? null,
      shipping_address_line2: payload.shippingAddressLine2 ?? null,
      shipping_country: payload.shippingCountry ?? null,
      shipping_province: payload.shippingProvince ?? null,
      shipping_city: payload.shippingCity ?? null,
      shipping_postal_code: payload.shippingPostalCode ?? null,
      shipping_phone: payload.shippingPhone ?? null,
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
      customer_first_name: payload.customerFirstName ?? null,
      customer_last_name: payload.customerLastName ?? null,
      customer_email: payload.customerEmail,
      customer_dni: payload.customerDni ?? null,
      payment_method: payload.paymentMethod,
      notes: payload.notes,
      store_name: payload.storeName ?? null,
      seller: payload.seller ?? null,
      redeem_points: payload.redeemPoints ?? null,
      invoice_required: payload.invoiceRequired ?? null,
      invoice_rfc: payload.invoiceRfc ?? null,
      invoice_business_name: payload.invoiceBusinessName ?? null,
      shipping_method: payload.shippingMethod ?? null,
      shipping_address_line1: payload.shippingAddressLine1 ?? null,
      shipping_address_line2: payload.shippingAddressLine2 ?? null,
      shipping_country: payload.shippingCountry ?? null,
      shipping_province: payload.shippingProvince ?? null,
      shipping_city: payload.shippingCity ?? null,
      shipping_postal_code: payload.shippingPostalCode ?? null,
      shipping_phone: payload.shippingPhone ?? null,
      items: payload.items.map((item) => ({
        product_slug: item.productSlug,
        variant_id: item.variantId,
        quantity: item.quantity
      }))
    })
  });

  return response.order;
}
