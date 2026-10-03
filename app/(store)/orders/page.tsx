"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { DataTablePagination } from "@/components/ui/pagination";
import { getOrders } from "@/lib/endpoints";
import { useAuth } from "@/providers/auth-provider";
import { formatINR } from "@/lib/format";

export default function OrdersPage() {
  const { session } = useAuth();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const orders = useQuery({ queryKey: ["orders"], queryFn: getOrders, enabled: !!session });

  const list = orders.data ?? [];
  const totalPages = Math.ceil(list.length / pageSize) || 1;
  const paginated = useMemo(() => {
    return list.slice(page * pageSize, (page + 1) * pageSize);
  }, [list, page, pageSize]);

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
        ) : list.length === 0 ? (
          <div className="mt-16 flex flex-col items-start gap-4">
            <p className="font-display text-2xl">No orders yet.</p>
            <Button asChild className="cursor-pointer">
              <Link href="/products">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            <div className="divide-y divide-border border-y border-border">
              {paginated.map((o) => (
                <Link
                  key={o.id}
                  href={`/orders/${o.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 py-4 sm:py-5 transition-colors hover:bg-accent/40"
                >
                  <div>
                    <p className="font-display text-base sm:text-lg">Order #{o.id}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      {new Date(o.createdAt).toLocaleDateString()} ·{" "}
                      {o.items.reduce((n, i) => n + i.quantity, 0)} items
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                    <OrderStatusBadge status={o.status} />
                    <span className="font-medium text-sm sm:text-base tabular-nums">{formatINR(o.totalAmount)}</span>
                  </div>
                </Link>
              ))}
            </div>

            <DataTablePagination
              page={page}
              totalPages={totalPages}
              totalItems={list.length}
              pageSize={pageSize}
              pageSizeOptions={[5, 10, 20]}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              showPageSize={list.length > 5}
              showItemCount={true}
              itemLabel="orders"
            />
          </div>
        )}
      </Container>
    </div>
  );
}

