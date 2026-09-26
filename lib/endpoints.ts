import { api } from "./api";
import type {
  Address,
  AddressInput,
  AdminOrder,
  Cart,
  Category,
  DiscountTier,
  LoginRequest,
  LoginResponse,
  Order,
  PaymentOrder,
  PaymentVerifyRequest,
  Product,
  ProductPage,
  RegisterRequest,
  UserSummary,
} from "./types";

// ---- Auth ----
export const login = (b: LoginRequest) =>
  api<LoginResponse>("/user/login", { method: "POST", body: b, auth: false });
export const register = (b: RegisterRequest) =>
  api<string>("/user/register", { method: "POST", body: b, auth: false });
export const verifyOtp = (gmail: string, otp: number) =>
  api<string>("/verification/verifyotp", { method: "POST", body: { gmail, otp }, auth: false });
export function updateProfileImage(gmail: string, file: File) {
  const fd = new FormData();
  fd.append("profileImage", file);
  return api<string>(`/user/update-profile-image?gmail=${encodeURIComponent(gmail)}`, {
    method: "PUT",
    body: fd,
  });
}

// ---- Products (public) ----
export const getAllProducts = () => api<Product[]>("/product/all", { auth: false });
export const getProduct = (id: number | string) =>
  api<Product>(`/product/get/${id}`, { auth: false });
export const getProductTiers = (id: number | string) =>
  api<DiscountTier[]>(`/product/${id}/discount-tiers`, { auth: false });
export function searchProducts(params: {
  query?: string;
  category?: string;
  page?: number;
  size?: number;
}) {
  const q = new URLSearchParams();
  if (params.query) q.set("query", params.query);
  if (params.category) q.set("category", params.category);
  q.set("page", String(params.page ?? 0));
  q.set("size", String(params.size ?? 12));
  return api<ProductPage>(`/product/search?${q.toString()}`, { auth: false });
}

// ---- Categories ----
export const getCategories = () => api<Category[]>("/category", { auth: false });
export const createCategory = (name: string) =>
  api<Category>("/category", { method: "POST", body: { name } });
export const updateCategory = (id: number, name: string) =>
  api<Category>(`/category/${id}`, { method: "PUT", body: { name } });
export const deleteCategory = (id: number) =>
  api<string>(`/category/${id}`, { method: "DELETE" });

// ---- Cart (USER) ----
export const getCart = () => api<Cart>("/cart");
export const addToCart = (productId: number, quantity: number) =>
  api<Cart>("/cart/items", { method: "POST", body: { productId, quantity } });
export const updateCartItem = (productId: number, quantity: number) =>
  api<Cart>(`/cart/items/${productId}`, { method: "PATCH", body: { quantity } });
export const removeCartItem = (productId: number) =>
  api<Cart>(`/cart/items/${productId}`, { method: "DELETE" });

// ---- Addresses ----
export const getAddresses = () => api<Address[]>("/addresses");
export const createAddress = (b: AddressInput) =>
  api<Address>("/addresses", { method: "POST", body: b });
export const updateAddress = (id: number, b: AddressInput) =>
  api<Address>(`/addresses/${id}`, { method: "PUT", body: b });
export const deleteAddress = (id: number) =>
  api<string>(`/addresses/${id}`, { method: "DELETE" });

// ---- Orders (USER) ----
export const getOrders = () => api<Order[]>("/orders");
export const getOrder = (id: number | string) => api<Order>(`/orders/${id}`);
export const placeOrder = (addressId: number) =>
  api<Order>("/orders", { method: "POST", body: { addressId } });

// ---- Payment (USER) ----
export const createPaymentOrder = () =>
  api<PaymentOrder>("/payment/create-order", { method: "POST" });
export const verifyPayment = (b: PaymentVerifyRequest) =>
  api<Order>("/payment/verify", { method: "POST", body: b });

// ---- Admin ----
export const adminGetOrders = () => api<AdminOrder[]>("/admin/orders");
export const adminUpdateOrderStatus = (id: number, status: string) =>
  api<AdminOrder>(`/admin/orders/${id}/status?status=${encodeURIComponent(status)}`, {
    method: "PATCH",
  });
export const adminGetCustomers = () => api<UserSummary[]>("/admin/customers");
export const adminSetCustomerEnabled = (gmail: string, enabled: boolean) =>
  api<string>(`/admin/customers/${encodeURIComponent(gmail)}/status?enabled=${enabled}`, {
    method: "PATCH",
  });

// ---- Admin: products (multipart) ----
export function adminSaveProduct(
  fields: Record<string, string>,
  images: File[],
  id?: number,
) {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
  images.forEach((f) => fd.append("productImages", f));
  return id
    ? api<string>(`/product/update/${id}`, { method: "PUT", body: fd })
    : api<string>("/product/add", { method: "POST", body: fd });
}
export const adminDeleteProduct = (id: number) =>
  api<string>(`/product/delete/${id}`, { method: "DELETE" });
export const adminSetProductTiers = (id: number, tiers: DiscountTier[]) =>
  api<DiscountTier[]>(`/product/${id}/discount-tiers`, { method: "PUT", body: tiers });
