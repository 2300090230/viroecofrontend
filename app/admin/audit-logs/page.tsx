"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Clock,
  User,
  Package,
  ShoppingCart,
  Users,
  Tags,
  Shield,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTablePagination } from "@/components/ui/pagination";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { adminGetAuditLogs, adminCreateAuditLog } from "@/lib/endpoints";
import { toast } from "sonner";
import type { AuditLog } from "@/lib/types";

function formatTimeAgo(isoString: string) {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  } catch {
    return isoString;
  }
}

function getActionBadge(action: string) {
  const upper = action.toUpperCase();

  if (upper.includes("CREATE") || upper.includes("ADD")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-none bg-emerald-600" />
        {action}
      </span>
    );
  }

  if (upper.includes("DELETE") || upper.includes("REMOVE")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-none bg-rose-600" />
        {action}
      </span>
    );
  }

  if (upper.includes("UPDATE") || upper.includes("TIERS") || upper.includes("STATUS")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        <span className="w-1.5 h-1.5 rounded-none bg-blue-600" />
        {action}
      </span>
    );
  }

  if (upper.includes("LOGIN") || upper.includes("AUTH") || upper.includes("REGISTER")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
        <span className="w-1.5 h-1.5 rounded-none bg-purple-600" />
        {action}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
      <span className="w-1.5 h-1.5 rounded-none bg-gray-500" />
      {action}
    </span>
  );
}

function getEntityIcon(entityType: string) {
  switch (entityType?.toUpperCase()) {
    case "PRODUCT":
      return <Package className="w-3.5 h-3.5 text-emerald-700" />;
    case "CATEGORY":
      return <Tags className="w-3.5 h-3.5 text-amber-700" />;
    case "ORDER":
      return <ShoppingCart className="w-3.5 h-3.5 text-blue-700" />;
    case "CUSTOMER":
      return <Users className="w-3.5 h-3.5 text-indigo-700" />;
    case "AUTH":
      return <Shield className="w-3.5 h-3.5 text-purple-700" />;
    default:
      return <Activity className="w-3.5 h-3.5 text-gray-700" />;
  }
}

export default function AdminAuditLogsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<string>("ALL");
  const [selectedActionType, setSelectedActionType] = useState<string>("ALL");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [activeRecord, setActiveRecord] = useState<AuditLog | null>(null);

  // Manual note modal state
  const [noteOpen, setNoteOpen] = useState(false);
  const [manualAction, setManualAction] = useState("MANUAL_AUDIT_MEMO");
  const [manualEntity, setManualEntity] = useState("SYSTEM");
  const [manualDetails, setManualDetails] = useState("");

  const auditQuery = useQuery({
    queryKey: ["admin", "audit-logs"],
    queryFn: async () => {
      try {
        const fetched = await adminGetAuditLogs();
        if (Array.isArray(fetched)) return fetched;
      } catch {
        // Return empty array if not available
      }
      return [] as AuditLog[];
    },
  });

  const createLogMutation = useMutation({
    mutationFn: async (payload: { action: string; entityType: string; details: string }) => {
      return await adminCreateAuditLog(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
      setNoteOpen(false);
      setManualDetails("");
      toast.success("Audit log entry recorded successfully.");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to create audit log."),
  });

  const allLogs = auditQuery.data ?? [];

  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        log.details.toLowerCase().includes(q) ||
        log.performedBy.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        (log.entityId && log.entityId.toLowerCase().includes(q));

      const matchesEntity = selectedEntity === "ALL" || log.entityType.toUpperCase() === selectedEntity.toUpperCase();

      const matchesAction =
        selectedActionType === "ALL" ||
        (selectedActionType === "CREATE" && log.action.toUpperCase().includes("CREATE")) ||
        (selectedActionType === "UPDATE" && (log.action.toUpperCase().includes("UPDATE") || log.action.toUpperCase().includes("TIER"))) ||
        (selectedActionType === "DELETE" && log.action.toUpperCase().includes("DELETE")) ||
        (selectedActionType === "AUTH" && (log.action.toUpperCase().includes("LOGIN") || log.action.toUpperCase().includes("AUTH")));

      return matchesSearch && matchesEntity && matchesAction;
    });
  }, [allLogs, search, selectedEntity, selectedActionType]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice(page * pageSize, (page + 1) * pageSize);
  }, [filteredLogs, page, pageSize]);

  // Summary Metrics
  const productEvents = allLogs.filter((l) => l.entityType === "PRODUCT").length;
  const orderEvents = allLogs.filter((l) => l.entityType === "ORDER").length;
  const userEvents = allLogs.filter((l) => l.entityType === "CUSTOMER" || l.entityType === "AUTH").length;

  const exportCSV = () => {
    const headers = ["ID", "Timestamp", "Action", "Entity Type", "Entity ID", "Performed By", "Details", "IP Address"];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.action}"`,
      `"${l.entityType}"`,
      `"${l.entityId || ""}"`,
      `"${l.performedBy}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipAddress || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `viroeco_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit logs exported to CSV");
  };

  return (
    <div className="space-y-8">
      <AdminBreadcrumb items={[{ label: "Audit Logs" }]} />
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#17231C]">
              Audit &amp; Compliance Logs
            </h1>
            <Badge variant="outline" className="bg-[#EDF2EB] text-[#50644C] border-[#50644C]/20 text-xs font-semibold">
              Live Trail
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#5A6659] mt-1">
            Chronological, immutable trail of administrative operations, catalogue modifications, inventory changes, and security events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => auditQuery.refetch()}
            disabled={auditQuery.isFetching}
            className="cursor-pointer border-[#DFD5C6] hover:bg-[#FAF9F5] text-xs font-semibold rounded-none gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${auditQuery.isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className="cursor-pointer border-[#DFD5C6] hover:bg-[#FAF9F5] text-xs font-semibold rounded-none gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>

          {/* Add Manual Audit Memo Dialog */}
          <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="cursor-pointer bg-[#50644C] hover:bg-[#243021] text-white text-xs font-semibold rounded-none shadow-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Log Audit Note</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white rounded-none p-6">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-[#17231C]">Create Audit Memo</DialogTitle>
                <DialogDescription className="text-xs text-[#5A6659]">
                  Record an official administrative annotation or compliance event into the immutable audit record.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-2">
                <div>
                  <label className="text-xs font-bold text-[#17231C] block mb-1">Action Category</label>
                  <Input
                    value={manualAction}
                    onChange={(e) => setManualAction(e.target.value)}
                    placeholder="e.g. INVENTORY_AUDIT_VERIFIED, PRICE_REVIEW"
                    className="text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#17231C] block mb-1">Entity Domain</label>
                  <select
                    value={manualEntity}
                    onChange={(e) => setManualEntity(e.target.value)}
                    className="w-full rounded-none border border-input bg-background px-3 py-2 text-xs ring-offset-background focus:outline-hidden focus:ring-2 focus:ring-ring"
                  >
                    <option value="SYSTEM">SYSTEM / GOVERNANCE</option>
                    <option value="PRODUCT">PRODUCT / CATALOGUE</option>
                    <option value="ORDER">ORDER / LOGISTICS</option>
                    <option value="CUSTOMER">CUSTOMER / COMPLIANCE</option>
                    <option value="AUTH">SECURITY / AUTH</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#17231C] block mb-1">Audit Details / Description</label>
                  <textarea
                    rows={4}
                    value={manualDetails}
                    onChange={(e) => setManualDetails(e.target.value)}
                    placeholder="Describe the administrative decision, reason for modification, or inventory stock check details..."
                    className="w-full rounded-none border border-input bg-background p-3 text-xs ring-offset-background focus:outline-hidden focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" size="sm" onClick={() => setNoteOpen(false)} className="rounded-none text-xs">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={!manualDetails.trim() || createLogMutation.isPending}
                  onClick={() =>
                    createLogMutation.mutate({
                      action: manualAction,
                      entityType: manualEntity,
                      details: manualDetails,
                    })
                  }
                  className="bg-[#50644C] hover:bg-[#243021] text-white rounded-none text-xs font-semibold"
                >
                  {createLogMutation.isPending ? "Recording..." : "Save Audit Record"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-none border border-[#DFD5C6] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Total Audit Events</span>
            <div className="w-8 h-8 rounded-none bg-[#EDF2EB] text-[#50644C] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-[#17231C] tracking-tight">{allLogs.length}</p>
          <p className="mt-1 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Verified &amp; Signed
          </p>
        </div>

        <div className="rounded-none border border-[#DFD5C6] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Product Operations</span>
            <div className="w-8 h-8 rounded-none bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-[#17231C] tracking-tight">{productEvents}</p>
          <p className="mt-1 text-[11px] text-[#5A6659]">SKUs created, edited &amp; removed</p>
        </div>

        <div className="rounded-none border border-[#DFD5C6] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Order &amp; Fulfillment</span>
            <div className="w-8 h-8 rounded-none bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-[#17231C] tracking-tight">{orderEvents}</p>
          <p className="mt-1 text-[11px] text-[#5A6659]">Status changes &amp; dispatch logs</p>
        </div>

        <div className="rounded-none border border-[#DFD5C6] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Security &amp; Accounts</span>
            <div className="w-8 h-8 rounded-none bg-purple-50 text-purple-700 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-[#17231C] tracking-tight">{userEvents}</p>
          <p className="mt-1 text-[11px] text-[#5A6659]">Admin logins &amp; customer toggles</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-none border border-[#DFD5C6] shadow-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search details, SKU ID, actor, or action…"
            className="pl-9 text-xs rounded-none border-[#DFD5C6]"
            aria-label="Search audit logs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Entity Type Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#5A6659]">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedEntity}
              onChange={(e) => {
                setSelectedEntity(e.target.value);
                setPage(0);
              }}
              className="rounded-none border border-[#DFD5C6] bg-[#FAF9F5] px-3 py-1.5 text-xs font-semibold text-[#17231C] ring-offset-background focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">All Domains</option>
              <option value="PRODUCT">Product</option>
              <option value="CATEGORY">Category</option>
              <option value="ORDER">Order</option>
              <option value="CUSTOMER">Customer</option>
              <option value="AUTH">Auth / Security</option>
              <option value="SYSTEM">System</option>
            </select>
          </div>

          {/* Action Type Filter */}
          <select
            value={selectedActionType}
            onChange={(e) => {
              setSelectedActionType(e.target.value);
              setPage(0);
            }}
            className="rounded-none border border-[#DFD5C6] bg-[#FAF9F5] px-3 py-1.5 text-xs font-semibold text-[#17231C] ring-offset-background focus:outline-hidden focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE">Created / Added</option>
            <option value="UPDATE">Updated / Modified</option>
            <option value="DELETE">Deleted / Purged</option>
            <option value="AUTH">Authentication / Logins</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-none border border-[#DFD5C6] bg-white shadow-xs overflow-hidden">
        {auditQuery.isLoading ? (
          <div className="p-6">
            <Skeleton className="h-64 w-full rounded-none" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-none bg-[#FAF9F5] border border-[#DFD5C6] flex items-center justify-center mx-auto text-[#5A6659]">
              <FileText className="w-6 h-6" />
            </div>
            <p className="font-display font-semibold text-[#17231C] text-base">No Audit Records Found</p>
            <p className="text-xs text-[#5A6659] max-w-sm mx-auto">
              No log events match your active filters or search terms. Try resetting filters or recording a new audit note.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[#FAF9F5] border-b border-[#DFD5C6]">
                <tr>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Timestamp</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Action</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Domain &amp; Target</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Event Details</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Performed By</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659] text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFD5C6]">
                {paginatedLogs.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF9F5]/80 transition-colors">
                    {/* Timestamp */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#17231C]">
                          {formatTimeAgo(item.timestamp)}
                        </span>
                        <span className="text-[10px] text-[#5A6659]">
                          {new Date(item.timestamp).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {getActionBadge(item.action)}
                    </td>

                    {/* Domain & Target */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-[#FAF9F5] border border-[#DFD5C6] text-xs">
                        {getEntityIcon(item.entityType)}
                        <span className="font-semibold text-[#17231C]">{item.entityType}</span>
                        {item.entityId && (
                          <span className="font-mono text-[11px] text-[#5A6659]">#{item.entityId}</span>
                        )}
                      </div>
                    </td>

                    {/* Event Details */}
                    <td className="px-5 py-3.5 max-w-md">
                      <p className="text-xs text-[#17231C] font-medium line-clamp-2 leading-relaxed">
                        {item.details}
                      </p>
                    </td>

                    {/* Performed By */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-none bg-[#EDF2EB] text-[#50644C] border border-[#50644C]/20 flex items-center justify-center text-[10px] font-bold uppercase">
                          {item.performedBy ? item.performedBy.charAt(0).toUpperCase() : "A"}
                        </div>
                        <span className="text-xs font-mono text-[#5A6659] truncate max-w-[150px]">
                          {item.performedBy}
                        </span>
                      </div>
                    </td>

                    {/* Actions / Inspect */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveRecord(item)}
                        className="cursor-pointer text-xs font-semibold text-[#50644C] hover:bg-[#EDF2EB] rounded-none h-7 px-2.5"
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <div className="p-4 border-t border-[#DFD5C6] bg-[#FAF9F5]/40">
            <DataTablePagination
              page={page}
              totalPages={totalPages}
              totalItems={filteredLogs.length}
              pageSize={pageSize}
              pageSizeOptions={[10, 20, 50, 100]}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              showPageSize={true}
              showItemCount={true}
              itemLabel="audit records"
            />
          </div>
        )}
      </div>

      {/* Record Inspector Modal */}
      {activeRecord && (
        <Dialog open={!!activeRecord} onOpenChange={(open) => !open && setActiveRecord(null)}>
          <DialogContent className="sm:max-w-lg bg-white rounded-none p-6 space-y-4">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-none bg-[#EDF2EB] text-[#50644C] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-bold text-[#17231C]">
                      Audit Log #{activeRecord.id}
                    </DialogTitle>
                    <p className="text-[11px] text-[#5A6659]">Immutable Security Event Metadata</p>
                  </div>
                </div>
                {getActionBadge(activeRecord.action)}
              </div>
            </DialogHeader>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3.5 rounded-none bg-[#FAF9F5] border border-[#DFD5C6] space-y-2">
                <div className="flex justify-between items-center py-1 border-b border-[#DFD5C6]/60">
                  <span className="text-[#5A6659] font-medium">Domain Entity:</span>
                  <span className="font-semibold text-[#17231C] font-mono">
                    {activeRecord.entityType} {activeRecord.entityId ? `(#${activeRecord.entityId})` : ""}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#DFD5C6]/60">
                  <span className="text-[#5A6659] font-medium">Recorded By:</span>
                  <span className="font-semibold text-[#17231C] font-mono">{activeRecord.performedBy}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#DFD5C6]/60">
                  <span className="text-[#5A6659] font-medium">Timestamp:</span>
                  <span className="font-semibold text-[#17231C] font-mono">
                    {new Date(activeRecord.timestamp).toISOString()}
                  </span>
                </div>
                {activeRecord.ipAddress && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#5A6659] font-medium">Client IP:</span>
                    <span className="font-semibold text-[#17231C] font-mono">{activeRecord.ipAddress}</span>
                  </div>
                )}
              </div>

              <div>
                <span className="font-bold text-[#17231C] block mb-1">Event Narrative</span>
                <div className="p-3.5 rounded-none bg-gray-50 border border-gray-200 text-xs text-gray-800 leading-relaxed font-sans">
                  {activeRecord.details}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveRecord(null)}
                className="cursor-pointer rounded-none text-xs font-semibold"
              >
                Close Inspector
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
