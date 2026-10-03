<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Viroeco Frontend Agent Guidelines

## ⚠️ STRICT MANDATE: ZERO FAKE DATA & ZERO STATIC DATA FILES

1. **NEVER ADD FAKE DATA OR FETCH FAKE DATA**:
   - All product catalogs, categories, showcase items, customer data, orders, cart items, addresses, and statistics **MUST** strictly come from the Supabase database (Postgres) via the Supabase client.
   - **DO NOT** create or use static JSON files (e.g., `eha-products.json`, `eha-categories.json`, `mock-data.json`) or in-memory mock product lists for catalog rendering.

2. **DATABASE-FIRST DYNAMIC ARCHITECTURE**:
   - Storefront & Admin pages must query live endpoints via `@/lib/endpoints` (`getAllProducts()`, `searchProducts()`, `getProduct()`, `getCategories()`, `adminGetOrders()`, etc.).
   - All data (catalog, users, carts, orders, audit logs) lives in Supabase. Authentication is Supabase Auth; the `users` table holds profiles and roles.
   - Images (product and profile) are stored ONLY in Cloudinary, uploaded via the signed route `app/api/cloudinary/sign`; Supabase stores just the image URLs.
   - Access control is enforced by Row Level Security (`supabase_auth_rls.sql`); never rely on the client-side session cookie for authorization.
   - The Spring Boot backend / MySQL are retired — do not add calls to them.

3. **GRACEFUL EMPTY & ERROR STATES**:
   - If data is loading, display skeleton loaders.
   - If a table or query is empty or unavailable, render a clear, clean empty state (e.g., "No products found" / "No categories yet") or error notification.
   - **NEVER** silently fall back to hardcoded mock products, fake orders, or fake customers.

4. **CONFIGURATION**:
   - Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Cloudinary (server-only): `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
   - All mutation endpoints invalidate their corresponding React Query keys (`["products"]`, `["categories"]`, `["admin", "orders"]`, etc.) to trigger fresh database fetches.
