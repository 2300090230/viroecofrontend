"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AddressFormDialog } from "@/components/address-form-dialog";
import { useCart } from "@/hooks/use-cart";
import { useAddresses } from "@/hooks/use-addresses";
import { useAuth } from "@/providers/auth-provider";
import { createPaymentOrder, verifyPayment } from "@/lib/endpoints";
import { loadRazorpay } from "@/lib/razorpay";
import { formatINR } from "@/lib/format";
import { ApiError } from "@/lib/api";
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
      const rzp = new Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: "Viroeco",
        description: "Sustainable home & kitchen",
        prefill: { name: session?.name, email: session?.gmail, contact: session?.contactno },
        theme: { color: "#C08058" },
        modal: { ondismiss: () => setPaying(false) },
        handler: async (r) => {
          try {
            await verifyPayment({
              razorpayOrderId: r.razorpay_order_id,
              razorpayPaymentId: r.razorpay_payment_id,
              razorpaySignature: r.razorpay_signature,
              addressId: selected,
            });
            qc.setQueryData(["cart"], { items: [] });
            qc.invalidateQueries({ queryKey: ["orders"] });
            toast.success("Payment successful — your order is placed!");
            router.push("/orders");
          } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Payment verification failed");
            setPaying(false);
          }
        },
      });
      rzp.open();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not start payment");
      setPaying(false);
    }
  }

  return (
    <div className="pt-24">
      <Container className="py-10">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">Checkout</h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Delivery address</h2>
              <AddressFormDialog
                trigger={
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <Plus className="mr-1 h-4 w-4" /> New
                  </Button>
                }
              />
            </div>

            {list.isLoading ? (
              <div className="mt-4 space-y-3">
                {[0, 1].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : addresses.length === 0 ? (
              <p className="mt-4 text-muted-foreground">
                No saved addresses yet — add one to continue.
              </p>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedId(a.id)}
                    className={cn(
                      "cursor-pointer border p-4 text-left transition-colors",
                      selected === a.id
                        ? "border-terra ring-1 ring-terra"
                        : "border-border hover:border-terra/50",
                    )}
                  >
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {a.addressType}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">
                      {a.doorNumber}, {a.street}
                      <br />
                      {a.city}, {a.state} {a.zipCode}
                      <br />
                      {a.country}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>

          <aside className="h-fit border border-border bg-card p-6">
            <h2 className="font-display text-xl">Order summary</h2>
            <ul className="mt-4 space-y-2 border-b border-border pb-4 text-sm">
              {items.map((i) => (
                <li key={i.productId} className="flex justify-between gap-2">
                  <span className="text-muted-foreground">
                    {i.pname} × {i.quantity}
                    {i.discountPercent > 0 && (
                      <span className="ml-1 text-moss-deep font-medium">({i.discountPercent}% off)</span>
                    )}
                  </span>
                  <span className="tabular-nums">{formatINR(i.discountedPrice * i.quantity)}</span>
                </li>
              ))}
            </ul>
            {savings > 0 && (
              <div className="mt-4 flex justify-between text-sm text-moss-deep font-medium">
                <span>Bulk savings</span>
                <span className="tabular-nums">−{formatINR(savings)}</span>
              </div>
            )}
            <div className="mt-4 flex justify-between font-medium">
              <span>Total</span>
              <span className="tabular-nums">{formatINR(subtotal)}</span>
            </div>
            <Button
              size="lg"
              className="mt-6 w-full cursor-pointer"
              onClick={pay}
              disabled={paying || selected == null || items.length === 0}
            >
              {paying ? "Processing…" : `Pay ${formatINR(subtotal)}`}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Secured by Razorpay · test mode
            </p>
          </aside>
        </div>
      </Container>
    </div>
  );
}
