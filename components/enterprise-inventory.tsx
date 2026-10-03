"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";

interface EnterpriseInventoryProps {
  products: Product[];
}

const TABS = [
  { id: "all",        label: "All Products" },
  { id: "drinkware",  label: "Drinkware" },
  { id: "gardenware", label: "Gardenware" },
  { id: "tableware",  label: "Tableware" },
  { id: "storage",    label: "Storage" },
];

export function EnterpriseInventory({ products }: EnterpriseInventoryProps) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProducts = products.filter((p) => {
    if (activeTab === "all") return true;
    const catLower = (p.category || "").toLowerCase();
    const subCatLower = (p.subCategory || "").toLowerCase();
    if (activeTab === "drinkware") return catLower.includes("drinkware") || subCatLower.includes("mug") || subCatLower.includes("cup") || subCatLower.includes("bottle") || subCatLower.includes("tumbler") || subCatLower.includes("sipper");
    if (activeTab === "gardenware") return catLower.includes("gardenware") || subCatLower.includes("planter") || subCatLower.includes("pot") || subCatLower.includes("garden");
    if (activeTab === "tableware") return catLower.includes("tableware") || subCatLower.includes("plate") || subCatLower.includes("bowl") || subCatLower.includes("tray") || subCatLower.includes("dinner");
    if (activeTab === "storage") return catLower.includes("storage") || subCatLower.includes("organis") || subCatLower.includes("kitchen") || subCatLower.includes("box");
    return true;
  });

  const displayed = filteredProducts.slice(0, 8);

  return (
    <section id="inventory" className="py-20 bg-white border-b border-[#DFD5C6] scroll-mt-20">
      <Container>
        {/* Header and Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#50644C] font-bold">
              Currently In Stock
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#50644C]">
              Enterprise Inventory Highlights
            </h2>
          </div>

          <Button asChild variant="ghost" className="text-xs font-bold text-[#50644C] hover:text-[#243021] p-0 h-auto self-start md:self-end">
            <Link href="/products" className="flex items-center gap-1.5">
              View Full 50+ Item Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 py-2 rounded-none text-xs font-semibold cursor-pointer transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[#50644C] text-white shadow-xs"
                  : "bg-[#FAF9F5] text-[#5A6659] border border-[#DFD5C6] hover:border-[#50644C]/40 hover:text-[#17231C]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {displayed.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayed.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-12 px-6 rounded-none bg-[#FAF9F5] border border-dashed border-[#DFD5C6] text-center space-y-3">
            <p className="font-display text-lg text-[#50644C]">No products in this category yet</p>
            <p className="text-xs text-[#5A6659] max-w-md mx-auto">
              Explore the entire catalog or connect the backend database to view live warehouse stock.
            </p>
            <Button asChild size="sm" className="bg-[#50644C] hover:bg-[#243021] text-white rounded-none">
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
