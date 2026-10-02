import Link from "next/link";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, ShieldCheck, Leaf, CheckCircle2, FolderTree } from "lucide-react";
import { ProductImage } from "@/components/product-image";
import { getCategories, getAllProducts } from "@/lib/endpoints";
import type { Category, Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Product Categories | 100% Sustainable Bio-Tableware & Home | ViroEco",
  description:
    "Explore our complete sustainable product categories crafted from bamboo, rice husk, and agri-waste biocomposites. Zero fossil plastics, food safe, and 100% circular.",
};

export default async function CategoriesPage() {
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
    // API offline
  }

  const totalProductCount = products.length;

  return (
    <div className="pt-8 pb-20 bg-[#FAF9F5] min-h-screen text-[#17231C]">
      {/* Category Hero Header */}
      <section className="border-b border-[#DFD5C6] bg-white py-14 lg:py-16">
        <Container>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#EDF2EB] text-[#50644C] text-xs font-bold uppercase tracking-wider">
              Circular Product Architecture
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#50644C] leading-tight">
              Eco-Conscious Product Categories
            </h1>
            <p className="text-base sm:text-lg text-[#5A6659] leading-relaxed">
              Every item in our collection is precision-molded from agricultural byproducts, bamboo
              fibers, and rice husk composites. Discover purpose-built collections for homes, hospitality,
              and enterprise catering.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild className="bg-[#50644C] hover:bg-[#243021] text-white rounded-none px-6 cursor-pointer">
                <Link href="/products">
                  View All Products {totalProductCount > 0 ? `(${totalProductCount} items)` : ""}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-[#50644C]/20 text-[#50644C] hover:bg-[#EDF2EB] rounded-none px-6 cursor-pointer">
                <Link href="/impact">
                  Explore Material Science
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Quick Category Quick-Select Pills */}
      {categories.length > 0 && (
        <section className="py-6 border-b border-[#DFD5C6] bg-[#FAF9F5]/70 sticky top-18 z-30 backdrop-blur-md">
          <Container>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-bold uppercase tracking-wider text-[#50644C] shrink-0 mr-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Filter by:
              </span>
              <Link
                href="/products"
                className="shrink-0 px-3.5 py-1.5 rounded-none text-xs font-semibold bg-white border border-[#DFD5C6] text-[#5A6659] hover:text-[#50644C] hover:border-[#50644C] hover:bg-[#EDF2EB] transition-all"
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="shrink-0 px-3.5 py-1.5 rounded-none text-xs font-semibold bg-white border border-[#DFD5C6] text-[#5A6659] hover:text-[#50644C] hover:border-[#50644C] hover:bg-[#EDF2EB] transition-all"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Main Categories Grid */}
      <Container className="py-14 space-y-12">
        {categories.length === 0 ? (
          <div className="rounded-none border border-dashed border-[#DFD5C6] bg-white p-12 text-center">
            <FolderTree className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium text-foreground">No categories found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add categories in the Admin Console to populate this page from the database.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => {
              const matchingProds = products.filter(
                (p) =>
                  p.category?.toLowerCase() === cat.name?.toLowerCase() ||
                  p.subCategory?.toLowerCase() === cat.name?.toLowerCase()
              );
              const matchingCount = matchingProds.length;
              const prodWithImage = matchingProds.find(
                (p) => p.productImages && p.productImages.length > 0 && p.productImages.some(Boolean)
              );
              const sampleImages = prodWithImage?.productImages ?? matchingProds[0]?.productImages ?? [];
              const sampleMaterial = prodWithImage?.material || matchingProds[0]?.material || "Eco-Biocomposite";

              return (
                <div
                  key={cat.id}
                  className="group flex flex-col bg-white border border-[#DFD5C6] rounded-none overflow-hidden shadow-xs hover:shadow-xl hover:border-[#50644C]/40 transition-all duration-300"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#F5EFE6]">
                    <ProductImage
                      images={sampleImages}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute top-3.5 left-3.5 bg-[#FAF9F5]/95 backdrop-blur-xs text-[#50644C] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-none border border-[#DFD5C6] shadow-xs">
                      {sampleMaterial}
                    </span>
                    {matchingCount > 0 && (
                      <span className="absolute bottom-3.5 right-3.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-0.5 rounded-none">
                        {matchingCount} {matchingCount === 1 ? "item" : "items"}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-2.5">
                      <h2 className="font-display text-2xl text-[#50644C] font-bold group-hover:text-[#243021] transition-colors">
                        {cat.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#5A6659] leading-relaxed">
                        {matchingCount > 0
                          ? `Explore our genuine range of ${matchingCount} sustainable items crafted from natural agricultural biocomposites.`
                          : `Browse sustainable, 100% circular products in ${cat.name}.`}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#DFD5C6]/80 flex items-center justify-between">
                      <span className="text-xs font-medium text-emerald-800 flex items-center gap-1.5">
                        <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                        100% Plastic-Free
                      </span>
                      <Link
                        href={`/products?category=${encodeURIComponent(cat.name)}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#50644C] hover:text-[#243021] group/link cursor-pointer"
                      >
                        <span>Explore Collection</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quality & Material Assurance Box */}
        <div className="bg-[#243021] text-white rounded-none p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Certified Safe &amp; Tested
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Engineered for Real-World Durability &amp; Safety
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Every category complies with global food contact directives (FDA 21 CFR, EU 1935/2004) and is free from toxic PFAS, formaldehyde resins, and chemical bleaches.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dishwasher &amp; Microwave Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>-20°C to +140°C Temperature Range</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Non-Toxic Natural Plant Pigments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Biodegradable &amp; Recyclable</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
