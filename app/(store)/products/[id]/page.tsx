import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchase } from "@/components/product-purchase";
import { Badge } from "@/components/ui/badge";
import { getProduct } from "@/lib/endpoints";
import { formatINR, discountPct, parseColors, parseFeatures } from "@/lib/format";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product: Product | undefined;
  try {
    product = await getProduct(id);
  } catch {
    product = undefined;
  }

  if (!product) {
    notFound();
  }

  const off = discountPct(product.price, product.originalPrice);
  const colors = parseColors(product.color);
  const features = parseFeatures(product.features);
  const specs: [string, string][] = [
    ["Size", product.size],
    ["Material", product.material],
    ["Pack", product.packSize],
    ["Weight", product.weight],
    ["Dimensions", [product.length, product.width, product.height].filter(Boolean).join(" × ")],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <div className="pt-24">
      <Container className="py-8">
        {/* Back navigation + breadcrumb */}
        <div className="mb-6 space-y-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span className="text-base leading-none group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>Back to Products</span>
          </Link>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto whitespace-nowrap scrollbar-none py-1">
            <Link href="/" className="hover:text-foreground transition-colors shrink-0">Home</Link>
            <span className="shrink-0">/</span>
            <Link href="/products" className="hover:text-foreground transition-colors shrink-0">Products</Link>
            <span className="shrink-0">/</span>
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="hover:text-foreground transition-colors shrink-0"
            >
              {product.category}
            </Link>
            <span className="shrink-0">/</span>
            <span className="text-foreground font-medium truncate max-w-[200px] shrink-0">{product.pname}</span>
          </nav>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={product.productImages} alt={product.pname} />

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-terra-deep">
              {product.subCategory || product.category}
            </p>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
              {product.pname}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-2xl font-semibold">{formatINR(product.price)}</span>
              {off > 0 && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                  {/* Use terra-deep (#a6633d) instead of terra (#c08058) for WCAG AA contrast with white text */}
                  <Badge className="bg-terra-deep text-white">−{off}%</Badge>
                </>
              )}
            </div>

            {product.sustainabilityTag && (
              <div className="mt-4">
                {/* bg-moss with dark text [#21281f] passes contrast — keep as-is */}
                <Badge className="bg-moss text-[#21281f]">{product.sustainabilityTag}</Badge>
              </div>
            )}

            {product.usage && (
              <p className="mt-6 leading-relaxed text-muted-foreground">{product.usage}</p>
            )}

            <div className="mt-8">
              <ProductPurchase
                productId={product.productId}
                available={product.isAvailable}
                maxQty={product.quantity}
                unitPrice={product.price}
                tiers={product.discountTiers}
              />
            </div>

            {product.discountTiers?.length > 0 && (
              <div className="mt-8 border border-border bg-card p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Bulk pricing
                </p>
                <table className="mt-3 w-full text-sm">
                  <tbody className="divide-y divide-border">
                    {[...product.discountTiers]
                      .sort((a, b) => a.minQuantity - b.minQuantity)
                      .map((t) => (
                        <tr key={t.minQuantity}>
                          <td className="py-2 text-muted-foreground">
                            Buy {t.minQuantity}+
                          </td>
                          <td className="py-2 text-right font-medium text-moss-deep">
                            Save {t.discountPercent}%
                          </td>
                          <td className="py-2 text-right tabular-nums">
                            {formatINR(
                              Math.round(product.price * (1 - t.discountPercent / 100) * 100) / 100,
                            )}{" "}
                            each
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {colors.length > 0 && (
              <div className="mt-8">
                <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                  Colours
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <span key={c} className="border border-border bg-card px-2.5 py-1 text-sm capitalize">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6">
              {specs.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-widest text-muted-foreground">{k}</dt>
                  <dd className="mt-1">{v}</dd>
                </div>
              ))}
            </dl>

            {features.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                  Features
                </p>
                <ul className="flex flex-wrap gap-2">
                  {features.map((f) => (
                    <li key={f} className="bg-sand px-3 py-1 text-sm">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
