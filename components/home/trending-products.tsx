"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/container";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

type TabId = "new" | "offers";

export function TrendingProducts({ newArrivals, offers }: { newArrivals: Product[]; offers: Product[] }) {
  const lists: Record<TabId, Product[]> = { new: newArrivals, offers };

  const tabs = ([
    { id: "new", label: "New arrivals" },
    { id: "offers", label: "On offer" },
  ] as { id: TabId; label: string }[]).filter((t) => lists[t.id].length > 0);

  const [active, setActive] = useState<TabId>("new");
  const scroller = useRef<HTMLDivElement>(null);

  if (tabs.length === 0) return null;
  const current = lists[active].length ? active : tabs[0].id;

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="section bg-white">
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Trending now</h2>
          <div role="tablist" aria-label="Product lists" className="flex items-center gap-6">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={current === t.id}
                onClick={() => {
                  setActive(t.id);
                  scroller.current?.scrollTo({ left: 0 });
                }}
                className={cn(
                  "border-b-2 pb-1.5 text-sm font-medium transition-colors",
                  current === t.id ? "border-forest text-forest" : "border-transparent text-muted-foreground hover:text-ink",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            ref={scroller}
            role="tabpanel"
            className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:-mx-0 sm:px-0"
          >
            {lists[current].map((p) => (
              <div key={p.productId} className="w-[70%] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-4rem)/5)]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="absolute -left-5 top-[38%] hidden h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-md hover:text-forest lg:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="absolute -right-5 top-[38%] hidden h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-md hover:text-forest lg:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest-dark">
            View all products <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}
