"use client";

import { useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { SlidersHorizontal, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductCard } from "@/components/product-card";
import { DataTablePagination } from "@/components/ui/pagination";
import { getCategories, searchProducts, type ProductSort } from "@/lib/endpoints";
import { DEFAULT_PAGE_SIZE, parseCatalogFilters, type CatalogFilters } from "@/lib/catalog-filters";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

const SORTS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

const MATERIALS = [
  { value: "rice", label: "Rice husk" },
  { value: "bamboo", label: "Bamboo" },
];


function toSearch(f: CatalogFilters) {
  const q = new URLSearchParams();
  if (f.query) q.set("query", f.query);
  if (f.category) q.set("category", f.category);
  if (f.material) q.set("material", f.material);
  if (f.inStock) q.set("stock", "1");
  if (f.minPrice) q.set("min", f.minPrice);
  if (f.maxPrice) q.set("max", f.maxPrice);
  if (f.sort !== "newest") q.set("sort", f.sort);
  if (f.page > 0) q.set("page", String(f.page));
  if (f.size !== DEFAULT_PAGE_SIZE) q.set("size", String(f.size));
  return q.toString();
}

export function Catalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const topRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // The URL is the single source of truth, so header searches and shared links just work.
  const filters = useMemo(() => parseCatalogFilters(searchParams), [searchParams]);

  const update = (patch: Partial<CatalogFilters>, resetPage = true) => {
    const next = { ...filters, ...patch, ...(resetPage ? { page: 0 } : {}) };
    const qs = toSearch(next);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const categories = useQuery({
    queryKey: ["catalog-categories"],
    queryFn: async () => (await getCategories()).map((c) => c.name).sort(),
    staleTime: 5 * 60_000,
  });

  const products = useQuery({
    queryKey: ["products", filters],
    queryFn: () =>
      searchProducts({
        query: filters.query,
        category: filters.category,
        material: filters.material,
        inStock: filters.inStock,
        minPrice: Number(filters.minPrice) || undefined,
        maxPrice: Number(filters.maxPrice) || undefined,
        sort: filters.sort,
        page: filters.page,
        size: filters.size,
      }),
    placeholderData: keepPreviousData,
  });

  const total = products.data?.totalElements ?? 0;
  const items: Product[] = products.data?.content ?? [];
  const from = total === 0 ? 0 : filters.page * filters.size + 1;
  const to = Math.min((filters.page + 1) * filters.size, total);
  const activeChips = [
    filters.query && { key: "query", label: `“${filters.query}”` },
    filters.category && { key: "category", label: filters.category },
    filters.material && { key: "material", label: MATERIALS.find((m) => m.value === filters.material)?.label ?? filters.material },
    filters.inStock && { key: "inStock", label: "In stock" },
    (filters.minPrice || filters.maxPrice) && { key: "price", label: `₹${filters.minPrice || 0} – ₹${filters.maxPrice || "∞"}` },
  ].filter(Boolean) as { key: string; label: string }[];

  const clearChip = (key: string) =>
    update(
      key === "price"
        ? { minPrice: "", maxPrice: "" }
        : key === "inStock"
          ? { inStock: false }
          : ({ [key]: "" } as Partial<CatalogFilters>),
    );

  const sidebar = (
    <FilterPanel
      filters={filters}
      categories={categories.data ?? []}
      onChange={(patch) => update(patch)}
      onClear={() => update({ query: "", category: "", material: "", inStock: false, minPrice: "", maxPrice: "" })}
    />
  );

  return (
    <div ref={topRef} className="grid gap-8 lg:grid-cols-[256px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-36 rounded-lg border border-line bg-white p-5 shadow-card">{sidebar}</div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {products.isLoading
              ? "Loading products…"
              : total > 0
                ? `Showing ${from}–${to} of ${total} products`
                : "No products found"}
          </p>
          <div className="flex items-center gap-2">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="flex h-10 items-center gap-2 rounded-md border border-input bg-white px-3 text-sm font-medium text-ink lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                  {activeChips.length > 0 && (
                    <span className="rounded-full bg-forest px-1.5 text-[11px] text-white">{activeChips.length}</span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[86vw] max-w-sm overflow-y-auto bg-white p-5">
                <SheetTitle className="mb-4 text-lg font-semibold">Filters</SheetTitle>
                {sidebar}
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="mt-6 h-11 w-full rounded-md bg-forest text-sm font-medium text-white"
                >
                  Show {total} products
                </button>
              </SheetContent>
            </Sheet>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">Sort by</span>
              <select
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value as ProductSort })}
                className="h-10 rounded-md border border-input bg-white px-3 text-sm text-ink outline-none focus:border-forest focus:ring-2 focus:ring-forest/15"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            {activeChips.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => clearChip(c.key)}
                className="flex items-center gap-1.5 rounded-full border border-forest/25 bg-sage-wash px-3 py-1 text-xs font-medium text-forest hover:border-forest/50"
              >
                {c.label} <X className="h-3 w-3" aria-label="Remove filter" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-6">
          {products.isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-lg border border-line bg-white">
                  <Skeleton className="aspect-square w-full" />
                  <div className="space-y-2 p-4">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.isError ? (
            <EmptyState
              title="We couldn't load products"
              text="Please check your connection and try again."
              action={{ label: "Retry", onClick: () => products.refetch() }}
            />
          ) : items.length === 0 ? (
            <EmptyState
              title="No products match your filters"
              text="Try a different search term or clear some filters."
              action={activeChips.length ? { label: "Clear all filters", onClick: () => update({ query: "", category: "", material: "", inStock: false, minPrice: "", maxPrice: "" }) } : undefined}
            />
          ) : (
            <>
              <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4", products.isFetching && "opacity-70 transition-opacity")}>
                {items.map((p) => (
                  <ProductCard key={p.productId} product={p} />
                ))}
              </div>
              <div className="mt-10 border-t border-line pt-6">
                <DataTablePagination
                  page={filters.page}
                  totalPages={products.data?.totalPages ?? 0}
                  totalItems={total}
                  pageSize={filters.size}
                  pageSizeOptions={[12, 24, 48]}
                  onPageChange={(p) => {
                    update({ page: p }, false);
                    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  onPageSizeChange={(size) => update({ size })}
                  showPageSize
                  showItemCount={false}
                  itemLabel="products"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  filters,
  categories,
  onChange,
  onClear,
}: {
  filters: CatalogFilters;
  categories: string[];
  onChange: (patch: Partial<CatalogFilters>) => void;
  onClear: () => void;
}) {
  const optionCls = (active: boolean) =>
    cn(
      "flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors",
      active ? "bg-sage-wash font-medium text-forest" : "text-ink/80 hover:bg-sand",
    );

  return (
    <div className="space-y-6">
      <FilterGroup title="Categories">
        <ul className="max-h-72 space-y-0.5 overflow-y-auto pr-1">
          <li>
            <button type="button" className={optionCls(!filters.category)} onClick={() => onChange({ category: "" })}>
              All products
            </button>
          </li>
          {categories.map((c) => (
            <li key={c}>
              <button
                type="button"
                className={optionCls(filters.category === c)}
                aria-pressed={filters.category === c}
                onClick={() => onChange({ category: c })}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup title="Material">
        <div className="space-y-2.5">
          {MATERIALS.map((m) => (
            <label key={m.value} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/85">
              <input
                type="checkbox"
                checked={filters.material === m.value}
                onChange={(e) => onChange({ material: e.target.checked ? m.value : "" })}
                className="h-4 w-4 rounded border-input accent-forest"
              />
              {m.label}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price (₹)">
        <PriceRange
          key={`${filters.minPrice}-${filters.maxPrice}`}
          min={filters.minPrice}
          max={filters.maxPrice}
          onApply={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
        />
      </FilterGroup>

      <FilterGroup title="Availability">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/85">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => onChange({ inStock: e.target.checked })}
            className="h-4 w-4 rounded border-input accent-forest"
          />
          In stock only
        </label>
      </FilterGroup>

      <button type="button" onClick={onClear} className="w-full text-center text-sm font-medium text-forest hover:underline">
        Clear all
      </button>
    </div>
  );
}

function PriceRange({ min: initialMin, max: initialMax, onApply }: { min: string; max: string; onApply: (min: string, max: string) => void }) {
  // Keyed by the applied values, so local edits reset whenever the URL changes.
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);
  return (
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onApply(min, max);
          }}
        >
          <input
            inputMode="numeric"
            aria-label="Minimum price"
            placeholder="Min"
            value={min}
            onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))}
            className="h-10 w-full min-w-0 rounded-md border border-input px-3 text-sm outline-none focus:border-forest"
          />
          <span className="text-muted-foreground">–</span>
          <input
            inputMode="numeric"
            aria-label="Maximum price"
            placeholder="Max"
            value={max}
            onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))}
            className="h-10 w-full min-w-0 rounded-md border border-input px-3 text-sm outline-none focus:border-forest"
          />
          <button type="submit" className="h-10 shrink-0 rounded-md bg-forest px-3 text-sm font-medium text-white hover:bg-forest-dark">
            Go
          </button>
        </form>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line pb-5 last:border-0">
      <p className="mb-3 text-sm font-semibold text-ink">{title}</p>
      {children}
    </div>
  );
}

function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="rounded-lg border border-dashed border-line-strong bg-white px-6 py-16 text-center">
      <p className="text-lg font-semibold text-ink">{title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 inline-flex h-10 items-center rounded-md bg-forest px-4 text-sm font-medium text-white hover:bg-forest-dark"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
