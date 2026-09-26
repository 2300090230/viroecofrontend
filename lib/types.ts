// Typed mirrors of the Viroeco Spring Boot DTOs. Field names match the JSON exactly.

export interface DiscountTier {
  minQuantity: number;
  discountPercent: number;
}

export interface Product {
  productId: number;
  pname: string;
  category: string;
  size: string;
  material: string;
  uvProtection: boolean;
  usage: string;
  packSize: string;
  color: string;
  price: number;
  originalPrice: number;
  quantity: number;
  isAvailable: boolean;
  weight: string;
  length: string;
  width: string;
  height: string;
  sustainabilityTag: string;
  subCategory: string;
  features: string;
  productImages: string[];
  discountTiers: DiscountTier[];
}

export interface ProductPage {
  content: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type Role = "USER" | "ADMIN";

export interface LoginResponse {
  token: string;
  gmail: string;
  name: string;
  contactno: string;
  imageUrl: string;
  gender: string;
  dob: string;
  role: Role;
}

export interface LoginRequest {
  gmail: string;
  password: string;
}

export interface RegisterRequest {
  gmail: string;
  name: string;
  password: string;
  contactno: string;
  imageUrl: string;
  gender: string;
  dob: string;
}

export interface OtpVerificationRequest {
  gmail: string;
  otp: number;
}

export interface CartItem {
  productId: number;
  pname: string;
  price: number;              // original unit price
  quantity: number;
  discountPercent: number;    // bulk tier applied (0 if none)
  discountedPrice: number;    // unit price after discount — what's actually charged
}

export interface Cart {
  items: CartItem[];
}

export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  doorNumber: string;
  country: string;
  addressType: string;
}

export type AddressInput = Omit<Address, "id">;

export interface OrderItem {
  productId: number;
  pname: string;
  price: number;
  quantity: number;
  discountPercent: number;
}

export interface Order {
  id: number;
  addressId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface AdminOrder extends Order {
  gmail: string;
  customerName: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface UserSummary {
  gmail: string;
  name: string;
  contactno: string;
  gender: string;
  dob: string;
  role: Role;
  imageUrl: string;
  enabled: boolean;
}

export interface PaymentOrder {
  razorpayOrderId: string;
  keyId: string;
  amount: number; // paise
  currency: string;
}

export interface PaymentVerifyRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  addressId: number;
}
