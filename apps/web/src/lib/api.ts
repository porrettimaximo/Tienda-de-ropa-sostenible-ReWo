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
  image_url?: string | null;
  sustainability_label?: string | null;
  available_colors: string[];
  available_sizes: string[];
  total_stock: number;
};

type ApiProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string | null;
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
    image_url?: string | null;
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
  shipping_method?: string | null;
  shipping_address_line1?: string | null;
  shipping_address_line2?: string | null;
  shipping_country?: string | null;
  shipping_province?: string | null;
  shipping_city?: string | null;
  shipping_postal_code?: string | null;
  shipping_phone?: string | null;
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
    shipping_method?: string | null;
    shipping_address_line1?: string | null;
    shipping_address_line2?: string | null;
    shipping_country?: string | null;
    shipping_province?: string | null;
    shipping_city?: string | null;
    shipping_postal_code?: string | null;
    shipping_phone?: string | null;
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
  imageUrl?: string;
  initialVariants?: VariantPayload[];
};

type VariantPayload = {
  sku: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  image_url?: string | null;
};

export type CatalogVariant = {
  id: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  priceLabel: string;
  image_url?: string | null;
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
  totalStock: number;
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
  shippingMethod?: string | null;
  shippingAddressLine1?: string | null;
  shippingAddressLine2?: string | null;
  shippingCountry?: string | null;
  shippingProvince?: string | null;
  shippingCity?: string | null;
  shippingPostalCode?: string | null;
  shippingPhone?: string | null;
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
  phone: string;
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
      password: payload.password,
      phone: payload.phone
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
    image: product.image_url ?? fallback?.image ?? mockProducts[0].image,
    description:
      fallback?.description ??
      "Pieza curada con materiales conscientes y trazabilidad editorial.",
    colors: product.available_colors,
    sizes: product.available_sizes,
    sustainability: product.sustainability_label ?? "Impacto consciente",
    composition: fallback?.composition ?? "Composicion por definir",
    category: product.category,
    supplierName: fallback?.supplierName,
    variants: [],
    totalStock: product.total_stock
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
    priceLabel: formatCurrency(variant.price),
    image_url: variant.image_url
  }));
  const price = Math.min(...variants.map((variant) => variant.price));

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    subtitle: fallback?.subtitle ?? product.sustainability_label ?? product.category.name,
    priceLabel: formatCurrency(price),
    numericPrice: price,
    image: product.image_url ?? fallback?.image ?? mockProducts[0].image,
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
    totalStock: variants.reduce((sum, v) => sum + v.stock, 0),
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
    sustainability_score: payload.sustainabilityScore,
    image_url: payload.imageUrl,
    initial_variants: (payload.initialVariants || []).map(mapVariantPayload)
  };
}

function mapVariantPayload(payload: VariantPayload) {
  return {
    sku: payload.sku,
    size: payload.size,
    color: payload.color,
    stock: payload.stock,
    price: payload.price,
    image_url: payload.image_url
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
  const user = readStoredUser();
  const customerId = user?.id;
  if (!customerId) {
    throw new Error("No hay sesion activa");
  }

  try {
    const data = await requestJson<ApiAccountSummary>(`/loyalty/customers/${customerId}`);
    const ecoPoints = data.loyalty_points || 0;
    
    let tier = "Eco Starter";
    let nextReward = "Cupón 10% OFF en 100 puntos";
    if (ecoPoints >= 500) {
       tier = "Eco Champion";
       nextReward = "Envío Gratis Permanente en 1000 puntos";
    } else if (ecoPoints >= 100) {
       tier = "Eco Lover";
       nextReward = `Cupón 15% OFF en ${500 - ecoPoints} puntos`;
    } else {
       nextReward = `Cupón 10% OFF en ${100 - ecoPoints} puntos`;
    }

    return {
      name: data.full_name,
      email: data.email ?? "",
      ecoPoints: ecoPoints,
      phone: data.phone ?? "",
      tier: tier,
      nextReward: nextReward
    };
  } catch (error) {
    console.error("Error fetching account summary:", error);
    throw error;
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
      shippingMethod: order.shipping_method,
      shippingAddressLine1: order.shipping_address_line1,
      shippingAddressLine2: order.shipping_address_line2,
      shippingCountry: order.shipping_country,
      shippingProvince: order.shipping_province,
      shippingCity: order.shipping_city,
      shippingPostalCode: order.shipping_postal_code,
      shippingPhone: order.shipping_phone,
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
      shippingMethod: data.shipping_method,
      shippingAddressLine1: data.shipping_address_line1,
      shippingAddressLine2: data.shipping_address_line2,
      shippingCountry: data.shipping_country,
      shippingProvince: data.shipping_province,
      shippingCity: data.shipping_city,
      shippingPostalCode: data.shipping_postal_code,
      shippingPhone: data.shipping_phone,
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

/**
 * Calcula el mejor descuento aplicable basado en promociones activas
 * 
 * @param items - Items en el carrito
 * @param promotions - Promociones activas disponibles
 * @param subtotal - Subtotal de la compra
 * @returns Objeto con monto de descuento y datos de la promoción aplicada
 */
export function calculateBestPromotion(
  items: Array<{ productSlug: string; quantity: number }>,
  promotions: Promotion[],
  subtotal: number
): { discountAmount: number; appliedPromotion: Promotion | null } {
  let bestDiscount = 0;
  let appliedPromotion: Promotion | null = null;

  for (const promo of promotions) {
    let discount = 0;

    switch (promo.promotionType) {
      case "fixed":
        // Descuento fijo simple
        discount = promo.discountValue;
        break;

      case "percentage":
        // Descuento porcentual
        discount = subtotal * (promo.discountValue / 100);
        break;

      case "combo":
        // Descuento combo: requiere subtotal >= 5000 y 2+ productos distintos
        const distinctProducts = new Set(items.map((item) => item.productSlug)).size;
        if (subtotal >= 5000 && distinctProducts >= 2) {
          discount = promo.discountValue;
        }
        break;
    }

    // Usar la promoción que da mayor descuento
    if (discount > bestDiscount) {
      bestDiscount = discount;
      appliedPromotion = promo;
    }
  }

  return {
    discountAmount: bestDiscount,
    appliedPromotion
  };
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

export async function deleteAdminPromotion(promotionId: string): Promise<void> {
  await requestJson(`/admin/promotions/${promotionId}`, {
    method: "DELETE"
  });
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

export async function getAdminCategories(): Promise<Array<{ id: string; name: string; slug: string }>> {
  try {
    return await requestJson<Array<{ id: string; name: string; slug: string }>>("/admin/categories");
  } catch {
    return [];
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

export async function updateAdminProduct(
  productSlug: string,
  payload: Partial<ProductPayload>
): Promise<AdminProduct> {
  // Ensure we have the current product if partial fields are missing
  const current = await getCatalogProduct(productSlug);
  if (!current) throw new Error("Producto no encontrado");

  const fullPayload: ProductPayload = {
    name: payload.name ?? current.name,
    slug: payload.slug ?? current.slug,
    description: payload.description ?? current.description,
    categoryId: payload.categoryId ?? "", // This should be provided or mapped from current
    supplierId: payload.supplierId,
    sustainabilityLabel: payload.sustainabilityLabel ?? current.sustainability,
    sustainabilityScore: payload.sustainabilityScore ?? current.sustainabilityScore ?? 90,
    imageUrl: payload.imageUrl ?? current.image,
    initialVariants: payload.initialVariants ?? []
  };

  const response = await requestJson<{ product: ApiProductDetail }>(`/admin/products/${productSlug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapProductPayload(fullPayload))
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

export async function deleteAdminProduct(productSlug: string): Promise<void> {
  await requestJson(`/admin/products/${productSlug}`, {
    method: "DELETE"
  });
}

export async function updateAdminProductImage(productSlug: string, imageUrl: string): Promise<AdminProduct> {
  const response = await requestJson<{ product: ApiProductDetail }>(
    `/admin/products/${productSlug}/image?image_url=${encodeURIComponent(imageUrl)}`,
    {
      method: "PUT"
    }
  );

  return mapDetail(response.product);
}

export async function uploadAdminProductImage(productSlug: string, file: File): Promise<AdminProduct> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await requestJson<{ product: ApiProductDetail }>(
    `/admin/products/${productSlug}/image/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  return mapDetail(response.product);
}

export async function uploadAdminVariantImage(
  productSlug: string,
  variantId: string,
  file: File
): Promise<CatalogVariant> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await requestJson<{ variant: ApiProductDetail["variants"][number] }>(
    `/admin/products/${productSlug}/variants/${variantId}/image/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  return {
    ...response.variant,
    priceLabel: formatCurrency(response.variant.price),
    image_url: response.variant.image_url
  };
}


export async function deleteAdminSupplier(supplierId: string): Promise<void> {
  await requestJson(`/admin/suppliers/${supplierId}`, {
    method: "DELETE"
  });
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
  try {
    const data = await requestJson<ApiAccountSummary>(`/loyalty/customers/${customerId}`);
    return {
      id: data.id,
      fullName: data.full_name,
      email: data.email ?? "",
      phone: data.phone ?? "",
      ecoPoints: data.loyalty_points,
      role: user?.role ?? "client"
    };
  } catch (error) {
    return {
      id: customerId,
      fullName: user?.name ?? "",
      email: user?.email ?? "",
      phone: "",
      ecoPoints: 0,
      role: user?.role ?? "client"
    };
  }
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
