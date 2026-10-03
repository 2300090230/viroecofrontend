"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Users, Search, ShieldCheck, UserCheck, UserX, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTablePagination } from "@/components/ui/pagination";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { adminGetCustomers, adminSetCustomerEnabled } from "@/lib/endpoints";
import { useAuth } from "@/providers/auth-provider";
import type { UserSummary } from "@/lib/types";

export default function AdminCustomersPage() {
  const qc = useQueryClient();
  const { session } = useAuth();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const customers = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: async () => {
      const fetched = await adminGetCustomers();
      if (Array.isArray(fetched)) return fetched;
      return [];
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ gmail, enabled }: { gmail: string; enabled: boolean }) => {
      return await adminSetCustomerEnabled(gmail, enabled);
    },
    onSuccess: (msg) => {
      qc.invalidateQueries({ queryKey: ["admin", "customers"] });
      qc.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
      toast.success(typeof msg === "string" ? msg : "Customer account updated successfully.");
    },
    onError: (e: Error) => toast.error(e.message || "Something went wrong."),
  });

  const list: UserSummary[] = customers.data ?? [];

  const filtered = useMemo(() => {
    if (!q.trim()) return list;
    const term = q.toLowerCase();
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.gmail.toLowerCase().includes(term) ||
        c.contactno.toLowerCase().includes(term) ||
        c.role.toLowerCase().includes(term)
    );
  }, [list, q]);

  const activeCount = list.filter((c) => c.enabled).length;
  const adminCount = list.filter((c) => c.role === "ADMIN").length;
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    return filtered.slice(page * pageSize, (page + 1) * pageSize);
  }, [filtered, page, pageSize]);

  return (
    <div className="space-y-8">
      <AdminBreadcrumb items={[{ label: "Customers" }]} />
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#17231C]">
          Customer Accounts
        </h1>
        <p className="text-xs sm:text-sm text-[#5A6659] mt-1">
          Manage registered client profiles, roles, and enterprise access permissions.
        </p>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-none border border-[#DFD5C6] bg-white shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Total Accounts</p>
          <p className="mt-2 font-display text-3xl font-bold text-[#17231C]">{list.length}</p>
        </div>
        <div className="p-5 rounded-none border border-[#DFD5C6] bg-white shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Active Status</p>
          <p className="mt-2 font-display text-3xl font-bold text-emerald-700">{activeCount}</p>
        </div>
        <div className="p-5 rounded-none border border-[#DFD5C6] bg-white shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Administrators</p>
          <p className="mt-2 font-display text-3xl font-bold text-[#50644C]">{adminCount}</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#5A6659] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(0);
          }}
          placeholder="Search customers by name, email, phone…"
          className="pl-10 h-10 bg-white border-[#DFD5C6] rounded-none text-sm"
        />
      </div>

      {/* Table */}
      <div>
        {customers.isLoading ? (
          <Skeleton className="h-64 w-full rounded-none" />
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-none border border-[#DFD5C6] bg-white space-y-2">
            <p className="font-display text-lg text-[#17231C]">No matching accounts found</p>
            <p className="text-xs text-[#5A6659]">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-none border border-[#DFD5C6] bg-white shadow-xs">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-[#FAF9F5] text-left border-b border-[#DFD5C6]">
                  <tr>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Member</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Email Address</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Phone</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Role</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Account Status</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFD5C6]">
                  {paginated.map((c) => {
                    const isSelf = c.gmail === session?.gmail;
                    return (
                      <tr key={c.gmail} className="hover:bg-[#FAF9F5]/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-none bg-[#EDF2EB] text-[#50644C] font-bold text-xs flex items-center justify-center border border-[#50644C]/10">
                              {c.name ? c.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <span className="font-semibold text-xs text-[#17231C]">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-[#5A6659]">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#5A6659]/60" />
                            <span>{c.gmail}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-[#5A6659]">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#5A6659]/60" />
                            <span>{c.contactno || "—"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={
                              c.role === "ADMIN"
                                ? "bg-[#50644C]/10 text-[#50644C] border-[#50644C]/20 font-semibold text-[10px]"
                                : "text-[#5A6659] border-[#DFD5C6] text-[10px]"
                            }
                          >
                            {c.role}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {c.enabled ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-none bg-emerald-600" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                              <span className="w-1.5 h-1.5 rounded-none bg-red-600" />
                              Disabled
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`text-xs rounded-none cursor-pointer ${
                              isSelf
                                ? "opacity-50"
                                : c.enabled
                                ? "border-red-200 text-red-700 hover:bg-red-50"
                                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            }`}
                            disabled={isSelf || toggle.isPending}
                            onClick={() => toggle.mutate({ gmail: c.gmail, enabled: !c.enabled })}
                          >
                            {isSelf ? "Current User" : c.enabled ? "Disable" : "Enable"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
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
              itemLabel="accounts"
            />
          </div>
        )}
      </div>
    </div>
  );
}
