import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Box, Check, Headphones, Leaf, Package, Ruler, ShieldCheck, Truck } from "lucide-react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/components/page-header";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchase } from "@/components/product-purchase";
import { ProductTabs, type ProductTab } from "@/components/product-tabs";
import { getProduct, searchProducts } from "@/lib/endpoints";
import { categoryHref } from "@/lib/collections";
import { formatINR, discountPct, parseColors, parseFeatures } from "@/lib/format";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

async function load(id: string): Promise<Product | undefined> {
  try {
    return await getProduct(id);
  } catch {
    return undefined;
  }
}

async function related(product: Product): Promise<Product[]> {
  try {
    const page = await searchProducts({ category: product.category, size: 7 });
    return page.content.filter((p) => p.productId !== product.productId).slice(0, 6);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const product = await load((await params).id);
  return product ? { title: product.pname, description: product.usage || undefined } : { title: "Product" };
}

const ASSURANCES = [
  { icon: ShieldCheck, label: "Secure payments" },
  { icon: Package, label: "Bulk discounts" },
  { icon: Truck, label: "Order tracking" },
  { icon: Headphones, label: "Support" },
];

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await load(id);
  if (!product) notFound();

  const [alsoLike] = await Promise.all([related(product)]);
  const off = discountPct(product.price, product.originalPrice);
  const colors = parseColors(product.color);
  const features = parseFeatures(product.features);
  const dimensions = [product.length, product.width, product.height].filter(Boolean).join(" × ");
  const specs = (
    [
      ["Material", product.material],
      ["Category", product.subCategory || product.category],
      ["Size", product.size],
      ["Pack", product.packSize],
      ["Colour", colors.join(", ")],
      ["Weight", product.weight],
      ["Dimensions", dimensions],
      ["UV protection", product.uvProtection ? "Yes" : ""],
    ] as [string, string][]
  ).filter(([, v]) => v);

  const highlights = [
    product.material && { icon: Leaf, title: "Material", text: product.material },
    product.size && { icon: Ruler, title: "Size", text: product.size },
    product.packSize && { icon: Box, title: "Pack", text: product.packSize },
    product.sustainabilityTag && { icon: Check, title: "Sustainable choice", text: product.sustainabilityTag },
  ].filter(Boolean) as { icon: typeof Leaf; title: string; text: string }[];

  const tiers = [...(product.discountTiers ?? [])].sort((a, b) => a.minQuantity - b.minQuantity);

  const tabs: ProductTab[] = [
    {
      id: "details",
      label: "Product details",
      content: (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 text-sm leading-relaxed text-ink/85">
            {product.usage ? <p>{product.usage}</p> : <p>{product.pname} — made from {product.material || "plant-based composites"}.</p>}
            {features.length > 0 && (
              <ul className="space-y-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-white">
                      <Check className="h-3 w-3" aria-hidden />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {specs.length > 0 && <SpecTable specs={specs.slice(0, 6)} />}
        </div>
      ),
    },
    ...(specs.length > 0 ? [{ id: "specs", label: "Specifications", content: <SpecTable specs={specs} /> }] : []),
    ...(tiers.length > 0
      ? [
          {
            id: "bulk",
            label: "Bulk pricing",
            content: (
              <div className="max-w-xl overflow-hidden rounded-lg border border-line">
                <table className="w-full text-sm">
                  <thead className="bg-sand text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Quantity</th>
                      <th className="px-4 py-3 font-medium">Discount</th>
                      <th className="px-4 py-3 text-right font-medium">Price each</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-white">
                    <tr>
                      <td className="px-4 py-3">1+</td>
                      <td className="px-4 py-3 text-muted-foreground">—</td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatINR(product.price)}</td>
                    </tr>
                    {tiers.map((t) => (
                      <tr key={t.minQuantity}>
                        <td className="px-4 py-3">{t.minQuantity}+</td>
                        <td className="px-4 py-3 font-medium text-forest">{t.discountPercent}% off</td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {formatINR(Math.round(product.price * (1 - t.discountPercent / 100) * 100) / 100)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="border-t border-line bg-white px-4 py-3 text-xs text-muted-foreground">
                  Discounts apply automatically in your cart. Need more?{" "}
                  <Link href="/enterprise" className="font-medium text-forest underline">Request a bulk quote</Link>.
                </p>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <Container className="pt-5">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: product.category || "Shop", href: product.category ? categoryHref(product.category) : "/products" },
            { label: product.pname },
          ]}
        />
      </Container>

      <Container className="grid gap-8 py-6 lg:grid-cols-12 lg:gap-10 lg:py-8">
        <div className="lg:col-span-7 xl:col-span-5">
          <ProductGallery images={product.productImages} alt={product.pname} />
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {product.subCategory || product.category}
          </p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight text-ink sm:text-3xl">{product.pname}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-ink">{formatINR(product.price)}</span>
            {off > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>
                <span className="rounded-md bg-forest px-2 py-1 text-xs font-semibold text-white">{off}% OFF</span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

          {colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-ink">Colour</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <span key={c} className="rounded-md border border-line bg-white px-3 py-1.5 text-sm capitalize text-ink">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(product.size || product.packSize) && (
            <dl className="mt-6 grid grid-cols-2 gap-3">
              {product.size && (
                <div className="rounded-md border border-line bg-white px-3 py-2">
                  <dt className="text-xs text-muted-foreground">Size</dt>
                  <dd className="text-sm font-medium text-ink">{product.size}</dd>
                </div>
              )}
              {product.packSize && (
                <div className="rounded-md border border-line bg-white px-3 py-2">
                  <dt className="text-xs text-muted-foreground">Pack</dt>
                  <dd className="text-sm font-medium text-ink">{product.packSize}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-6">
            <ProductPurchase
              productId={product.productId}
              available={product.isAvailable}
              maxQty={product.quantity}
              unitPrice={product.price}
              tiers={product.discountTiers}
            />
          </div>

          {tiers.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Buy {tiers[0].minQuantity}+ and save {tiers[0].discountPercent}% — see <span className="font-medium text-ink">Bulk pricing</span> below.
            </p>
          )}

          <ul className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5 sm:grid-cols-4">
            {ASSURANCES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-xs text-ink/80">
                <Icon className="h-5 w-5 shrink-0 text-forest" strokeWidth={1.5} aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {highlights.length > 0 && (
          <aside className="lg:col-span-12 xl:col-span-3">
            <div className="grid gap-4 rounded-xl bg-sage-wash p-5 sm:grid-cols-2 xl:grid-cols-1">
              {highlights.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-forest/20 bg-white text-forest">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{title}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </Container>

      <Container className="pb-12">
        <ProductTabs tabs={tabs} />
      </Container>

      {alsoLike.length > 0 && (
        <section className="border-t border-line bg-white py-12 sm:py-14">
          <Container>
            <div className="mb-6 flex items-end justify-between gap-3">
              <h2 className="text-2xl font-semibold text-ink">You may also like</h2>
              <Link href={categoryHref(product.category)} className="inline-flex items-center gap-1.5 text-sm font-medium text-forest">
                View all <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {alsoLike.map((p) => (
                <ProductCard key={p.productId} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

function SpecTable({ specs }: { specs: [string, string][] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white">
      <p className="border-b border-line bg-sand px-4 py-2.5 text-sm font-semibold text-ink">Specifications</p>
      <dl className="divide-y divide-line text-sm">
        {specs.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[140px_1fr] gap-3 px-4 py-2.5">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
