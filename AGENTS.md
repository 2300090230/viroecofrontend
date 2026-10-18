<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Viroeco Frontend Agent Guidelines

## Architecture: Next.js → Spring Boot → Supabase Postgres

1. **ALL DATA COMES FROM THE SPRING BOOT BACKEND**:
   - Pages, components and hooks call `@/lib/endpoints` (`getAllProducts()`, `searchProducts()`, `getCart()`, `adminGetOrders()`, …), which call the backend through `@/lib/api-client`.
   - **Never** add a database client, Supabase SDK, direct Cloudinary upload or Razorpay secret call to the frontend. Image uploads are multipart requests to the backend; payments are created and verified by the backend.
   - Browsers call same-origin `/api/*`; `next.config.ts` rewrites it to `BACKEND_URL`. Server components call `BACKEND_URL` directly.

2. **AUTH**:
   - The backend sets HttpOnly cookies (`ve_at` access, `ve_rt` refresh, `ve_role` role hint). Page scripts never see tokens; nothing about the user is kept in browser storage.
   - `providers/auth-provider.tsx` learns who is signed in from `GET /api/auth/me`; `api-client` refreshes an expired session once and emits `ve:session-expired` otherwise.
   - `proxy.ts` redirects using `ve_role` for UX only — the backend enforces authentication and roles on every request.

3. **ZERO FAKE DATA**:
   - Catalogue, customers, orders, carts, addresses and statistics must come from the backend. Do not create static JSON files or in-memory mock lists, and never invent metrics.

4. **GRACEFUL EMPTY & ERROR STATES**:
   - Show skeletons while loading, clear empty states when there is no data, and the backend's error `message` (from `ApiError`) when a call fails. Never fall back to hardcoded data.

5. **CONFIGURATION** (`.env`, template in `.env.template`):
   - `BACKEND_URL` (server-only), `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BUSINESS_*`. The frontend holds no secrets.
   - Mutations invalidate their React Query keys (`["cart"]`, `["products"]`, `["categories"]`, `["admin", "orders"]`, …).
