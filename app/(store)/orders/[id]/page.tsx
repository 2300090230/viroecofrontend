"use client";

import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/container";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { getOrder } from "@/lib/endpoints";
import { useAuth } from "@/providers/auth-provider";
import { formatINR } from "@/lib/format";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { session } = useAuth();
  const order = useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrder(id),
    enabled: !!session,
  });

  return (
    <div className="pt-24">
      <Container className="py-10">
        <Link href="/orders" className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
          ← All orders
        </Link>

        {order.isLoading ? (
          <Skeleton className="mt-6 h-64 w-full" />
        ) : order.isError || !order.data ? (
          <p className="mt-10 text-muted-foreground">Order not found.</p>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <h1 className="font-display text-4xl tracking-tight">Order #{order.data.id}</h1>
              <OrderStatusBadge status={order.data.status} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Placed {new Date(order.data.createdAt).toLocaleString()}
            </p>

            <ul className="mt-8 divide-y divide-border border-y border-border">
              {order.data.items.map((i) => (
                <li key={i.productId} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <Link
                      href={`/products/${i.productId}`}
                      className="cursor-pointer font-display text-lg hover:text-terra-deep"
                    >
                      {i.pname}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {formatINR(i.price)} × {i.quantity}
                    </p>
                  </div>
                  <span className="font-medium tabular-nums">{formatINR(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-end gap-8 text-lg">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold tabular-nums">{formatINR(order.data.totalAmount)}</span>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
