"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { DataTablePagination } from "@/components/ui/pagination";
import { getAllProducts, searchProducts, getCategories } from "@/lib/endpoints";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function Catalog({
  initialQuery = "",
  initialCategory = "",
  initialPage = 0,
  initialPageSize = 12,
}: {
  initialQuery?: string;
  initialCategory?: string;
  initialPage?: number;
  initialPageSize?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // debounce the search box
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(input);
      setPage(0);
    }, 350);
    return () => clearTimeout(t);
  }, [input]);

  // keep the URL shareable
  useEffect(() => {
    const q = new URLSearchParams();
    if (query) q.set("query", query);
    if (category) q.set("category", category);
    if (page > 0) q.set("page", String(page));
    if (pageSize !== 12) q.set("size", String(pageSize));
    const qs = q.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [query, category, page, pageSize, pathname, router]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (containerRef.current) {
      const topOffset = containerRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  // ── Category chips: dynamically loaded from DB ──
  const categoriesQuery = useQuery({
    queryKey: ["catalog-categories"],
    queryFn: async () => {
      try {
        const cats = await getCategories();
        if (Array.isArray(cats) && cats.length > 0) {
          return cats.map((c) => c.name).sort();
        }
      } catch {
        // Fallback to extracting from all products if /category is empty
      }
      try {
        const all = await getAllProducts();
        if (Array.isArray(all) && all.length > 0) {
          return Array.from(new Set(all.map((p) => p.category).filter(Boolean))).sort();
        }
      } catch {}
      return [];
    },
    staleTime: 5 * 60_000,
  });

  // ── Products: query dynamic backend search API directly ──
  const productsQuery = useQuery({
    queryKey: ["products", query, category, page, pageSize],
    queryFn: async () => {
      try {
        const result = await searchProducts({ query, category, page, size: pageSize });
        if (result && Array.isArray(result.content)) {
          return {
            content: result.content,
            totalPages: result.totalPages ?? 1,
            totalElements: result.totalElements ?? result.content.length,
          };
        }
      } catch (err) {
        console.error("Failed to load products from DB:", err);
      }
      return { content: [] as Product[], totalPages: 0, totalElements: 0 };
    },
    placeholderData: keepPreviousData,
  });

  const totalPages = productsQuery.data?.totalPages ?? 0;
  const totalElements = productsQuery.data?.totalElements ?? 0;
  const chips = useMemo(() => ["", ...(categoriesQuery.data ?? [])], [categoriesQuery.data]);

  return (
    <div ref={containerRef} className="scroll-mt-28">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search mugs, bowls, planters…"
              className="pl-9 pr-8 h-10 text-xs sm:text-sm"
              aria-label="Search products"
            />
            {input && (
              <button
                type="button"
                onClick={() => {
                  setInput("");
                  setQuery("");
                  setPage(0);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {totalElements > 0 && (
            <p className="text-xs text-muted-foreground">
              {totalElements} {totalElements === 1 ? "product" : "products"} available
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap">
          {chips.map((c) => (
            <button
              key={c || "all"}
              onClick={() => {
                setCategory(c);
                setPage(0);
              }}
              className={cn(
                "shrink-0 cursor-pointer rounded-none border px-3 py-1.5 text-xs font-semibold transition-all",
                category === c
                  ? "border-forest bg-forest text-white shadow-xs"
                  : "border-border bg-card text-foreground/80 hover:border-forest/50 hover:bg-muted/50",
              )}
            >
              {c || "All Collections"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        {productsQuery.isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border border-border bg-card rounded-none overflow-hidden">
                <Skeleton className="aspect-[4/5] w-full" />
                <div className="space-y-2 p-3 sm:p-4">
                  <Skeleton className="h-3 w-16 sm:w-20" />
                  <Skeleton className="h-4 sm:h-5 w-3/4" />
                  <Skeleton className="h-7 sm:h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (productsQuery.data?.content.length ?? 0) === 0 ? (
          <div className="py-16 sm:py-20 text-center rounded-none border border-dashed border-border bg-card/50 px-4">
            <p className="font-display text-xl sm:text-2xl text-foreground">Nothing found</p>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Try adjusting your keyword or clearing the collection filter.
            </p>
            {(query || category) && (
              <button
                type="button"
                onClick={() => {
                  setInput("");
                  setQuery("");
                  setCategory("");
                  setPage(0);
                }}
                className="mt-4 inline-flex items-center text-xs font-semibold text-forest underline underline-offset-4 cursor-pointer hover:opacity-80"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {productsQuery.data!.content.map((p) => (
                <ProductCard key={p.productId} product={p} />
              ))}
            </div>

            {/* Rich Pagination */}
            <div className="mt-8 sm:mt-12 pt-6 border-t border-border">
              <DataTablePagination
                page={page}
                totalPages={totalPages}
                totalItems={totalElements}
                pageSize={pageSize}
                pageSizeOptions={[12, 24, 48]}
                onPageChange={handlePageChange}
                onPageSizeChange={setPageSize}
                showPageSize={true}
                showItemCount={true}
                itemLabel="products"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

