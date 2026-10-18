import { HeroCarousel, type HeroSlide } from "@/components/home/hero-carousel";
import { TrendingProducts } from "@/components/home/trending-products";
import {
  BusinessCtas,
  CollectionsGrid,
  ProcessStrip,
  PromoBanners,
  TrustStrip,
  UseCases,
  WhyChoose,
  type PromoBanner,
} from "@/components/home/sections";
import { getAllProducts, getCategories } from "@/lib/endpoints";
import { buildCollections, describeCollection, imagesOf, type Collection } from "@/lib/collections";
import { discountPct } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

export const dynamic = "force-dynamic";

async function loadCatalog(): Promise<{ products: Product[]; categories: Category[] }> {
  const [products, categories] = await Promise.allSettled([getAllProducts(), getCategories()]);
  return {
    products: products.status === "fulfilled" && Array.isArray(products.value) ? products.value : [],
    categories: categories.status === "fulfilled" && Array.isArray(categories.value) ? categories.value : [],
  };
}

function buildSlides(products: Product[], collections: Collection[]): HeroSlide[] {
  const featured = collections.filter((c) => c.images.length > 0).slice(0, 3);
  return [
    {
      id: "brand",
      eyebrow: "Rice husk & bamboo",
      title: "Everyday essentials, made from nature",
      text: "Durable drinkware, tableware, planters and storage made from plant-based composites — a more sustainable choice for every day.",
      cta: { label: "Shop now", href: "/products" },
      // One photo per leading collection, so the opening slide shows the range
      images: collections.flatMap((c) => c.images.slice(0, 1)).slice(0, 3),
    },
    ...featured.map((c) => ({
      id: `collection-${c.name}`,
      eyebrow: "Collection",
      title: c.name,
      text: describeCollection(c.name),
      cta: { label: `Shop ${c.name.toLowerCase()}`, href: c.href },
      images: c.images,
    })),
    {
      id: "bulk",
      eyebrow: "Bulk & corporate",
      title: "Buying for your business?",
      text: "Volume pricing for restaurants, cafés, events, retailers and corporate gifting — with tailored quotes.",
      cta: { label: "Request a quote", href: "/enterprise" },
      images: [],
    },
  ];
}

function buildBanners(products: Product[]): PromoBanner[] {
  const byMaterial = (re: RegExp) => products.filter((p) => re.test(p.material ?? ""));
  return [
    {
      title: "Rice husk collection",
      text: "Sturdy, lightweight pieces made with agricultural rice husk.",
      href: "/products?query=rice%20husk",
      cta: "Shop collection",
      images: imagesOf(byMaterial(/rice/i), 2),
    },
    {
      title: "Bamboo collection",
      text: "Natural bamboo-fibre products for dining, storage and gifting.",
      href: "/products?query=bamboo",
      cta: "Shop collection",
      images: imagesOf(byMaterial(/bamboo/i), 2),
    },
  ].filter((b) => b.images.length > 0);
}

function buildTrending(products: Product[]) {
  const available = products.filter((p) => p.isAvailable);
  const off = (p: Product) => discountPct(p.price, p.originalPrice);
  return {
    // Highest ids were added most recently
    newArrivals: [...available].sort((a, b) => b.productId - a.productId).slice(0, 12),
    offers: available.filter((p) => off(p) > 0).sort((a, b) => off(b) - off(a)).slice(0, 12),
  };
}

export default async function HomePage() {
  const { products, categories } = await loadCatalog();
  const collections = buildCollections(categories, products);
  // Offset into the catalogue so the business cards don't repeat the hero photos
  const businessImages = imagesOf(products.slice(6), 2);

  return (
    <>
      <HeroCarousel slides={buildSlides(products, collections)} />
      <TrustStrip />
      <CollectionsGrid collections={collections} />
      <ProcessStrip />
      <TrendingProducts {...buildTrending(products)} />
      <PromoBanners banners={buildBanners(products)} />
      <UseCases />
      <WhyChoose />
      <BusinessCtas images={businessImages} />
    </>
  );
}
