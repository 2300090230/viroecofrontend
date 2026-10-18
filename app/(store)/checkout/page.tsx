"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, MapPin, Plus, ShieldCheck } from "lucide-react";
import { Container } from "@/components/container";
import { CheckoutSteps } from "@/components/checkout-steps";
import { ProductImage } from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AddressFormDialog } from "@/components/address-form-dialog";
import { useCart } from "@/hooks/use-cart";
import { useAddresses } from "@/hooks/use-addresses";
import { useAuth } from "@/providers/auth-provider";
import { createPaymentOrder, verifyPayment } from "@/lib/endpoints";
import { loadRazorpay, type RazorpayOptions, type RazorpayResult } from "@/lib/razorpay";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { session } = useAuth();
  const { items, subtotal, savings, cart } = useCart();
  const { list } = useAddresses();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [paying, setPaying] = useState(false);

  const addresses = list.data ?? [];
  const selected = selectedId ?? (addresses.length > 0 ? addresses[0].id : null);

  useEffect(() => {
    if (!cart.isLoading && items.length === 0) router.replace("/cart");
  }, [cart.isLoading, items.length, router]);

  async function pay() {
    if (selected == null) {
      toast.error("Please select a delivery address.");
      return;
    }
    setPaying(true);
    try {
      const order = await createPaymentOrder();
      const Razorpay = await loadRazorpay();

      const options: RazorpayOptions = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "VIRO eco",
        description: "From nature, for a cleaner tomorrow",
        prefill: {
          name: session?.name || "",
          email: session?.gmail || "",
          contact: session?.contactno || "",
        },
        theme: { color: "#1F4D2E" },
        modal: {
          ondismiss: () => setPaying(false),
          escape: true,
        },
        order_id: order.razorpayOrderId,
        handler: async (r: RazorpayResult) => {
          try {
            // The backend checks Razorpay's signature and the paid amount before creating the order.
            await verifyPayment({
              razorpayOrderId: r.razorpay_order_id,
              razorpayPaymentId: r.razorpay_payment_id,
              razorpaySignature: r.razorpay_signature,
              addressId: selected,
            });
            qc.setQueryData(["cart"], { items: [] });
            qc.invalidateQueries({ queryKey: ["orders"] });
            qc.invalidateQueries({ queryKey: ["cart"] });
            toast.success("Payment successful — your order is placed!");
            router.push("/orders");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Payment verification failed");
            setPaying(false);
          }
        },
      };

      const rzp = new Razorpay(options);
      if (typeof rzp.on === "function") {
        rzp.on("payment.failed", (response) => {
          const reason = response?.error?.description || response?.error?.reason || "Payment was declined or cancelled";
          toast.error(`Payment failed: ${reason}`);
          setPaying(false);
        });
      }
      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start payment");
      setPaying(false);
    }
  }

  return (
    <div className="bg-cream">
      <Container className="py-8 sm:py-10">
        <CheckoutSteps current={1} />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="rounded-xl border border-line bg-white p-5 shadow-card sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-ink">Delivery address</h1>
                <p className="mt-1 text-sm text-muted-foreground">Choose where we should deliver your order.</p>
              </div>
              <AddressFormDialog
                trigger={
                  <Button variant="outline">
                    <Plus className="h-4 w-4" /> Add new address
                  </Button>
                }
              />
            </div>

            {list.isLoading ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[0, 1].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
              </div>
            ) : addresses.length === 0 ? (
              <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-line-strong bg-cream px-6 py-10 text-center">
                <MapPin className="h-8 w-8 text-forest/60" aria-hidden />
                <p className="mt-3 text-sm font-medium text-ink">No saved addresses yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Add a delivery address to continue.</p>
              </div>
            ) : (
              <div role="radiogroup" aria-label="Delivery address" className="mt-6 grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => {
                  const active = selected === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSelectedId(a.id)}
                      className={cn(
                        "relative rounded-lg border p-4 text-left transition-all",
                        active ? "border-forest bg-sage-wash ring-1 ring-forest" : "border-line hover:border-forest/40",
                      )}
                    >
                      {active && (
                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-forest text-white">
                          <Check className="h-3 w-3" aria-hidden />
                        </span>
                      )}
                      <p className="text-xs font-semibold uppercase tracking-wider text-forest">{a.addressType}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink">
                        {a.doorNumber}, {a.street}
                        <br />
                        {a.city}, {a.state} {a.zipCode}
                        <br />
                        {a.country}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="h-fit rounded-xl border border-line bg-sage-wash p-6 lg:sticky lg:top-36">
            <h2 className="text-xl font-semibold text-ink">Order summary</h2>
            <ul className="mt-5 space-y-3 border-b border-forest/15 pb-5">
              {items.map((i) => (
                <li key={i.productId} className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-line bg-white">
                    <ProductImage images={i.image ? [i.image] : []} alt={i.pname} className="h-full w-full" sizes="48px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{i.pname}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty {i.quantity}
                      {i.discountPercent > 0 && <span className="ml-1 font-medium text-forest">· {i.discountPercent}% off</span>}
                    </p>
                  </div>
                  <span className="text-sm tabular-nums text-ink">{formatINR(i.discountedPrice * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{formatINR(subtotal + savings)}</dd>
              </div>
              {savings > 0 && (
                <div className="flex justify-between font-medium text-forest">
                  <dt>Bulk savings</dt>
                  <dd className="tabular-nums">−{formatINR(savings)}</dd>
                </div>
              )}
            </dl>
            <div className="mt-5 flex items-baseline justify-between border-t border-forest/15 pt-5">
              <span className="font-semibold text-ink">Total</span>
              <span className="text-2xl font-bold tabular-nums text-ink">{formatINR(subtotal)}</span>
            </div>
            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={pay}
              disabled={paying || selected == null || items.length === 0}
            >
              {paying ? "Processing…" : `Pay ${formatINR(subtotal)}`}
            </Button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-forest" aria-hidden /> Secured by Razorpay
            </p>
          </aside>
        </div>
      </Container>
    </div>
  );
}
