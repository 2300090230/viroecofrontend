"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatINR } from "@/lib/format";
import type { DiscountTier } from "@/lib/types";

// Best applicable tier for a quantity: highest percent among tiers whose minQuantity <= qty.
// Mirrors the backend DiscountCalculator so the hint matches the charged price.
function discountFor(tiers: DiscountTier[] | undefined, qty: number): number {
  if (!tiers) return 0;
  return tiers.reduce(
    (best, t) => (qty >= t.minQuantity && t.discountPercent > best ? t.discountPercent : best),
    0,
  );
}

export function ProductPurchase({
  productId,
  available,
  maxQty,
  unitPrice,
  tiers,
}: {
  productId: number;
  available: boolean;
  maxQty: number;
  unitPrice: number;
  tiers?: DiscountTier[];
}) {
  const [qty, setQty] = useState(1);
  const ceiling = Math.max(1, maxQty || 1); // bulk-friendly: capped by stock, not an arbitrary 10
  const clamp = (n: number) => Math.max(1, Math.min(ceiling, n));

  if (!available) {
    return (
      <div className="border border-border bg-card p-4 text-sm text-muted-foreground">
        This piece is currently out of stock.
      </div>
    );
  }

  const percent = discountFor(tiers, qty);
  const discountedUnit = Math.round(unitPrice * (1 - percent / 100) * 100) / 100;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center justify-between sm:justify-start border border-border w-full sm:w-auto">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => clamp(q - 1))}
            className="flex h-11 w-11 cursor-pointer items-center justify-center hover:bg-accent shrink-0"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min={1}
            max={ceiling}
            value={qty}
            aria-label="Quantity"
            onChange={(e) => setQty(clamp(Number(e.target.value) || 1))}
            className="flex-1 sm:w-16 border-x border-border bg-transparent py-2.5 text-center tabular-nums outline-none"
          />
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => clamp(q + 1))}
            className="flex h-11 w-11 cursor-pointer items-center justify-center hover:bg-accent shrink-0"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <AddToCartButton productId={productId} quantity={qty} size="lg" className="w-full sm:min-w-40 sm:flex-1" />
      </div>

      {percent > 0 && (
        <p className="text-sm text-moss-deep font-medium">
          {percent}% bulk discount applied — {formatINR(discountedUnit)} each ·{" "}
          {formatINR(discountedUnit * qty)} total
        </p>
      )}
    </div>
  );
}
