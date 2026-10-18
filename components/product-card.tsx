import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { ProductImage } from "@/components/product-image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatINR, discountPct } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const off = discountPct(product.price, product.originalPrice);
  const href = `/products/${product.productId}`;
  const meta = [product.size, product.packSize && `Pack of ${product.packSize}`].filter(Boolean).join(" · ");

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-card-hover",
        className,
      )}
    >
      <Link href={href} className="relative block aspect-square overflow-hidden bg-sand" aria-label={product.pname}>
        <ProductImage
          images={product.productImages}
          alt={product.pname}
          className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {off > 0 && (
            <span className="rounded-full bg-terra-deep px-2.5 py-1 text-[11px] font-semibold text-white">
              {off}% off
            </span>
          )}
          {product.sustainabilityTag && (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-forest shadow-xs">
              {product.sustainabilityTag}
            </span>
          )}
        </div>
        {!product.isAvailable && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/75 py-1.5 text-center text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1 space-y-1">
          <p className="truncate text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {product.subCategory || product.category}
          </p>
          <Link href={href}>
            <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-forest">
              {product.pname}
            </h3>
          </Link>
          {meta && <p className="truncate text-xs text-muted-foreground">{meta}</p>}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-ink">{formatINR(product.price)}</span>
          {off > 0 && (
            <span className="text-sm text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>
          )}
        </div>

        {product.isAvailable ? (
          <AddToCartButton
            productId={product.productId}
            className="w-full gap-2"
            label="Add to Cart"
            icon={<ShoppingCart className="h-4 w-4" aria-hidden />}
          />
        ) : (
          <Link
            href={href}
            className="flex h-10 w-full items-center justify-center rounded-md border border-line text-sm font-medium text-muted-foreground hover:border-forest/40 hover:text-forest"
          >
            View details
          </Link>
        )}
      </div>
    </article>
  );
}
