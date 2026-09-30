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
        <div className="mb-6 space-y-2">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span className="text-base leading-none group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>Back to Orders</span>
          </Link>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/orders" className="hover:text-foreground transition-colors">Orders</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Order #{id}</span>
          </nav>
        </div>

        {order.isLoading ? (
          <Skeleton className="mt-6 h-64 w-full" />
        ) : order.isError || !order.data ? (
          <p className="mt-10 text-muted-foreground">Order not found.</p>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <h1 className="font-display text-2xl sm:text-4xl tracking-tight">Order #{order.data.id}</h1>
              <OrderStatusBadge status={order.data.status} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Placed {new Date(order.data.createdAt).toLocaleString()}
            </p>

            <ul className="mt-8 divide-y divide-border border-y border-border">
              {order.data.items.map((i) => (
                <li key={i.productId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-4">
                  <div>
                    <Link
                      href={`/products/${i.productId}`}
                      className="cursor-pointer font-display text-base sm:text-lg hover:text-terra-deep leading-snug"
                    >
                      {i.pname}
                    </Link>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      {formatINR(i.price)} × {i.quantity}
                    </p>
                  </div>
                  <span className="font-medium text-sm sm:text-base tabular-nums self-end sm:self-center">{formatINR(i.price * i.quantity)}</span>
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
