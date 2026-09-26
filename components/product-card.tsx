import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { formatINR, discountPct } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const off = discountPct(product.price, product.originalPrice);

  return (
    <div className="group relative flex flex-col border border-border bg-card transition-colors hover:border-terra/60">
      <Link
        href={`/products/${product.productId}`}
        className="relative block aspect-[4/5] overflow-hidden"
        aria-label={product.pname}
      >
        <ProductImage
          images={product.productImages}
          alt={product.pname}
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {off > 0 && (
          <span className="absolute left-0 top-0 bg-terra px-2.5 py-1 text-xs font-medium text-primary-foreground">
            −{off}%
          </span>
        )}
        {product.sustainabilityTag && (
          <span className="absolute right-2 top-2 bg-moss/90 px-2 py-0.5 text-[11px] font-medium text-[#21281f]">
            {product.sustainabilityTag}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {product.subCategory || product.category}
        </p>
        <Link href={`/products/${product.productId}`} className="cursor-pointer">
          <h3 className="font-display text-lg leading-snug text-foreground">{product.pname}</h3>
        </Link>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-semibold">{formatINR(product.price)}</span>
          {off > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          {product.isAvailable ? (
            <AddToCartButton productId={product.productId} size="sm" className="flex-1" />
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              Out of stock
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
