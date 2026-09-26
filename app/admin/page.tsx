"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { IndianRupee, ShoppingCart, Users, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { adminGetOrders, adminGetCustomers } from "@/lib/endpoints";
import { formatINR } from "@/lib/format";

export default function AdminDashboard() {
  const orders = useQuery({ queryKey: ["admin", "orders"], queryFn: adminGetOrders });
  const customers = useQuery({ queryKey: ["admin", "customers"], queryFn: adminGetCustomers });

  const list = orders.data ?? [];
  const revenue = list
    .filter((o) => o.status.toUpperCase() !== "CANCELLED")
    .reduce((n, o) => n + o.totalAmount, 0);
  const pending = list.filter((o) => o.status.toUpperCase() === "PLACED").length;

  const tiles = [
    { label: "Revenue", value: formatINR(revenue), icon: IndianRupee, loading: orders.isLoading },
    { label: "Orders", value: String(list.length), icon: ShoppingCart, loading: orders.isLoading },
    { label: "Awaiting fulfilment", value: String(pending), icon: Clock, loading: orders.isLoading },
    {
      label: "Customers",
      value: String(customers.data?.length ?? 0),
      icon: Users,
      loading: customers.isLoading,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl tracking-tight">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">A snapshot of the Viroeco store.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {t.label}
              </span>
              <t.icon className="h-4 w-4 text-terra-deep" />
            </div>
            {t.loading ? (
              <Skeleton className="mt-3 h-8 w-24" />
            ) : (
              <p className="mt-3 font-display text-3xl">{t.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl">Recent orders</h2>
          <Link href="/admin/orders" className="cursor-pointer text-sm text-terra-deep hover:underline">
            View all →
          </Link>
        </div>
        {orders.isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : list.length === 0 ? (
          <p className="text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm">
              <thead className="bg-sand text-left">
                <tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Total</Th>
                </tr>
              </thead>
              <tbody>
                {list.slice(0, 6).map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <Td>#{o.id}</Td>
                    <Td>{o.customerName || o.gmail}</Td>
                    <Td>{new Date(o.createdAt).toLocaleDateString()}</Td>
                    <Td>
                      <OrderStatusBadge status={o.status} />
                    </Td>
                    <Td className="text-right tabular-nums">{formatINR(o.totalAmount)}</Td>
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

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 font-medium text-muted-foreground ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
