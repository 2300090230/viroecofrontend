"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/providers/auth-provider";
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
  const router = useRouter();
  const { session, ready } = useAuth();
  const { add } = useCart();
  const ceiling = Math.max(1, maxQty || 1); // bulk-friendly: capped by stock, not an arbitrary 10
  const clamp = (n: number) => Math.max(1, Math.min(ceiling, n));

  if (!available) {
    return (
      <div className="rounded-lg border border-line bg-sand p-4 text-sm text-muted-foreground">
        This product is currently out of stock. <Link href="/contact" className="font-medium text-forest underline">Contact us</Link> for availability.
      </div>
    );
  }

  const percent = discountFor(tiers, qty);
  const discountedUnit = Math.round(unitPrice * (1 - percent / 100) * 100) / 100;

  const buyNow = () => {
    if (!session) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (session.role === "ADMIN") {
      toast.error("Shopping is available on customer accounts.");
      return;
    }
    add.mutate({ productId, quantity: qty }, { onSuccess: () => router.push("/checkout") });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Quantity</p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-11 items-center overflow-hidden rounded-md border border-input bg-white">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => clamp(q - 1))}
              className="flex h-full w-11 items-center justify-center text-ink hover:bg-sand disabled:opacity-40"
              disabled={qty <= 1}
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
              className="h-full w-16 border-x border-input bg-transparent text-center text-sm tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => clamp(q + 1))}
              className="flex h-full w-11 items-center justify-center text-ink hover:bg-sand disabled:opacity-40"
              disabled={qty >= ceiling}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="flex items-center gap-2 text-sm font-medium text-forest">
            <span className="h-2 w-2 rounded-full bg-forest" aria-hidden />
            In stock{maxQty > 0 && maxQty < 50 ? ` — only ${maxQty} left` : ""}
          </p>
        </div>
      </div>

      {percent > 0 && (
        <p className="rounded-md bg-sage-wash px-3 py-2 text-sm font-medium text-forest">
          {percent}% bulk discount applied — {formatINR(discountedUnit)} each · {formatINR(discountedUnit * qty)} total
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <AddToCartButton
          productId={productId}
          quantity={qty}
          size="lg"
          label="Add to Cart"
          icon={<ShoppingCart className="h-4.5 w-4.5" aria-hidden />}
          className="w-full"
        />
        <Button type="button" size="lg" variant="outline" onClick={buyNow} disabled={add.isPending || !ready} className="w-full">
          Buy now
        </Button>
      </div>
    </div>
  );
}
