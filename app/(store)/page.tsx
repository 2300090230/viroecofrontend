import Link from "next/link";
import { Hero } from "@/components/hero";
import { Container } from "@/components/container";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/lib/endpoints";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

const PILLARS = [
  { title: "Unbreakable", body: "Rice husk & bamboo composite shrugs off drops that shatter ceramic." },
  { title: "Microwave-safe", body: "Reheat and reuse. No leaching, no warping, no plastic taste." },
  { title: "Low-carbon", body: "Plant waste, not petroleum — a fraction of the footprint." },
  { title: "Compostable", body: "At end of life it returns to the soil it was grown from." },
];

export default async function HomePage() {
  let products: Product[] = [];
  try {
    products = await getAllProducts();
  } catch {
    products = [];
  }
  const featured = products.slice(0, 8);

  return (
    <>
      <Hero />

      {/* Featured collection */}
      <section className="py-20">
        <Container>
          <Reveal className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-terra-deep">The collection</p>
              <h2 className="mt-2 font-display text-4xl tracking-tight">Made to be kept</h2>
            </div>
            <Button asChild variant="ghost" className="cursor-pointer">
              <Link href="/products">View all →</Link>
            </Button>
          </Reveal>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featured.map((p, i) => (
                <Reveal key={p.productId} delay={(i % 4) * 0.06}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              The catalogue is warming up. Start the backend and seed to see products here.
            </p>
          )}
        </Container>
      </section>

      {/* Sustainability story */}
      <section id="sustainability" className="scroll-mt-20 bg-sand py-24">
        <Container>
          <Reveal className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-moss-deep">Why rice husk</p>
            <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              A material that gives more than it takes.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Rice husk is the hull left over after milling — usually burned as waste. We press it
              with bamboo fibre into a dense, food-safe composite that behaves like fine tableware
              and ends its life as compost.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06} className="bg-background p-8">
                <p className="font-display text-2xl">0{i + 1}</p>
                <h3 className="mt-4 font-display text-xl">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
