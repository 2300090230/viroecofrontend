"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingCart, Trash2 } from "lucide-react";
import { Container } from "@/components/container";
import { CheckoutSteps } from "@/components/checkout-steps";
import { ProductImage } from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { formatINR } from "@/lib/format";

export default function CartPage() {
  const { cart, items, subtotal, savings, update, remove } = useCart();
  const units = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="bg-cream">
      <Container className="py-8 sm:py-10">
        <CheckoutSteps current={0} />

        {cart.isLoading ? (
          <div className="mt-10 space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mx-auto mt-12 max-w-md rounded-xl border border-line bg-white p-10 text-center shadow-card">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-wash text-forest">
              <ShoppingCart className="h-7 w-7" aria-hidden />
            </span>
            <h1 className="mt-5 text-2xl font-semibold text-ink">Your cart is empty</h1>
            <p className="mt-2 text-sm text-muted-foreground">Good things are one click away.</p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/products">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            <section>
              <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
                  Your cart <span className="text-lg font-normal text-muted-foreground">({items.length} {items.length === 1 ? "item" : "items"})</span>
                </h1>
                <Link href="/products" className="hidden items-center gap-1.5 text-sm font-medium text-forest sm:inline-flex">
                  Continue shopping <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>

              <div className="overflow-hidden rounded-lg border border-line bg-white shadow-card">
                <div className="hidden grid-cols-[1fr_110px_140px_110px_48px] gap-4 border-b border-line bg-sand px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span className="text-right">Total</span>
                  <span className="sr-only">Remove</span>
                </div>
                <ul className="divide-y divide-line">
                  {items.map((item) => (
                    <li key={item.productId} className="grid grid-cols-[80px_1fr] gap-4 p-4 sm:p-5 md:grid-cols-[1fr_110px_140px_110px_48px] md:items-center">
                      <div className="contents md:flex md:items-center md:gap-4">
                        <Link href={`/products/${item.productId}`} className="block h-20 w-20 shrink-0 overflow-hidden rounded-md border border-line">
                          <ProductImage images={item.image ? [item.image] : []} alt={item.pname} className="h-full w-full" sizes="80px" />
                        </Link>
                        <div className="min-w-0">
                          <Link href={`/products/${item.productId}`} className="line-clamp-2 text-sm font-semibold text-ink hover:text-forest">
                            {item.pname}
                          </Link>
                          {item.size && <p className="mt-0.5 text-xs text-muted-foreground">Size: {item.size}</p>}
                          {item.inStock !== false && (
                            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-forest">
                              <span className="h-1.5 w-1.5 rounded-full bg-forest" aria-hidden /> In stock
                            </p>
                          )}
                          {item.discountPercent > 0 && (
                            <span className="mt-1.5 inline-block rounded-md bg-sage-wash px-1.5 py-0.5 text-[11px] font-semibold text-forest">
                              {item.discountPercent}% bulk discount
                            </span>
                          )}
                          <p className="mt-1 text-sm md:hidden">
                            {formatINR(item.discountedPrice)}
                            {item.discountPercent > 0 && <span className="ml-1.5 text-xs text-muted-foreground line-through">{formatINR(item.price)}</span>}
                          </p>
                        </div>
                      </div>

                      <div className="hidden md:block">
                        <p className="text-sm font-semibold text-ink tabular-nums">{formatINR(item.discountedPrice)}</p>
                        {item.discountPercent > 0 && <p className="text-xs text-muted-foreground line-through">{formatINR(item.price)}</p>}
                      </div>

                      <div className="col-start-2 flex items-center justify-between gap-3 md:col-start-auto md:contents">
                        <div className="flex h-10 w-fit items-center overflow-hidden rounded-md border border-input">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.pname}`}
                            className="flex h-full w-10 items-center justify-center hover:bg-sand disabled:opacity-40"
                            disabled={update.isPending || item.quantity <= 1}
                            onClick={() => update.mutate({ productId: item.productId, quantity: item.quantity - 1 })}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-10 border-x border-input text-center text-sm tabular-nums leading-10">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.pname}`}
                            className="flex h-full w-10 items-center justify-center hover:bg-sand disabled:opacity-40"
                            disabled={update.isPending}
                            onClick={() => update.mutate({ productId: item.productId, quantity: item.quantity + 1 })}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-right text-sm font-semibold text-ink tabular-nums md:text-base">
                          {formatINR(item.discountedPrice * item.quantity)}
                        </p>
                        <button
                          type="button"
                          aria-label={`Remove ${item.pname}`}
                          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive md:justify-self-end"
                          onClick={() => remove.mutate(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <aside className="h-fit rounded-xl border border-line bg-sage-wash p-6 lg:sticky lg:top-36">
              <h2 className="text-xl font-semibold text-ink">Order summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal ({units} {units === 1 ? "item" : "items"})</dt>
                  <dd className="tabular-nums text-ink">{formatINR(subtotal + savings)}</dd>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between font-medium text-forest">
                    <dt>Bulk savings</dt>
                    <dd className="tabular-nums">−{formatINR(savings)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="text-muted-foreground">Calculated at checkout</dd>
                </div>
              </dl>
              <div className="mt-5 flex items-baseline justify-between border-t border-forest/15 pt-5">
                <span className="text-base font-semibold text-ink">
                  Total <span className="text-xs font-normal text-muted-foreground">(incl. taxes)</span>
                </span>
                <span className="text-2xl font-bold text-ink tabular-nums">{formatINR(subtotal)}</span>
              </div>
              <Button asChild size="lg" className="mt-6 w-full">
                <Link href="/checkout">
                  Proceed to checkout <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-forest" aria-hidden /> Secure payments via Razorpay
              </p>
            </aside>
          </div>
        )}
      </Container>
    </div>
  );
}
