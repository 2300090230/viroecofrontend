"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Plus,
  Tags,
  Layers,
  ExternalLink,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { ProductFormDialog } from "@/components/admin/product-form-dialog";
import { adminGetOrders, adminGetCustomers, getAllProducts, getCategories } from "@/lib/endpoints";
import { formatINR } from "@/lib/format";
import { ProductImage } from "@/components/product-image";
import type { AdminOrder, UserSummary, Product, Category } from "@/lib/types";

export default function AdminDashboard() {
  const orders = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      try {
        const fetched = await adminGetOrders();
        if (Array.isArray(fetched)) return fetched;
      } catch (err) {
        console.error("Failed to load admin orders:", err);
      }
      return [] as AdminOrder[];
    },
  });

  const customers = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: async () => {
      try {
        const fetched = await adminGetCustomers();
        if (Array.isArray(fetched)) return fetched;
      } catch (err) {
        console.error("Failed to load customers:", err);
      }
      return [] as UserSummary[];
    },
  });

  const products = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      try {
        const fetched = await getAllProducts();
        if (Array.isArray(fetched)) return fetched;
      } catch (err) {
        console.error("Failed to load products:", err);
      }
      return [] as Product[];
    },
  });

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const fetched = await getCategories();
        if (Array.isArray(fetched)) return fetched;
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
      return [] as Category[];
    },
  });

  const list = orders.data ?? [];
  const prodList = products.data ?? [];
  const catList = categories.data ?? [];
  const custList = customers.data ?? [];

  const revenue = list
    .filter((o) => o.status.toUpperCase() !== "CANCELLED")
    .reduce((n, o) => n + (o.totalAmount || 0), 0);
  const pending = list.filter((o) => o.status.toUpperCase() === "PLACED").length;

  const kpis = [
    {
      label: "Total Store Revenue",
      value: formatINR(revenue),
      subtext: `${list.length} orders recorded`,
      icon: IndianRupee,
      trend: "positive",
    },
    {
      label: "Total Orders",
      value: String(list.length),
      subtext: `${pending} awaiting fulfillment`,
      icon: ShoppingCart,
      trend: "neutral",
    },
    {
      label: "Active Catalog SKUs",
      value: String(prodList.length),
      subtext: `Across ${catList.length} categories`,
      icon: Package,
      trend: "positive",
    },
    {
      label: "Verified Accounts",
      value: String(custList.length),
      subtext: "Enterprise & Retail",
      icon: Users,
      trend: "positive",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#17231C]">
            Enterprise Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6659] mt-1">
            Real-time catalog performance, inventory health, and recent client orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild className="bg-[#50644C] hover:bg-[#243021] text-white rounded-none text-xs font-semibold cursor-pointer shadow-xs">
            <Link href="/admin/analysis" className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-emerald-300" /> Executive Analysis
            </Link>
          </Button>
          <ProductFormDialog
            trigger={
              <Button variant="outline" className="border-[#DFD5C6] hover:bg-[#FAF9F5] text-xs font-semibold rounded-none cursor-pointer">
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add SKU
              </Button>
            }
          />
          <Button asChild variant="outline" className="border-[#DFD5C6] hover:bg-[#FAF9F5] rounded-none text-xs font-semibold">
            <Link href="/admin/categories" className="flex items-center gap-1.5">
              <Tags className="h-3.5 w-3.5" /> Categories
            </Link>
          </Button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-none border border-[#DFD5C6] bg-white p-6 shadow-xs hover:shadow-md hover:border-[#50644C]/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">
                {kpi.label}
              </span>
              <div className="w-8 h-8 rounded-none bg-[#EDF2EB] text-[#50644C] flex items-center justify-center">
                <kpi.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-[#17231C] tracking-tight">
              {kpi.value}
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-700 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{kpi.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Category Breakdown & Quick Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Lines */}
        <div className="lg:col-span-2 rounded-none border border-[#DFD5C6] bg-white p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-[#17231C]">
                Product Lines &amp; Categories
              </h2>
              <p className="text-xs text-[#5A6659] mt-0.5">
                {prodList.length} total items distributed across {catList.length} categories.
              </p>
            </div>
            <Link
              href="/admin/categories"
              className="text-xs font-bold text-[#50644C] hover:underline flex items-center gap-1"
            >
              All {catList.length} Categories <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {catList.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6">No categories found in the database.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {catList.slice(0, 6).map((cat) => {
                const sampleProds = prodList.filter(
                  (p) =>
                    p.category?.toLowerCase() === cat.name?.toLowerCase() ||
                    p.subCategory?.toLowerCase() === cat.name?.toLowerCase()
                );
                const count = sampleProds.length;
                const sampleImages = sampleProds[0]?.productImages ?? [];

                return (
                  <Link
                    key={cat.id}
                    href={`/admin/products?category=${encodeURIComponent(cat.name)}`}
                    className="group relative rounded-none border border-[#DFD5C6] overflow-hidden bg-[#FAF9F5] p-3 flex flex-col justify-between hover:border-[#50644C]/40 hover:shadow-xs transition-all"
                  >
                    <div className="relative aspect-video rounded-none overflow-hidden mb-2 bg-[#F5EFE6]">
                      <ProductImage
                        images={sampleImages}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold text-[#17231C] group-hover:text-[#50644C] transition-colors">
                        {cat.name}
                      </p>
                      <p className="text-[10px] text-[#5A6659] truncate">{count} {count === 1 ? "item" : "items"}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Catalog Health & Quick Actions */}
        <div className="rounded-none border border-[#DFD5C6] bg-gradient-to-br from-[#50644C] to-[#1A2418] text-white p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-white/10 text-emerald-300 border border-white/15 text-xs font-semibold uppercase tracking-wider">
              Live Catalog Health
            </div>
            <h3 className="font-display text-2xl font-bold text-white leading-snug">
              {prodList.length} Genuine Biocomposite Products Ready
            </h3>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/10">
            <Link
              href="/admin/products"
              className="w-full flex items-center justify-between py-2.5 px-4 rounded-none bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
            >
              <span>Manage {prodList.length} Products</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </Link>
            <Link
              href="/products"
              target="_blank"
              className="w-full flex items-center justify-between py-2.5 px-4 rounded-none bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
            >
              <span>Preview Live Storefront</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-none border border-[#DFD5C6] bg-white p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-[#17231C]">
              Recent Orders &amp; Fulfillment
            </h2>
            <p className="text-xs text-[#5A6659] mt-0.5">
              Latest purchasing activity across commercial clients and retail customers.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-[#50644C] hover:text-[#243021]">
            <Link href="/admin/orders" className="flex items-center gap-1">
              View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        {orders.isLoading ? (
          <Skeleton className="h-48 w-full rounded-none" />
        ) : list.length === 0 ? (
          <p className="text-xs text-[#5A6659] py-8 text-center">No orders registered yet.</p>
        ) : (
          <div className="overflow-x-auto border border-[#DFD5C6] rounded-none">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-[#FAF9F5] text-left">
                <tr>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Order ID</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Customer</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Date</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Status</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659] text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFD5C6]">
                {list.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                    <td className="px-5 py-4 font-mono font-semibold text-xs text-[#50644C]">
                      #{o.id}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-xs text-[#17231C]">{o.customerName || "Customer"}</p>
                      <p className="text-[11px] text-[#5A6659]">{o.gmail}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#5A6659]">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-xs text-[#17231C] tabular-nums">
                      {formatINR(o.totalAmount)}
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
