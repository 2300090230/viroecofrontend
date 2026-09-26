"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { getOrders } from "@/lib/endpoints";
import { useAuth } from "@/providers/auth-provider";
import { formatINR } from "@/lib/format";

export default function OrdersPage() {
  const { session } = useAuth();
  const orders = useQuery({ queryKey: ["orders"], queryFn: getOrders, enabled: !!session });

  return (
    <div className="pt-24">
      <Container className="py-10">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Your orders</h1>

        {orders.isLoading ? (
          <div className="mt-10 space-y-3">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : (orders.data?.length ?? 0) === 0 ? (
          <div className="mt-16 flex flex-col items-start gap-4">
            <p className="font-display text-2xl">No orders yet.</p>
            <Button asChild className="cursor-pointer">
              <Link href="/products">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 divide-y divide-border border-y border-border">
            {orders.data!.map((o) => (
              <Link
                key={o.id}
                href={`/orders/${o.id}`}
                className="flex cursor-pointer items-center justify-between gap-4 py-5 transition-colors hover:bg-accent/40"
              >
                <div>
                  <p className="font-display text-lg">Order #{o.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(o.createdAt).toLocaleDateString()} ·{" "}
                    {o.items.reduce((n, i) => n + i.quantity, 0)} items
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={o.status} />
                  <span className="font-medium tabular-nums">{formatINR(o.totalAmount)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
