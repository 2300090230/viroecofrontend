import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { formatINR, discountPct } from "@/lib/format";
import type { Product } from "@/lib/types";
import { Sparkles } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const off = discountPct(product.price, product.originalPrice);

  return (
    <div className="group relative flex flex-col rounded-none border border-[#DFD5C6] bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-[#50644C]/40 transition-all duration-300">
      <Link
        href={`/products/${product.productId}`}
        className="relative block aspect-[4/3] sm:aspect-square overflow-hidden bg-[#F5EFE6]"
        aria-label={product.pname}
      >
        <ProductImage
          images={product.productImages}
          alt={product.pname}
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {off > 0 && (
          <span className="absolute left-2 sm:left-3 top-2 sm:top-3 bg-[#50644C] text-white px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[11px] font-semibold rounded-none shadow-xs">
            −{off}%
          </span>
        )}
        {product.sustainabilityTag ? (
          <span className="absolute right-2 sm:right-3 top-2 sm:top-3 bg-[#EDF2EB]/95 backdrop-blur-xs text-[#50644C] border border-[#50644C]/10 px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-none shadow-xs">
            {product.sustainabilityTag}
          </span>
        ) : (
          <span className="absolute right-2 sm:right-3 top-2 sm:top-3 bg-[#EDF2EB]/95 backdrop-blur-xs text-[#50644C] border border-[#50644C]/10 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-none shadow-xs flex items-center gap-0.5 sm:gap-1">
            <Sparkles className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-emerald-600" />
            <span className="hidden xs:inline">Zero Plastic</span>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-5 justify-between space-y-2 sm:space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] uppercase tracking-wider text-[#5A6659] font-medium">
            <span className="truncate max-w-[100px] sm:max-w-none">{product.subCategory || product.category || "Eco Tableware"}</span>
            {product.packSize && <span className="hidden sm:inline">Pack: {product.packSize}</span>}
          </div>
          <Link href={`/products/${product.productId}`} className="cursor-pointer block">
            <h3 className="font-display text-sm sm:text-base font-semibold text-[#17231C] group-hover:text-[#50644C] transition-colors line-clamp-1">
              {product.pname}
            </h3>
          </Link>
          {product.material && (
            <p className="text-[11px] sm:text-xs text-[#5A6659] line-clamp-1">
              {product.material}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-[#DFD5C6]/60 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-baseline gap-1 sm:gap-1.5">
            <span className="text-sm sm:text-base font-bold text-[#50644C]">{formatINR(product.price)}</span>
            {off > 0 && (
              <span className="text-[10px] sm:text-xs text-[#5A6659] line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          <div>
            {product.isAvailable ? (
              <AddToCartButton productId={product.productId} size="sm" className="bg-[#50644C] hover:bg-[#243021] text-white rounded-none px-2 sm:px-3 py-1 text-[11px] sm:text-xs cursor-pointer" />
            ) : (
              <Badge variant="outline" className="text-[10px] sm:text-xs text-[#5A6659] border-[#DFD5C6] px-1.5 py-0.5">
                Out
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
