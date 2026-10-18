// Typed service layer over the Spring Boot API. Components and hooks call these functions;
// nothing in the frontend talks to the database, Cloudinary or Razorpay's secret APIs directly.
import { api, apiMessage, ApiError } from "./api-client";
import type {
  Address,
  AddressInput,
  AdminAnalytics,
  AdminOrder,
  AuditLog,
  Cart,
  Category,
  ChangePasswordRequest,
  DiscountTier,
  LoginRequest,
  LoginResponse,
  Order,
  PaymentOrder,
  PaymentVerifyRequest,
  Product,
  ProductPage,
  RegisterRequest,
  UpdateProfileRequest,
  UserSummary,
} from "./types";

const normalizeEmail = (gmail: string) => gmail.trim().toLowerCase();

const toSummary = (u: LoginResponse): UserSummary => ({ ...u, enabled: true });

// ---- Auth ----

export async function getCurrentUser(): Promise<LoginResponse | null> {
  try {
    return await api<LoginResponse>("/api/auth/me");
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) return null;
    throw e;
  }
}

export function login(b: LoginRequest): Promise<LoginResponse> {
  return api<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: { gmail: normalizeEmail(b.gmail), password: b.password },
    skipRefresh: true,
  });
}

export async function logout(): Promise<void> {
  await api<void>("/api/auth/logout", { method: "POST", skipRefresh: true }).catch(() => undefined);
}

/** Starts registration; the backend emails a 6-digit code. Returns the confirmation message. */
export function register(b: RegisterRequest): Promise<string> {
  return apiMessage("/api/auth/register", {
    body: {
      gmail: normalizeEmail(b.gmail),
      name: b.name.trim(),
      password: b.password,
      contactno: b.contactno.trim(),
      gender: b.gender || "",
      dob: b.dob || "",
    },
  });
}

/** Completes registration. On success the backend also signs the user in. */
export async function verifyOtp(gmail: string, otp: string): Promise<LoginResponse> {
  return api<LoginResponse>("/api/auth/register/verify", {
    method: "POST",
    body: { gmail: normalizeEmail(gmail), otp: otp.trim() },
    skipRefresh: true,
  });
}

export function resendVerificationCode(gmail: string): Promise<string> {
  return apiMessage("/api/auth/register/resend", { body: { gmail: normalizeEmail(gmail) } });
}

export function requestPasswordReset(gmail: string): Promise<string> {
  return apiMessage("/api/auth/password/forgot", { body: { gmail: normalizeEmail(gmail) } });
}

export function resetPassword(gmail: string, otp: string, newPassword: string): Promise<string> {
  return apiMessage("/api/auth/password/reset", {
    body: { gmail: normalizeEmail(gmail), otp: otp.trim(), newPassword },
  });
}

// ---- Profile (always the signed-in user; the backend ignores any email the client sends) ----

export async function getUserProfile(_gmail?: string): Promise<UserSummary> {
  return toSummary(await api<LoginResponse>("/api/auth/me"));
}

export async function updateUserProfile(_gmail: string, payload: UpdateProfileRequest): Promise<UserSummary> {
  const user = await api<LoginResponse>("/api/users/me", {
    method: "PUT",
    body: {
      name: payload.name ?? "",
      contactno: payload.contactno ?? "",
      gender: payload.gender ?? "",
      dob: payload.dob ?? "",
    },
  });
  return toSummary(user);
}

export function changeUserPassword(_gmail: string, payload: ChangePasswordRequest): Promise<string> {
  return apiMessage("/api/auth/password", { method: "PUT", body: payload });
}

/** Uploads through the backend (which stores it in Cloudinary). Returns the new image URL. */
export async function updateProfileImage(_gmail: string, file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const user = await api<LoginResponse>("/api/users/me/image", { method: "PUT", body: form });
  return user.imageUrl;
}

export async function removeProfileImage(_gmail?: string): Promise<string> {
  await api<LoginResponse>("/api/users/me/image", { method: "DELETE" });
  return "Profile picture removed";
}

// ---- Catalogue (public) ----

export function getAllProducts(): Promise<Product[]> {
  return api<Product[]>("/api/product/all");
}

export function getProduct(id: number | string): Promise<Product> {
  return api<Product>(`/api/product/get/${encodeURIComponent(String(id))}`);
}

export function getProductTiers(id: number | string): Promise<DiscountTier[]> {
  return api<DiscountTier[]>(`/api/product/${encodeURIComponent(String(id))}/discount-tiers`);
}

export type ProductSort = "newest" | "price-asc" | "price-desc" | "name";

export function searchProducts(params: {
  query?: string;
  category?: string;
  material?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
  page?: number;
  size?: number;
}): Promise<ProductPage> {
  return api<ProductPage>("/api/product/search", {
    query: {
      query: params.query?.trim(),
      category: params.category?.trim(),
      material: params.material?.trim(),
      inStock: params.inStock || undefined,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      sort: params.sort ?? "newest",
      page: params.page ?? 0,
      size: params.size ?? 24,
    },
  });
}

export function getCategories(): Promise<Category[]> {
  return api<Category[]>("/api/category");
}

export function createCategory(name: string): Promise<Category> {
  return api<Category>("/api/category", { method: "POST", body: { name: name.trim() } });
}

export function updateCategory(id: number, name: string): Promise<Category> {
  return api<Category>(`/api/category/${id}`, { method: "PUT", body: { name: name.trim() } });
}

export async function deleteCategory(id: number): Promise<string> {
  await api<void>(`/api/category/${id}`, { method: "DELETE" });
  return "Category deleted";
}

// ---- Cart ----

export function getCart(): Promise<Cart> {
  return api<Cart>("/api/cart");
}

export function addToCart(productId: number, quantity: number): Promise<Cart> {
  return api<Cart>("/api/cart/items", { method: "POST", body: { productId, quantity } });
}

export function updateCartItem(productId: number, quantity: number): Promise<Cart> {
  return api<Cart>(`/api/cart/items/${productId}`, { method: "PATCH", body: { quantity } });
}

export function removeCartItem(productId: number): Promise<Cart> {
  return api<Cart>(`/api/cart/items/${productId}`, { method: "DELETE" });
}

// ---- Addresses ----

export function getAddresses(): Promise<Address[]> {
  return api<Address[]>("/api/addresses");
}

export function createAddress(b: AddressInput): Promise<Address> {
  return api<Address>("/api/addresses", { method: "POST", body: b });
}

export function updateAddress(id: number, b: AddressInput): Promise<Address> {
  return api<Address>(`/api/addresses/${id}`, { method: "PUT", body: b });
}

export async function deleteAddress(id: number): Promise<string> {
  await api<void>(`/api/addresses/${id}`, { method: "DELETE" });
  return "Address deleted";
}

// ---- Orders & payment ----

export function getOrders(): Promise<Order[]> {
  return api<Order[]>("/api/orders");
}

export function getOrder(id: number | string): Promise<Order> {
  return api<Order>(`/api/orders/${encodeURIComponent(String(id))}`);
}

/** The backend prices the cart itself and creates the Razorpay order. */
export function createPaymentOrder(): Promise<PaymentOrder> {
  return api<PaymentOrder>("/api/payment/create-order", { method: "POST" });
}

/** The backend verifies the Razorpay signature and amount, then places the order. */
export function verifyPayment(b: PaymentVerifyRequest): Promise<Order> {
  return api<Order>("/api/payment/verify", { method: "POST", body: b });
}

// ---- Admin ----

export function adminGetAnalytics(days?: number): Promise<AdminAnalytics> {
  return api<AdminAnalytics>("/api/admin/analytics", { query: { days } });
}

export function adminGetOrders(): Promise<AdminOrder[]> {
  return api<AdminOrder[]>("/api/admin/orders");
}

export function adminUpdateOrderStatus(id: number, status: string): Promise<AdminOrder> {
  return api<AdminOrder>(`/api/admin/orders/${id}/status`, { method: "PATCH", query: { status } });
}

export function adminGetCustomers(): Promise<UserSummary[]> {
  return api<UserSummary[]>("/api/admin/customers");
}

export function adminSetCustomerEnabled(gmail: string, enabled: boolean): Promise<string> {
  return apiMessage(`/api/admin/customers/${encodeURIComponent(gmail)}/status?enabled=${enabled}`, { method: "PATCH" });
}

export function adminGetAuditLogs(): Promise<AuditLog[]> {
  return api<AuditLog[]>("/api/admin/audit-logs");
}

export function adminCreateAuditLog(b: {
  action?: string;
  entityType?: string;
  entityId?: string;
  details?: string;
}): Promise<AuditLog> {
  return api<AuditLog>("/api/admin/audit-logs", { method: "POST", body: b });
}

/**
 * Creates or updates a product. `images` is the final ordered gallery: existing URLs to keep and
 * new files to upload (the first entry is the cover). Returns the product id.
 */
export async function adminSaveProduct(
  fields: Record<string, string>,
  images: (string | File)[],
  id?: number,
): Promise<number> {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null && value !== "") form.append(key, value);
  }
  let fileIndex = 0;
  for (const img of images) {
    if (typeof img === "string") {
      form.append("imageLayout", img);
    } else {
      form.append("productImages", img);
      form.append("imageLayout", `new:${fileIndex++}`);
    }
  }
  if (images.length === 0) form.append("imageLayout", ""); // explicit "no images"

  const saved = await api<Product>(id ? `/api/product/update/${id}` : "/api/product/add", {
    method: id ? "PUT" : "POST",
    body: form,
  });
  return saved.productId;
}

export async function adminDeleteProduct(id: number, reason?: string): Promise<string> {
  await api<void>(`/api/product/delete/${id}`, { method: "DELETE", query: { reason: reason?.trim() } });
  return "Product deleted";
}

export function adminSetProductTiers(productId: number, tiers: DiscountTier[]): Promise<DiscountTier[]> {
  return api<DiscountTier[]>(`/api/product/${productId}/discount-tiers`, { method: "PUT", body: tiers });
}
