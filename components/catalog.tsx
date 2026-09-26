"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { getAllProducts, searchProducts } from "@/lib/endpoints";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

export function Catalog({
  initialQuery = "",
  initialCategory = "",
  initialPage = 0,
}: {
  initialQuery?: string;
  initialCategory?: string;
  initialPage?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(initialPage);

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
    if (page) q.set("page", String(page));
    const qs = q.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [query, category, page, pathname, router]);

  const categories = useQuery({
    queryKey: ["catalog-categories"],
    queryFn: async () => {
      const all = await getAllProducts();
      return Array.from(new Set(all.map((p) => p.category).filter(Boolean))).sort();
    },
    staleTime: 5 * 60_000,
  });

  const products = useQuery({
    queryKey: ["products", query, category, page],
    queryFn: () => searchProducts({ query, category, page, size: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  const totalPages = products.data?.totalPages ?? 0;
  const chips = useMemo(() => ["", ...(categories.data ?? [])], [categories.data]);

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-border pb-6">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search mugs, bowls, bottles…"
            className="pl-9"
            aria-label="Search products"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c || "all"}
              onClick={() => {
                setCategory(c);
                setPage(0);
              }}
              className={cn(
                "cursor-pointer border px-3 py-1.5 text-sm transition-colors",
                category === c
                  ? "border-terra bg-terra text-primary-foreground"
                  : "border-border bg-card text-foreground/80 hover:border-terra/50",
              )}
            >
              {c || "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {products.isLoading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border border-border bg-card">
                <Skeleton className="aspect-[4/5] w-full" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : products.isError ? (
          <p className="py-16 text-center text-muted-foreground">
            Could not load products. Please try again.
          </p>
        ) : (products.data?.content.length ?? 0) === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-2xl">Nothing here yet</p>
            <p className="mt-2 text-muted-foreground">
              Try a different search or clear the filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {products.data!.content.map((p) => (
                <ProductCard key={p.productId} product={p} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  disabled={page <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
