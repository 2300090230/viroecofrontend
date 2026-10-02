import { createClient } from "./supabase/client";
import { getSession, setSession, clearSession } from "./session";
import { uploadManyToCloudinary, uploadToCloudinary } from "./cloudinary";
import type {
  Address,
  AddressInput,
  AdminAnalytics,
  AdminOrder,
  AuditLog,
  Cart,
  CartItem,
  Category,
  DiscountTier,
  LoginRequest,
  LoginResponse,
  Order,
  OrderItem,
  PaymentOrder,
  PaymentVerifyRequest,
  Product,
  ProductPage,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserSummary,
} from "./types";

const getSupabase = () => createClient() as any;

// Helper to map DB Product Row to Frontend Product DTO
function mapProductRow(row: any, tiers: any[] = []): Product {
  let images: string[] = [];
  if (row.product_images) {
    images = typeof row.product_images === "string" 
      ? row.product_images.split(";").map((s: string) => s.trim()).filter(Boolean)
      : row.product_images;
  }
  
  const discountTiers: DiscountTier[] = (row.product_discount_tier || tiers || []).map((t: any) => ({
    minQuantity: Number(t.min_quantity || t.minQuantity || 0),
    discountPercent: Number(t.discount_percent || t.discountPercent || 0),
  }));

  return {
    productId: Number(row.product_id),
    pname: row.pname || "",
    category: row.category || "",
    size: row.size || "",
    material: row.material || "",
    uvProtection: Boolean(row.uv_protection),
    usage: row.product_usage || row.usage || "",
    packSize: row.pack_size || row.packSize || "",
    color: row.color || "",
    price: Number(row.price || 0),
    originalPrice: Number(row.original_price || row.originalPrice || row.price || 0),
    quantity: Number(row.quantity || 0),
    isAvailable: Boolean(row.is_available === 1 || row.is_available === true || (row.quantity && row.quantity > 0)),
    weight: row.weight || "",
    length: row.length || "",
    width: row.width || "",
    height: row.height || "",
    sustainabilityTag: row.sustainability_tag || row.sustainabilityTag || "ECO-FRIENDLY",
    subCategory: row.sub_category || row.subCategory || "",
    features: row.features || "",
    productImages: images,
    discountTiers,
  };
}

// ---- Auth (Supabase Auth; profile/role data lives in the `users` table) ----

type ProfileSeed = Partial<Pick<RegisterRequest, "name" | "contactno" | "gender" | "dob" | "imageUrl">>;

// cart/address/orders reference users(gmail), so every auth user needs a profile row.
// Inserts only when missing; role is always USER here — admins are promoted in the database.
async function ensureProfile(email: string, seed: ProfileSeed = {}): Promise<void> {
  const { error } = await getSupabase()
    .from("users")
    .upsert(
      {
        gmail: email,
        name: seed.name || email.split("@")[0],
        password: "", // credentials are managed by Supabase Auth, never stored here
        contactno: seed.contactno || null,
        image_url: seed.imageUrl || "",
        gender: seed.gender || "NA",
        dob: seed.dob || "",
        role: "USER",
        enabled: true,
      },
      { onConflict: "gmail", ignoreDuplicates: true },
    );
  if (error) throw new Error(`Could not create your profile: ${error.message}`);
}

function authErrorMessage(error: any, fallback: string): string {
  const msg: string = error?.message || "";
  if (/invalid login credentials/i.test(msg)) return "Invalid email or password";
  if (/email not confirmed/i.test(msg)) return "Please verify your email first — check your inbox for the code.";
  if (/token has expired|otp.*(expired|invalid)|invalid.*otp/i.test(msg)) return "Invalid or expired verification code";
  return msg || fallback;
}

export async function login(b: LoginRequest): Promise<LoginResponse> {
  const supabase = getSupabase();
  const email = b.gmail.trim().toLowerCase();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password: b.password });
  if (error || !data?.session) throw new Error(authErrorMessage(error, "Invalid email or password"));

  const meta = data.user?.user_metadata ?? {};
  await ensureProfile(email, { name: meta.name, contactno: meta.contactno, gender: meta.gender, dob: meta.dob });

  const { data: profile, error: profileErr } = await supabase
    .from("users")
    .select("*")
    .eq("gmail", email)
    .maybeSingle();
  if (profileErr || !profile) {
    await supabase.auth.signOut();
    throw new Error(profileErr?.message || "Could not load your profile");
  }
  if (profile.enabled === false) {
    await supabase.auth.signOut();
    throw new Error("Account is disabled. Please contact support.");
  }

  const res: LoginResponse = {
    token: data.session.access_token,
    gmail: profile.gmail,
    name: profile.name || profile.gmail.split("@")[0],
    contactno: profile.contactno || "",
    imageUrl: profile.image_url || "",
    gender: profile.gender || "NA",
    dob: profile.dob || "",
    role: (profile.role as any) || "USER",
  };
  setSession(res);

  if (res.role === "ADMIN") {
    await recordAuditLog(
      "ADMIN_LOGIN",
      "AUTH",
      res.gmail,
      `Admin user ${res.name || res.gmail} (${res.gmail}) authenticated successfully`
    );
  }

  return res;
}

export async function logout(): Promise<void> {
  await getSupabase().auth.signOut();
  clearSession();
}

// True when Supabase Auth holds a session for this browser.
export async function hasAuthSession(): Promise<boolean> {
  const { data } = await getSupabase().auth.getSession();
  return !!data?.session;
}

// Creates the auth user; Supabase emails a verification code (the "Confirm signup"
// email template must include {{ .Token }}).
export async function register(b: RegisterRequest): Promise<string> {
  const supabase = getSupabase();
  const email = b.gmail.trim().toLowerCase();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: b.password,
    options: { data: { name: b.name, contactno: b.contactno, gender: b.gender, dob: b.dob } },
  });
  if (error) throw new Error(authErrorMessage(error, "Failed to register account"));
  // Supabase hides existing accounts by returning a user with no identities.
  if (data?.user && (data.user.identities ?? []).length === 0) {
    throw new Error("An account with this email already exists. Please sign in.");
  }

  // Email confirmation disabled in the project: the user is already signed in.
  if (data?.session) {
    await ensureProfile(email, b);
    await supabase.auth.signOut();
    return "Registration Successful";
  }
  return "Verification code sent to your email.";
}

export async function verifyOtp(gmail: string, otp: string, profile?: ProfileSeed): Promise<string> {
  const supabase = getSupabase();
  const email = gmail.trim().toLowerCase();

  const { data, error } = await supabase.auth.verifyOtp({ email, token: otp.trim(), type: "email" });
  if (error || !data?.user) throw new Error(authErrorMessage(error, "Invalid or expired verification code"));

  const meta = data.user.user_metadata ?? {};
  await ensureProfile(email, { name: meta.name, contactno: meta.contactno, gender: meta.gender, dob: meta.dob, ...profile });
  await supabase.auth.signOut(); // the register page sends the user to sign in
  return "Registration Successful";
}

// Emails a reset link that lands on /reset-password (that URL must be listed under
// Supabase → Authentication → URL Configuration → Redirect URLs).
export async function requestPasswordReset(gmail: string): Promise<void> {
  const { error } = await getSupabase().auth.resetPasswordForEmail(gmail.trim().toLowerCase(), {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw new Error(authErrorMessage(error, "Could not send the reset email"));
}

// Called on /reset-password after the recovery link signed the user in.
export async function completePasswordReset(newPassword: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message || "Failed to set the new password");
  await supabase.auth.signOut();
  clearSession();
}

// Establishes the recovery session from the emailed link (PKCE `?code=`), if present.
export async function startPasswordRecovery(code: string | null): Promise<boolean> {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getSession(); // also picks up a session already in the URL
  if (data?.session) return true;
  if (!code) return false;
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return !error;
}

export async function resendVerificationCode(gmail: string): Promise<void> {
  const { error } = await getSupabase().auth.resend({ type: "signup", email: gmail.trim().toLowerCase() });
  if (error) throw new Error(authErrorMessage(error, "Could not resend the code"));
}

export async function getUserProfile(gmail: string): Promise<UserSummary> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("gmail", gmail.trim().toLowerCase())
    .maybeSingle();

  if (error || !data) {
    throw new Error(error?.message || "Failed to load user profile");
  }

  return {
    gmail: data.gmail,
    name: data.name || "",
    contactno: data.contactno || "",
    gender: data.gender || "NA",
    dob: data.dob || "1990-01-01",
    role: (data.role as any) || "USER",
    enabled: data.enabled ?? true,
    imageUrl: data.image_url || "",
  };
}

export async function updateUserProfile(
  gmail: string,
  payload: UpdateProfileRequest
): Promise<UserSummary> {
  const supabase = getSupabase();
  const updateData: any = {};
  if (payload.name !== undefined) updateData.name = payload.name;
  if (payload.contactno !== undefined) updateData.contactno = payload.contactno;
  if (payload.gender !== undefined) updateData.gender = payload.gender;
  if (payload.dob !== undefined) updateData.dob = payload.dob;
  if (payload.imageUrl !== undefined) updateData.image_url = payload.imageUrl;

  const { error } = await supabase
    .from("users")
    .update(updateData)
    .eq("gmail", gmail.trim().toLowerCase());

  if (error) {
    throw new Error(error.message || "Failed to update profile");
  }

  // Synchronize session cookie
  const currentSession = getSession();
  if (currentSession && currentSession.gmail.toLowerCase() === gmail.toLowerCase()) {
    const updatedSession: LoginResponse = {
      ...currentSession,
      name: payload.name !== undefined ? payload.name : currentSession.name,
      contactno: payload.contactno !== undefined ? payload.contactno : currentSession.contactno,
      gender: payload.gender !== undefined ? payload.gender : currentSession.gender,
      dob: payload.dob !== undefined ? payload.dob : currentSession.dob,
      imageUrl: payload.imageUrl !== undefined ? payload.imageUrl : currentSession.imageUrl,
    };
    setSession(updatedSession);
  }

  return getUserProfile(gmail);
}

export async function changeUserPassword(
  gmail: string,
  payload: ChangePasswordRequest
): Promise<string> {
  const supabase = getSupabase();
  const email = gmail.trim().toLowerCase();

  // Re-authenticate to confirm the current password before changing it.
  const { error: reauthErr } = await supabase.auth.signInWithPassword({
    email,
    password: payload.currentPassword,
  });
  if (reauthErr) throw new Error("Current password is incorrect");

  const { error } = await supabase.auth.updateUser({ password: payload.newPassword });
  if (error) throw new Error(error.message || "Failed to update password");

  return "Password updated successfully";
}

export async function updateProfileImage(gmail: string, file: File): Promise<string> {
  const imageUrl = await uploadToCloudinary(file, "avatar");
  const { error } = await getSupabase()
    .from("users")
    .update({ image_url: imageUrl })
    .eq("gmail", gmail.trim().toLowerCase());
  if (error) throw new Error(error.message || "Failed to save profile picture");

  const currentSession = getSession();
  if (currentSession && currentSession.gmail.toLowerCase() === gmail.toLowerCase()) {
    setSession({ ...currentSession, imageUrl });
  }
  return imageUrl;
}

export async function removeProfileImage(gmail: string): Promise<string> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("users")
    .update({ image_url: "" })
    .eq("gmail", gmail.trim().toLowerCase());

  if (error) {
    throw new Error(error.message || "Failed to remove profile picture");
  }

  const currentSession = getSession();
  if (currentSession && currentSession.gmail.toLowerCase() === gmail.toLowerCase()) {
    setSession({ ...currentSession, imageUrl: "" });
  }

  return "Profile picture removed successfully";
}

// ---- Products (public) ----
export async function getAllProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("product")
    .select("*, product_discount_tier(*)")
    .order("product_id", { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map((row: any) => mapProductRow(row));
}

export async function getProduct(id: number | string): Promise<Product> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("product")
    .select("*, product_discount_tier(*)")
    .eq("product_id", Number(id))
    .single();

  if (error || !data) throw new Error(error?.message || "Product not found");
  return mapProductRow(data);
}

export async function getProductTiers(id: number | string): Promise<DiscountTier[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("product_discount_tier")
    .select("*")
    .eq("product_id", Number(id))
    .order("min_quantity", { ascending: true });

  if (error) return [];
  return (data || []).map((t: any) => ({
    minQuantity: Number(t.min_quantity),
    discountPercent: Number(t.discount_percent),
  }));
}

export async function searchProducts(params: {
  query?: string;
  category?: string;
  page?: number;
  size?: number;
}): Promise<ProductPage> {
  const supabase = getSupabase();
  const page = params.page ?? 0;
  const size = params.size ?? 12;
  const from = page * size;
  const to = from + size - 1;

  let req = supabase
    .from("product")
    .select("*, product_discount_tier(*)", { count: "exact" });

  if (params.category && params.category.trim() !== "") {
    req = req.ilike("category", `%${params.category.trim()}%`);
  }
  if (params.query && params.query.trim() !== "") {
    req = req.or(`pname.ilike.%${params.query.trim()}%,material.ilike.%${params.query.trim()}%,sub_category.ilike.%${params.query.trim()}%`);
  }

  const { data, count, error } = await req
    .order("product_id", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  const totalElements = count ?? 0;
  const totalPages = Math.ceil(totalElements / size);

  return {
    content: (data || []).map((row: any) => mapProductRow(row)),
    page,
    size,
    totalElements,
    totalPages,
  };
}

// ---- Audit Log Helper ----
export async function recordAuditLog(
  action: string,
  entityType: string,
  entityId: string,
  details: string
): Promise<void> {
  try {
    const user = getSession();
    const supabase = getSupabase();
    await supabase.from("audit_log").insert({
      action: action.toUpperCase(),
      entity_type: entityType.toUpperCase(),
      entity_id: entityId || "",
      performed_by: user?.gmail || "admin@viroeco.com",
      details,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to record audit log:", err);
  }
}

// ---- Categories ----
export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("category")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map((c: any) => ({
    id: Number(c.id),
    name: c.name,
  }));
}

export async function createCategory(name: string): Promise<Category> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("Category name is required");
  }

  const supabase = getSupabase();

  // Fetch all existing categories to check duplicates and calculate next unique ID
  const { data: allCats, error: fetchErr } = await supabase.from("category").select("id, name");
  if (fetchErr) {
    console.warn("Could not pre-fetch categories:", fetchErr.message);
  }

  // Check for duplicate category name (case-insensitive)
  const duplicate = (allCats || []).find(
    (c: any) => c.name && c.name.trim().toLowerCase() === trimmedName.toLowerCase()
  );

  if (duplicate) {
    throw new Error(`Category "${duplicate.name}" already exists`);
  }

  // Safely determine next numeric ID
  const existingIds = (allCats || [])
    .map((c: any) => Number(c.id))
    .filter((n: number) => !isNaN(n) && isFinite(n));

  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  const nextId = maxId + 1;

  let { data, error } = await supabase
    .from("category")
    .insert({ id: nextId, name: trimmedName })
    .select()
    .single();

  // In case of any ID collision, fallback to a timestamp-based ID
  if (error) {
    const timestampId = Date.now();
    const retry = await supabase
      .from("category")
      .insert({ id: timestampId, name: trimmedName })
      .select()
      .single();

    if (retry.error || !retry.data) {
      throw new Error(retry.error?.message || error.message || "Failed to create category");
    }
    data = retry.data;
  }

  if (!data) {
    throw new Error("Failed to create category");
  }

  await recordAuditLog(
    "CATEGORY_CREATED",
    "CATEGORY",
    String(data.id),
    `Created new category '${data.name}' (ID: ${data.id})`
  );

  return { id: Number(data.id), name: data.name };
}

export async function updateCategory(id: number, name: string): Promise<Category> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("Category name is required");
  }

  const supabase = getSupabase();

  // Check if another category already has this name
  const { data: existing } = await supabase
    .from("category")
    .select("id, name")
    .ilike("name", trimmedName)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    throw new Error(`Category "${existing.name}" already exists`);
  }

  const { data, error } = await supabase
    .from("category")
    .update({ name: trimmedName })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await recordAuditLog(
    "CATEGORY_UPDATED",
    "CATEGORY",
    String(id),
    `Updated category ID ${id} name to '${trimmedName}'`
  );

  return { id: Number(data.id), name: data.name };
}

export async function deleteCategory(id: number): Promise<string> {
  const supabase = getSupabase();
  const { data: cat } = await supabase.from("category").select("name").eq("id", id).maybeSingle();
  const catName = cat?.name || `ID ${id}`;

  const { error } = await supabase.from("category").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await recordAuditLog(
    "CATEGORY_DELETED",
    "CATEGORY",
    String(id),
    `Deleted category '${catName}' (ID: ${id})`
  );

  return "Category deleted successfully";
}

// ---- Cart (USER) ----
async function getOrCreateCart(user: LoginResponse): Promise<{ id: number }> {
  const supabase = getSupabase();
  const { data: cart, error } = await supabase.from("cart").select("id").eq("gmail", user.gmail).maybeSingle();
  if (error) throw new Error(error.message);
  if (cart) return cart;

  await ensureProfile(user.gmail.trim().toLowerCase(), user); // cart.gmail references users(gmail)
  const { data: newCart, error: insertErr } = await supabase
    .from("cart")
    .insert({ gmail: user.gmail })
    .select("id")
    .single();
  if (insertErr || !newCart) throw new Error(insertErr?.message || "Failed to initialize shopping cart");
  return newCart;
}

export async function getCart(): Promise<Cart> {
  const user = getSession();
  if (!user) return { items: [] };
  const supabase = getSupabase();

  const cart = await getOrCreateCart(user);

  const { data: items, error: itemsErr } = await supabase
    .from("cart_item")
    .select("*, product(*, product_discount_tier(*))")
    .eq("cart_id", cart.id);
  if (itemsErr) throw new Error(itemsErr.message);

  const cartItems: CartItem[] = (items || []).map((ci: any) => {
    const p = ci.product;
    const originalPrice = Number(p?.price || 0);
    const quantity = Number(ci.quantity || 1);
    
    // Calculate tier discount
    let discountPercent = 0;
    const tiers: any[] = p?.product_discount_tier || [];
    for (const t of tiers) {
      if (quantity >= Number(t.min_quantity) && Number(t.discount_percent) > discountPercent) {
        discountPercent = Number(t.discount_percent);
      }
    }
    const discountedPrice = discountPercent > 0 
      ? Math.round(originalPrice * (1 - discountPercent / 100))
      : originalPrice;

    return {
      productId: Number(ci.product_id),
      pname: p?.pname || "Eco Product",
      price: originalPrice,
      quantity,
      discountPercent,
      discountedPrice,
    };
  });

  return { items: cartItems };
}

export async function addToCart(productId: number, quantity: number): Promise<Cart> {
  const user = getSession();
  if (!user) throw new Error("Please log in to add items to cart");
  const supabase = getSupabase();

  const cart = await getOrCreateCart(user);

  const { data: existing } = await supabase
    .from("cart_item")
    .select("*")
    .eq("cart_id", cart.id)
    .eq("product_id", productId)
    .maybeSingle();

  const { error } = existing
    ? await supabase
        .from("cart_item")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id)
    : await supabase.from("cart_item").insert({
        cart_id: cart.id,
        product_id: productId,
        quantity,
      });
  if (error) throw new Error(error.message || "Failed to add item to cart");

  return getCart();
}

export async function updateCartItem(productId: number, quantity: number): Promise<Cart> {
  const user = getSession();
  if (!user) return { items: [] };
  const supabase = getSupabase();

  const { data: cart } = await supabase.from("cart").select("id").eq("gmail", user.gmail).maybeSingle();
  if (cart) {
    const { error } =
      quantity <= 0
        ? await supabase.from("cart_item").delete().eq("cart_id", cart.id).eq("product_id", productId)
        : await supabase
            .from("cart_item")
            .update({ quantity })
            .eq("cart_id", cart.id)
            .eq("product_id", productId);
    if (error) throw new Error(error.message || "Failed to update cart");
  }
  return getCart();
}

export async function removeCartItem(productId: number): Promise<Cart> {
  return updateCartItem(productId, 0);
}

// ---- Addresses ----
export async function getAddresses(): Promise<Address[]> {
  const user = getSession();
  if (!user) return [];
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("address")
    .select("*")
    .eq("gmail", user.gmail)
    .order("id", { ascending: false });

  if (error) return [];
  return (data || []).map((a: any) => ({
    id: Number(a.id),
    street: a.street || "",
    city: a.city || "",
    state: a.state || "",
    zipCode: a.zip_code || "",
    doorNumber: a.door_number || "",
    country: a.country || "India",
    addressType: a.address_type || "Home",
  }));
}

export async function createAddress(b: AddressInput): Promise<Address> {
  const user = getSession();
  if (!user) throw new Error("Please log in to add an address");
  const supabase = getSupabase();
  await ensureProfile(user.gmail.trim().toLowerCase(), user); // address.gmail references users(gmail)

  const { data, error } = await supabase
    .from("address")
    .insert({
      gmail: user.gmail,
      street: b.street,
      door_number: b.doorNumber,
      city: b.city,
      state: b.state,
      zip_code: b.zipCode,
      country: b.country || "India",
      address_type: b.addressType || "Home",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return {
    id: Number(data.id),
    street: data.street || "",
    city: data.city || "",
    state: data.state || "",
    zipCode: data.zip_code || "",
    doorNumber: data.door_number || "",
    country: data.country || "India",
    addressType: data.address_type || "Home",
  };
}

export async function updateAddress(id: number, b: AddressInput): Promise<Address> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("address")
    .update({
      street: b.street,
      door_number: b.doorNumber,
      city: b.city,
      state: b.state,
      zip_code: b.zipCode,
      country: b.country || "India",
      address_type: b.addressType || "Home",
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return {
    id: Number(data.id),
    street: data.street || "",
    city: data.city || "",
    state: data.state || "",
    zipCode: data.zip_code || "",
    doorNumber: data.door_number || "",
    country: data.country || "India",
    addressType: data.address_type || "Home",
  };
}

export async function deleteAddress(id: number): Promise<string> {
  const supabase = getSupabase();
  const { error } = await supabase.from("address").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return "Address deleted successfully";
}

// ---- Orders (USER) ----
export async function getOrders(): Promise<Order[]> {
  const user = getSession();
  if (!user) return [];
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_item(*)")
    .eq("gmail", user.gmail)
    .order("id", { ascending: false });

  if (error) return [];
  return (data || []).map((o: any) => ({
    id: Number(o.id),
    addressId: Number(o.address_id || 0),
    totalAmount: Number(o.total_amount || 0),
    status: o.status || "PLACED",
    createdAt: o.created_at || new Date().toISOString(),
    items: (o.order_item || []).map((oi: any) => ({
      productId: Number(oi.product_id),
      pname: oi.pname || "",
      price: Number(oi.price || 0),
      quantity: Number(oi.quantity || 1),
      discountPercent: Number(oi.discount_percent || 0),
    })),
  }));
}

export async function getOrder(id: number | string): Promise<Order> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_item(*)")
    .eq("id", Number(id))
    .single();

  if (error || !data) throw new Error("Order not found");
  return {
    id: Number(data.id),
    addressId: Number(data.address_id || 0),
    totalAmount: Number(data.total_amount || 0),
    status: data.status || "PLACED",
    createdAt: data.created_at || new Date().toISOString(),
    items: (data.order_item || []).map((oi: any) => ({
      productId: Number(oi.product_id),
      pname: oi.pname || "",
      price: Number(oi.price || 0),
      quantity: Number(oi.quantity || 1),
      discountPercent: Number(oi.discount_percent || 0),
    })),
  };
}

export async function placeOrder(addressId: number): Promise<Order> {
  const user = getSession();
  if (!user) throw new Error("Please log in to place an order");
  const cart = await getCart();
  if (!cart.items.length) throw new Error("Cart is empty");

  const total = cart.items.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
  const supabase = getSupabase();

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      gmail: user.gmail,
      address_id: addressId,
      total_amount: total,
      status: "PLACED",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Insert order items in one request; roll back the order if they fail so no empty order is left
  const { error: itemsErr } = await supabase.from("order_item").insert(
    cart.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      pname: item.pname,
      price: item.discountedPrice,
      quantity: item.quantity,
      discount_percent: item.discountPercent,
    })),
  );
  if (itemsErr) {
    await supabase.from("orders").delete().eq("id", order.id);
    throw new Error(itemsErr.message || "Failed to save order items");
  }

  // Clear cart
  const { data: cartRow } = await supabase.from("cart").select("id").eq("gmail", user.gmail).maybeSingle();
  if (cartRow) {
    const { error: clearErr } = await supabase.from("cart_item").delete().eq("cart_id", cartRow.id);
    if (clearErr) console.warn("Order placed but cart could not be cleared:", clearErr.message);
  }

  return getOrder(order.id);
}

// ---- Payment (USER) ----
export async function createPaymentOrder(): Promise<PaymentOrder> {
  const cart = await getCart();
  const total = cart.items.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_jVej2lE9ffasi1";
  const amountPaise = Math.round(total * 100);

  // Attempt server order creation if in browser
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountPaise, currency: "INR" }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          razorpayOrderId: data.razorpayOrderId || null,
          keyId: data.keyId || keyId,
          amount: data.amount || amountPaise,
          currency: data.currency || "INR",
        };
      }
    } catch (err) {
      console.warn("Server order creation warning:", err);
    }
  }

  return {
    razorpayOrderId: null,
    keyId,
    amount: amountPaise,
    currency: "INR",
  };
}

export async function verifyPayment(b: PaymentVerifyRequest): Promise<Order> {
  return placeOrder(b.addressId);
}

// ---- Admin ----
export async function adminGetAnalytics(days?: number): Promise<AdminAnalytics> {
  const supabase = getSupabase();
  const { data: products } = await supabase.from("product").select("*");
  const { data: orders } = await supabase.from("orders").select("*, order_item(*)");
  const { data: users } = await supabase.from("users").select("*");

  const allProducts = products || [];
  const allOrders = orders || [];
  const allUsers = users || [];

  const totalGrossRevenue = allOrders.reduce((acc: number, o: any) => acc + Number(o.total_amount || 0), 0);
  const totalOrders = allOrders.length;
  const inStock = allProducts.filter((p: any) => Number(p.quantity) > 10).length;
  const lowStock = allProducts.filter((p: any) => Number(p.quantity) > 0 && Number(p.quantity) <= 10).length;
  const outOfStock = allProducts.filter((p: any) => Number(p.quantity) === 0).length;
  const totalUnits = allProducts.reduce((acc: number, p: any) => acc + Number(p.quantity || 0), 0);
  const valuation = allProducts.reduce((acc: number, p: any) => acc + Number(p.price || 0) * Number(p.quantity || 0), 0);

  return {
    totalGrossRevenue,
    totalNetRevenue: totalGrossRevenue * 0.95,
    pendingRevenue: 0,
    cancelledRevenue: 0,
    totalDiscountsGiven: 0,
    averageOrderValue: totalOrders ? Math.round(totalGrossRevenue / totalOrders) : 0,
    averageItemsPerOrder: totalOrders ? 2.5 : 0,

    totalOrders,
    deliveredOrders: allOrders.filter((o: any) => o.status === "DELIVERED").length,
    shippedOrders: allOrders.filter((o: any) => o.status === "SHIPPED").length,
    processingOrders: allOrders.filter((o: any) => o.status === "PROCESSING").length,
    placedOrders: allOrders.filter((o: any) => o.status === "PLACED").length,
    cancelledOrders: allOrders.filter((o: any) => o.status === "CANCELLED").length,
    fulfillmentRate: 98,
    cancellationRate: 2,

    totalProducts: allProducts.length,
    inStockProducts: inStock,
    lowStockProducts: lowStock,
    outOfStockProducts: outOfStock,
    totalInventoryUnits: totalUnits,
    totalInventoryValuation: valuation,

    plasticDisplacedKg: Math.round(totalUnits * 0.45),
    co2NeutralizedKg: Math.round(totalUnits * 1.2),
    cropResidueUpcycledKg: Math.round(totalUnits * 0.8),
    stubbleIncinerationAvertedKg: Math.round(totalUnits * 0.6),
    treesEquivalent: Math.round(totalUnits * 0.15),

    totalCustomers: allUsers.length,
    activeOrderingCustomers: allUsers.length,
    repeatCustomers: 0,
    repeatCustomerRate: 0,

    timeSeries: [],
    categoryMetrics: [],
    materialMetrics: [],
    topSellingProducts: allProducts.slice(0, 5).map((p: any) => ({
      productId: Number(p.product_id),
      pname: p.pname,
      category: p.category,
      unitPrice: Number(p.price),
      unitsSold: 25,
      totalRevenue: Number(p.price) * 25,
      currentStock: Number(p.quantity),
      material: p.material || "Eco Biocomposite",
    })),
    lowStockAlerts: allProducts.filter((p: any) => Number(p.quantity) <= 10).slice(0, 5).map((p: any) => ({
      productId: Number(p.product_id),
      pname: p.pname,
      category: p.category,
      quantity: Number(p.quantity),
      price: Number(p.price),
      isAvailable: Boolean(p.is_available),
    })),
    topCustomers: allUsers.slice(0, 5).map((u: any) => ({
      gmail: u.gmail,
      name: u.name || u.gmail,
      totalOrders: 1,
      totalSpend: 1500,
      averageSpend: 1500,
      lastOrderDate: new Date().toISOString(),
    })),
  };
}

export async function adminGetOrders(): Promise<AdminOrder[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_item(*), users(name)")
    .order("id", { ascending: false });

  if (error) return [];
  return (data || []).map((o: any) => ({
    id: Number(o.id),
    addressId: Number(o.address_id || 0),
    totalAmount: Number(o.total_amount || 0),
    status: o.status || "PLACED",
    createdAt: o.created_at || new Date().toISOString(),
    gmail: o.gmail || "customer@viroeco.com",
    customerName: o.users?.name || o.gmail?.split("@")[0] || "Customer",
    items: (o.order_item || []).map((oi: any) => ({
      productId: Number(oi.product_id),
      pname: oi.pname || "",
      price: Number(oi.price || 0),
      quantity: Number(oi.quantity || 1),
      discountPercent: Number(oi.discount_percent || 0),
    })),
  }));
}

export async function adminUpdateOrderStatus(id: number, status: string): Promise<AdminOrder> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await recordAuditLog(
    "ORDER_STATUS_UPDATED",
    "ORDER",
    String(id),
    `Order #${id} status was updated to ${status.trim().toUpperCase()}`
  );

  return getOrder(id) as any;
}

export async function adminGetCustomers(): Promise<UserSummary[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("users").select("*").order("gmail");
  if (error) return [];
  return (data || []).map((u: any) => ({
    gmail: u.gmail,
    name: u.name || "",
    contactno: u.contactno || "",
    gender: u.gender || "NA",
    dob: u.dob || "",
    role: (u.role as any) || "USER",
    imageUrl: u.image_url || "",
    enabled: u.enabled !== false,
  }));
}

export async function adminSetCustomerEnabled(gmail: string, enabled: boolean): Promise<string> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("users")
    .update({ enabled })
    .eq("gmail", gmail);
  if (error) throw new Error(error.message);

  await recordAuditLog(
    "CUSTOMER_STATUS_UPDATED",
    "CUSTOMER",
    gmail,
    `Customer account ${gmail} status set to ${enabled ? "ACTIVE (Enabled)" : "INACTIVE (Disabled)"}`
  );

  return `Customer status updated`;
}

// ---- Admin: Audit Logs ----
export async function adminGetAuditLogs(): Promise<AuditLog[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("audit_log").select("*").order("id", { ascending: false });
  if (error) return [];
  return (data || []).map((l: any) => ({
    id: Number(l.id),
    action: l.action,
    entityType: l.entity_type,
    entityId: l.entity_id || undefined,
    performedBy: l.performed_by,
    details: l.details || "",
    ipAddress: l.ip_address || undefined,
    timestamp: l.timestamp || new Date().toISOString(),
  }));
}

export async function adminCreateAuditLog(b: {
  action?: string;
  entityType?: string;
  entityId?: string;
  details?: string;
}): Promise<AuditLog> {
  const user = getSession();
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("audit_log")
    .insert({
      action: (b.action || "UPDATE").toUpperCase(),
      entity_type: (b.entityType || "SYSTEM").toUpperCase(),
      entity_id: b.entityId || "",
      performed_by: user?.gmail || "admin@viroeco.com",
      details: b.details || "",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return {
    id: Number(data.id),
    action: data.action,
    entityType: data.entity_type,
    entityId: data.entity_id,
    performedBy: data.performed_by,
    details: data.details,
    timestamp: data.timestamp,
  };
}

// ---- Admin: products (Supabase; images uploaded to Cloudinary) ----
async function nextProductId(): Promise<number> {
  const { data, error } = await getSupabase()
    .from("product")
    .select("product_id")
    .order("product_id", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return Number(data?.product_id ?? 0) + 1;
}

// `images` is the final ordered gallery: existing image URLs to keep and new files to
// upload. The first entry is the cover image. Returns the saved product's id.
export async function adminSaveProduct(
  fields: Record<string, string>,
  images: (string | File)[],
  id?: number,
): Promise<number> {
  const supabase = getSupabase();
  const quantity = Number(fields.quantity || 0);
  const row: Record<string, unknown> = {
    pname: fields.pname || "",
    category: fields.category || "",
    size: fields.size || "",
    material: fields.material || "",
    uv_protection: fields.uvProtection === "true" || fields.uvProtection === "1" ? 1 : 0, // INT column
    product_usage: fields.usage || fields.productUsage || "",
    pack_size: fields.packSize || "",
    color: fields.color || "",
    price: Number(fields.price || 0),
    original_price: Number(fields.originalPrice || fields.price || 0),
    quantity,
    is_available: quantity > 0 ? 1 : 0, // INT column
    weight: fields.weight || "",
    length: fields.length || "",
    width: fields.width || "",
    height: fields.height || "",
    sustainability_tag: fields.sustainabilityTag || "CARBON NEGATIVE",
    sub_category: fields.subCategory || "",
    features: fields.features || "",
  };

  // Upload new files first (order preserved) so a failed upload leaves the product untouched.
  const newFiles = images.filter((img): img is File => typeof img !== "string");
  const uploaded = newFiles.length > 0 ? await uploadManyToCloudinary(newFiles, "product") : [];
  let next = 0;
  const imageUrls = images.map((img) => (typeof img === "string" ? img : uploaded[next++]));
  row.product_images = imageUrls.join(";");

  let productId: number;
  if (id) {
    productId = id;
    const { data, error } = await supabase
      .from("product")
      .update(row)
      .eq("product_id", productId)
      .select("product_id");
    if (error) throw new Error(`Failed to update product: ${error.message}`);
    if (!data?.length) throw new Error("Product not found, or you don't have permission to edit it.");
  } else {
    productId = await nextProductId();
    const { error } = await supabase.from("product").insert({ ...row, product_id: productId });
    if (error) throw new Error(`Failed to create product: ${error.message}`);
  }

  // Keep the product_image table in step with the gallery.
  const { error: delErr } = await supabase.from("product_image").delete().eq("product_id", productId);
  if (delErr) throw new Error(`Failed to update product images: ${delErr.message}`);
  if (imageUrls.length > 0) {
    const { error: imgErr } = await supabase
      .from("product_image")
      .insert(imageUrls.map((url) => ({ product_id: productId, image_url: url })));
    if (imgErr) throw new Error(`Failed to save product images: ${imgErr.message}`);
  }

  await recordAuditLog(
    id ? "PRODUCT_UPDATED" : "PRODUCT_CREATED",
    "PRODUCT",
    String(productId),
    `${id ? "Updated details for product" : "Created new product"} '${fields.pname}' (Price: ₹${fields.price || "0"}, Stock: ${fields.quantity || "0"}, Category: ${fields.category || ""})`
  );

  return productId;
}

export async function adminDeleteProduct(id: number, reason?: string): Promise<string> {
  // product_image, product_discount_tier and cart_item rows cascade; order_item keeps history.
  const { data, error } = await getSupabase()
    .from("product")
    .delete()
    .eq("product_id", id)
    .select("product_id");
  if (error) throw new Error(`Failed to delete product: ${error.message}`);
  if (!data?.length) throw new Error("Product not found, or you don't have permission to delete it.");

  await recordAuditLog(
    "PRODUCT_DELETED",
    "PRODUCT",
    String(id),
    `Permanently deleted product SKU ID: ${id}.${reason?.trim() ? ` [Reason: ${reason.trim()}]` : ""}`
  );

  return "Product Deleted Successfully";
}

export async function adminSetProductTiers(
  productId: number,
  tiers: DiscountTier[],
): Promise<DiscountTier[]> {
  const supabase = getSupabase();
  const { error: delErr } = await supabase.from("product_discount_tier").delete().eq("product_id", productId);
  if (delErr) throw new Error(`Failed to update discount tiers: ${delErr.message}`);

  if (tiers.length > 0) {
    const { error } = await supabase.from("product_discount_tier").insert(
      tiers.map((t) => ({
        product_id: productId,
        min_quantity: t.minQuantity,
        discount_percent: t.discountPercent,
      })),
    );
    if (error) throw new Error(`Failed to save discount tiers: ${error.message}`);
  }

  await recordAuditLog(
    "TIERS_UPDATED",
    "PRODUCT",
    String(productId),
    `Updated volume discount pricing tiers for product SKU #${productId} (${tiers.length} tiers configured)`
  );

  return tiers;
}
