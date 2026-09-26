"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { formatINR } from "@/lib/format";

export default function CartPage() {
  const { cart, items, subtotal, savings, update, remove } = useCart();

  return (
    <div className="pt-24">
      <Container className="py-10">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Your cart</h1>

        {cart.isLoading ? (
          <div className="mt-10 space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-16 flex flex-col items-start gap-4">
            <p className="font-display text-2xl">Your cart is empty.</p>
            <p className="text-muted-foreground">Good things are one click away.</p>
            <Button asChild className="mt-2 cursor-pointer">
              <Link href="/products">Browse the collection</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]">
            <ul className="divide-y divide-border border-y border-border">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 py-5">
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.productId}`}
                      className="cursor-pointer font-display text-lg hover:text-terra-deep"
                    >
                      {item.pname}
                    </Link>
                    {item.discountPercent > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {formatINR(item.discountedPrice)}
                        </span>{" "}
                        <span className="line-through">{formatINR(item.price)}</span> each
                        <span className="ml-2 rounded bg-moss/20 px-1.5 py-0.5 text-xs font-medium text-moss">
                          {item.discountPercent}% bulk off
                        </span>
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">{formatINR(item.price)} each</p>
                    )}
                  </div>

                  <div className="flex items-center border border-border">
                    <button
                      aria-label="Decrease"
                      className="flex h-9 w-9 cursor-pointer items-center justify-center hover:bg-accent disabled:opacity-40"
                      disabled={update.isPending}
                      onClick={() =>
                        update.mutate({ productId: item.productId, quantity: item.quantity - 1 })
                      }
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm tabular-nums">{item.quantity}</span>
                    <button
                      aria-label="Increase"
                      className="flex h-9 w-9 cursor-pointer items-center justify-center hover:bg-accent disabled:opacity-40"
                      disabled={update.isPending}
                      onClick={() =>
                        update.mutate({ productId: item.productId, quantity: item.quantity + 1 })
                      }
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="w-24 text-right font-medium tabular-nums">
                    {formatINR(item.discountedPrice * item.quantity)}
                  </div>

                  <button
                    aria-label={`Remove ${item.pname}`}
                    className="cursor-pointer p-2 text-muted-foreground hover:text-destructive"
                    onClick={() => remove.mutate(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <aside className="h-fit border border-border bg-card p-6">
              <h2 className="font-display text-xl">Summary</h2>
              {savings > 0 && (
                <div className="mt-4 flex justify-between text-moss">
                  <span>Bulk savings</span>
                  <span className="font-medium tabular-nums">−{formatINR(savings)}</span>
                </div>
              )}
              <div className="mt-4 flex justify-between border-b border-border pb-4">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatINR(subtotal)}</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Shipping & taxes calculated at checkout.
              </p>
              <Button asChild size="lg" className="mt-6 w-full cursor-pointer">
                <Link href="/checkout">Checkout</Link>
              </Button>
            </aside>
          </div>
        )}
      </Container>
    </div>
  );
}
