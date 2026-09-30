<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Viroeco Frontend Agent Guidelines

## ⚠️ STRICT MANDATE: ZERO FAKE DATA & ZERO STATIC DATA FILES

1. **NEVER ADD FAKE DATA OR FETCH FAKE DATA**:
   - All product catalogs, categories, showcase items, customer data, orders, cart items, addresses, and statistics **MUST** strictly come from the MySQL database through the Spring Boot backend REST APIs.
   - **DO NOT** create or use static JSON files (e.g., `eha-products.json`, `eha-categories.json`, `mock-data.json`) or in-memory mock product lists for catalog rendering.

2. **DATABASE-FIRST DYNAMIC ARCHITECTURE**:
   - Storefront & Admin pages must query live endpoints via `@/lib/endpoints` (`getAllProducts()`, `searchProducts()`, `getProduct()`, `getCategories()`, `adminGetOrders()`, etc.).
   - All categories and products are populated and managed in MySQL (`viroecodb`).

3. **GRACEFUL EMPTY & ERROR STATES**:
   - If the backend is loading, display skeleton loaders.
   - If a table or query is empty or unavailable, render a clear, clean empty state (e.g., "No products found" / "No categories yet") or error notification.
   - **NEVER** silently fall back to hardcoded mock products, fake orders, or fake customers.

4. **API BASE CONFIGURATION**:
   - Next.js frontend connects to Spring Boot backend via `NEXT_PUBLIC_API_BASE` (default: `http://localhost:2420`).
   - All mutation endpoints invalidate their corresponding React Query keys (`["products"]`, `["categories"]`, `["admin", "orders"]`, etc.) to trigger fresh database fetches.
