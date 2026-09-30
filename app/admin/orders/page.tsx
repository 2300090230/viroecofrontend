"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ShoppingCart,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  PackageCheck,
  Filter,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTablePagination } from "@/components/ui/pagination";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { adminGetOrders, adminUpdateOrderStatus } from "@/lib/endpoints";
import { formatINR } from "@/lib/format";

const STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const orders = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const fetched = await adminGetOrders();
      if (Array.isArray(fetched)) return fetched;
      return [];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await adminUpdateOrderStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
      toast.success("Order status updated successfully.");
    },
    onError: (e: Error) => toast.error(e.message || "Something went wrong."),
  });

  const list = orders.data ?? [];

  const filtered = useMemo(() => {
    return list.filter((o) => {
      const query = q.toLowerCase();
      const matchesSearch =
        !q.trim() ||
        String(o.id).includes(query) ||
        (o.customerName && o.customerName.toLowerCase().includes(query)) ||
        o.gmail.toLowerCase().includes(query) ||
        o.items.some((i) => i.pname.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "ALL" || o.status.toUpperCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [list, q, statusFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    return filtered.slice(page * pageSize, (page + 1) * pageSize);
  }, [filtered, page, pageSize]);

  return (
    <div className="space-y-8">
      <AdminBreadcrumb items={[{ label: "Orders" }]} />
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#17231C]">
          Order Fulfillment
        </h1>
        <p className="text-xs sm:text-sm text-[#5A6659] mt-1">
          Review, track, and update fulfillment milestones across client orders.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-2">
          {["ALL", ...STATUSES].map((st) => {
            const count =
              st === "ALL"
                ? list.length
                : list.filter((o) => o.status.toUpperCase() === st).length;
            const active = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(0);
                }}
                className={`px-3.5 py-1.5 rounded-none text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                  active
                    ? "bg-[#50644C] text-white shadow-xs"
                    : "bg-white text-[#5A6659] border border-[#DFD5C6] hover:border-[#50644C]/40 hover:text-[#17231C]"
                }`}
              >
                <span>{st === "ALL" ? "All Orders" : st.charAt(0) + st.slice(1).toLowerCase()}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-none font-bold ${
                    active ? "bg-white/20 text-white" : "bg-[#FAF9F5] text-[#5A6659]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#5A6659] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder="Search by order ID, customer name, email, item…"
            className="pl-10 h-10 bg-white border-[#DFD5C6] rounded-none text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div>
        {orders.isLoading ? (
          <Skeleton className="h-64 w-full rounded-none" />
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-none border border-[#DFD5C6] bg-white space-y-2">
            <p className="font-display text-lg text-[#17231C]">No matching orders found</p>
            <p className="text-xs text-[#5A6659]">Try adjusting your search or status filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-none border border-[#DFD5C6] bg-white shadow-xs">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-[#FAF9F5] text-left border-b border-[#DFD5C6]">
                  <tr>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Order ID</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Customer Details</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Items Ordered</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Date</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Total</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFD5C6]">
                  {paginated.map((o) => (
                    <tr key={o.id} className="hover:bg-[#FAF9F5]/50 transition-colors align-top">
                      <td className="px-5 py-4 font-mono font-bold text-xs text-[#50644C]">
                        #{o.id}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-xs text-[#17231C]">{o.customerName || "Customer"}</p>
                        <p className="text-[11px] text-[#5A6659]">{o.gmail}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#17231C]">
                        <div className="space-y-1 max-w-xs">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs gap-2">
                              <span className="truncate">{item.pname}</span>
                              <span className="font-semibold text-[#50644C] whitespace-nowrap">×{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#5A6659] whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 tabular-nums font-bold text-xs text-[#17231C] whitespace-nowrap">
                        {formatINR(o.totalAmount)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <Select
                          value={STATUSES.includes(o.status.toUpperCase()) ? o.status.toUpperCase() : undefined}
                          onValueChange={(status) => setStatus.mutate({ id: o.id, status })}
                        >
                          <SelectTrigger className="w-36 h-9 rounded-none border-[#DFD5C6] bg-[#FAF9F5] text-xs font-semibold cursor-pointer">
                            <SelectValue placeholder={o.status} />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s} className="text-xs font-medium cursor-pointer">
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

            {/* Pagination controls */}
            <DataTablePagination
              page={page}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={pageSize}
              pageSizeOptions={[10, 20, 50]}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              showPageSize={true}
              showItemCount={true}
              itemLabel="orders"
            />
          </div>
        )}
      </div>
    </div>
  );
}
