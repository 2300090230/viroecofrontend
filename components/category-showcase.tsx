import Link from "next/link";
import { Container } from "@/components/container";
import { ArrowRight, FolderTree } from "lucide-react";
import { ProductImage } from "@/components/product-image";
import { getCategories, getAllProducts } from "@/lib/endpoints";
import type { Category, Product } from "@/lib/types";

export async function CategoryShowcase() {
  let categories: Category[] = [];
  let products: Product[] = [];

  try {
    const [fetchedCats, fetchedProds] = await Promise.all([
      getCategories(),
      getAllProducts(),
    ]);
    if (Array.isArray(fetchedCats)) categories = fetchedCats;
    if (Array.isArray(fetchedProds)) products = fetchedProds;
  } catch {
    // API offline or empty
  }

  // Filter or group top categories
  const displayCategories = categories.length > 0
    ? categories.slice(0, 6)
    : [];

  return (
    <section id="categories" className="py-20 bg-[#FAF9F5] scroll-mt-20">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#50644C] font-bold">
              Eco-Conscious Product Lines
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#50644C]">
              Shop by Category
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#5A6659] leading-relaxed">
            Every product is crafted from bamboo, rice husk, or agricultural waste biocomposites —
            zero fossil plastic, fully sustainable from farm to home.
          </p>
        </div>

        {/* Dynamic Category Cards Grid */}
        {displayCategories.length === 0 ? (
          <div className="rounded-none border border-dashed border-[#DFD5C6] bg-white p-12 text-center">
            <FolderTree className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium text-foreground">No categories available</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add categories in the Admin Console to populate the storefront catalog.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCategories.map((cat) => {
              const matchingProds = products.filter(
                (p) =>
                  p.category?.toLowerCase() === cat.name?.toLowerCase() ||
                  p.subCategory?.toLowerCase() === cat.name?.toLowerCase()
              );
              const count = matchingProds.length;
              const prodWithImage = matchingProds.find(
                (p) => p.productImages && p.productImages.length > 0 && p.productImages.some(Boolean)
              );
              const sampleImages = prodWithImage?.productImages ?? matchingProds[0]?.productImages ?? [];
              const sampleMaterial = prodWithImage?.material || matchingProds[0]?.material || "Eco-Biocomposite";

              return (
                <div
                  key={cat.id}
                  className="group flex flex-col bg-white border border-[#DFD5C6] rounded-none overflow-hidden shadow-xs hover:shadow-md hover:border-[#50644C]/40 transition-all duration-300"
                >
                  {/* Category Image from DB products */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#F5EFE6]">
                    <ProductImage
                      images={sampleImages}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-[#FAF9F5]/95 backdrop-blur-xs text-[#50644C] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-none border border-[#DFD5C6]">
                      {sampleMaterial}
                    </span>
                    {count > 0 && (
                      <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-none">
                        {count} {count === 1 ? "item" : "items"}
                      </span>
                    )}
                  </div>

                  {/* Category Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-display text-xl text-[#50644C] font-semibold group-hover:text-[#243021] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-[#5A6659] leading-relaxed line-clamp-2">
                        {count > 0
                          ? `Explore ${count} sustainable items in ${cat.name} molded from agricultural biocomposites.`
                          : `Browse our zero-plastic sustainable ${cat.name} collection.`}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#DFD5C6]/60">
                      <Link
                        href={`/products?category=${encodeURIComponent(cat.name)}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#50644C] hover:text-[#243021] transition-colors group/link cursor-pointer"
                      >
                        <span>Browse Category</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
