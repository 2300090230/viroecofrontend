"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminGetOrders, adminUpdateOrderStatus } from "@/lib/endpoints";
import { formatINR } from "@/lib/format";

const STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const qc = useQueryClient();
  const orders = useQuery({ queryKey: ["admin", "orders"], queryFn: adminGetOrders });

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminUpdateOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Order status updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const list = orders.data ?? [];

  return (
    <div>
      <h1 className="font-display text-4xl tracking-tight">Orders</h1>
      <p className="mt-1 text-muted-foreground">{list.length} orders across all customers.</p>

      <div className="mt-8">
        {orders.isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : list.length === 0 ? (
          <p className="text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto border border-border">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-sand text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Order</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Items</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Total</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((o) => (
                  <tr key={o.id} className="border-t border-border align-top">
                    <td className="px-4 py-3 font-medium">#{o.id}</td>
                    <td className="px-4 py-3">
                      <div>{o.customerName || "—"}</div>
                      <div className="text-xs text-muted-foreground">{o.gmail}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {o.items.map((i) => `${i.pname} ×${i.quantity}`).join(", ")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{formatINR(o.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <Select
                        value={STATUSES.includes(o.status.toUpperCase()) ? o.status.toUpperCase() : undefined}
                        onValueChange={(status) => setStatus.mutate({ id: o.id, status })}
                      >
                        <SelectTrigger className="w-36 cursor-pointer">
                          <SelectValue placeholder={o.status} />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
