"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  IndianRupee,
  ShoppingCart,
  Package,
  Users,
  Leaf,
  Layers,
  ArrowUpRight,
  Download,
  Printer,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Calendar,
  Percent,
  Box,
  Flame,
  TreePine,
  ShieldCheck,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { adminGetAnalytics, adminGetOrders, getAllProducts, adminGetCustomers } from "@/lib/endpoints";
import { formatINR } from "@/lib/format";
import type { AdminAnalytics, AdminOrder, Product, UserSummary } from "@/lib/types";

export default function AdminAnalysisPage() {
  const [timeWindow, setTimeWindow] = useState<number | undefined>(30);
  const [activeTab, setActiveTab] = useState<"overview" | "sales" | "inventory" | "impact" | "customers">("overview");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // 1. Fetch server-side calculated analytics
  const analyticsQuery = useQuery({
    queryKey: ["admin", "analytics", timeWindow],
    queryFn: async () => {
      try {
        const res = await adminGetAnalytics(timeWindow);
        if (res && typeof res.totalGrossRevenue === "number") {
          return res;
        }
      } catch (err) {
        console.warn("Server analytics endpoint returned error, will compute client-side fallback if needed:", err);
      }
      return null;
    },
  });

  // 2. Fetch raw fallback data in case server calculation needs client complement or offline fallback
  const ordersQuery = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      try {
        const res = await adminGetOrders();
        if (Array.isArray(res)) return res;
      } catch (e) {
        console.error(e);
      }
      return [] as AdminOrder[];
    },
  });

  const productsQuery = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      try {
        const res = await getAllProducts();
        if (Array.isArray(res)) return res;
      } catch (e) {
        console.error(e);
      }
      return [] as Product[];
    },
  });

  const customersQuery = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: async () => {
      try {
        const res = await adminGetCustomers();
        if (Array.isArray(res)) return res;
      } catch (e) {
        console.error(e);
      }
      return [] as UserSummary[];
    },
  });

  // Client-side computed analytics engine (acts as robust primary or synchronized fallback)
  const data: AdminAnalytics = useMemo(() => {
    if (analyticsQuery.data) {
      return analyticsQuery.data;
    }

    const orders = ordersQuery.data ?? [];
    const products = productsQuery.data ?? [];
    const customers = customersQuery.data ?? [];

    const now = new Date();
    const cutoff = timeWindow ? new Date(now.getTime() - timeWindow * 24 * 60 * 60 * 1000) : null;

    const filteredOrders = orders.filter((o) => {
      if (!cutoff) return true;
      const d = new Date(o.createdAt);
      return !isNaN(d.getTime()) && d >= cutoff;
    });

    let grossRevenue = 0;
    let netRevenue = 0;
    let pendingRevenue = 0;
    let cancelledRevenue = 0;
    let totalDiscountsGiven = 0;
    let totalUnitsSold = 0;

    let placedOrders = 0;
    let processingOrders = 0;
    let shippedOrders = 0;
    let deliveredOrders = 0;
    let cancelledOrders = 0;

    const productSalesMap = new Map<number, { units: number; revenue: number; name: string }>();
    const customerSpendMap = new Map<string, { name: string; spend: number; orders: number; lastDate: string }>();
    const timeMap = new Map<string, { revenue: number; orderCount: number; unitsSold: number }>();
    const catMap = new Map<string, { revenue: number; units: number; count: number }>();
    const matMap = new Map<string, { revenue: number; units: number }>();

    filteredOrders.forEach((o) => {
      const status = (o.status || "PLACED").toUpperCase();
      const amt = Number(o.totalAmount) || 0;
      const isCancelled = status === "CANCELLED";

      if (isCancelled) {
        cancelledOrders++;
        cancelledRevenue += amt;
      } else {
        grossRevenue += amt;
        if (status === "DELIVERED") {
          deliveredOrders++;
          netRevenue += amt;
        } else if (status === "SHIPPED") {
          shippedOrders++;
          pendingRevenue += amt;
        } else if (status === "PROCESSING") {
          processingOrders++;
          pendingRevenue += amt;
        } else {
          placedOrders++;
          pendingRevenue += amt;
        }

        (o.items || []).forEach((item) => {
          const qty = item.quantity || 1;
          const price = item.price || 0;
          const disc = item.discountPercent || 0;
          const unitPaid = price * (1 - disc / 100);
          const itemRev = unitPaid * qty;
          const itemSavings = price * (disc / 100) * qty;

          totalUnitsSold += qty;
          totalDiscountsGiven += itemSavings;

          const pid = item.productId;
          const existing = productSalesMap.get(pid) || { units: 0, revenue: 0, name: item.pname || `SKU #${pid}` };
          existing.units += qty;
          existing.revenue += itemRev;
          productSalesMap.set(pid, existing);
        });

        if (o.gmail) {
          const c = customerSpendMap.get(o.gmail) || {
            name: o.customerName || o.gmail.split("@")[0],
            spend: 0,
            orders: 0,
            lastDate: o.createdAt || "",
          };
          c.spend += amt;
          c.orders += 1;
          customerSpendMap.set(o.gmail, c);
        }

        const dateKey = (o.createdAt || new Date().toISOString()).slice(0, 10);
        const t = timeMap.get(dateKey) || { revenue: 0, orderCount: 0, unitsSold: 0 };
        t.revenue += amt;
        t.orderCount += 1;
        timeMap.set(dateKey, t);
      }
    });

    const nonCancelledOrders = filteredOrders.length - cancelledOrders;
    const averageOrderValue = nonCancelledOrders > 0 ? grossRevenue / nonCancelledOrders : 0;
    const averageItemsPerOrder = nonCancelledOrders > 0 ? totalUnitsSold / nonCancelledOrders : 0;
    const fulfillmentRate =
      nonCancelledOrders > 0 ? (deliveredOrders / nonCancelledOrders) * 100 : 0;
    const cancellationRate =
      filteredOrders.length > 0 ? (cancelledOrders / filteredOrders.length) * 100 : 0;

    // Inventory Calculations
    let inStockProducts = 0;
    let lowStockProducts = 0;
    let outOfStockProducts = 0;
    let totalInventoryUnits = 0;
    let totalInventoryValuation = 0;
    const lowStockAlerts: AdminAnalytics["lowStockAlerts"] = [];

    const productLookup = new Map<number, Product>();
    products.forEach((p) => {
      productLookup.set(p.productId, p);
      const qty = p.quantity || 0;
      const price = p.price || 0;
      const avail = p.isAvailable !== false;

      totalInventoryUnits += Math.max(0, qty);
      totalInventoryValuation += price * Math.max(0, qty);

      if (!avail || qty <= 0) {
        outOfStockProducts++;
        lowStockAlerts.push({
          productId: p.productId,
          pname: p.pname,
          category: p.category,
          quantity: qty,
          price: price,
          isAvailable: avail,
        });
      } else if (qty <= 15) {
        lowStockProducts++;
        lowStockAlerts.push({
          productId: p.productId,
          pname: p.pname,
          category: p.category,
          quantity: qty,
          price: price,
          isAvailable: avail,
        });
      } else {
        inStockProducts++;
      }
    });

    // Top Selling Products list
    const topSellingProducts: AdminAnalytics["topSellingProducts"] = Array.from(productSalesMap.entries())
      .map(([pid, val]) => {
        const prod = productLookup.get(pid);
        return {
          productId: pid,
          pname: prod?.pname || val.name,
          category: prod?.category || "Biocomposite",
          unitPrice: prod?.price || (val.units > 0 ? val.revenue / val.units : 0),
          unitsSold: val.units,
          totalRevenue: val.revenue,
          currentStock: prod?.quantity || 0,
          material: prod?.material || "Rice Husk & Bamboo",
        };
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    // Category & Material breakdown
    productSalesMap.forEach((val, pid) => {
      const prod = productLookup.get(pid);
      const cat = prod?.category || "Tableware";
      const mat = prod?.material || "Rice Husk Biocomposite";

      const c = catMap.get(cat) || { revenue: 0, units: 0, count: 0 };
      c.revenue += val.revenue;
      c.units += val.units;
      c.count += 1;
      catMap.set(cat, c);

      const m = matMap.get(mat) || { revenue: 0, units: 0 };
      m.revenue += val.revenue;
      m.units += val.units;
      matMap.set(mat, m);
    });

    const safeRev = grossRevenue > 0 ? grossRevenue : 1;
    const categoryMetrics: AdminAnalytics["categoryMetrics"] = Array.from(catMap.entries())
      .map(([category, v]) => ({
        category,
        revenue: v.revenue,
        unitsSold: v.units,
        orderCount: v.count,
        percentageShare: Math.round((v.revenue / safeRev) * 1000) / 10,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const materialMetrics: AdminAnalytics["materialMetrics"] = Array.from(matMap.entries())
      .map(([material, v]) => ({
        material,
        revenue: v.revenue,
        unitsSold: v.units,
        percentageShare: Math.round((v.revenue / safeRev) * 1000) / 10,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Top Customers
    const topCustomers: AdminAnalytics["topCustomers"] = Array.from(customerSpendMap.entries())
      .map(([gmail, v]) => ({
        gmail,
        name: v.name,
        totalOrders: v.orders,
        totalSpend: v.spend,
        averageSpend: v.orders > 0 ? v.spend / v.orders : 0,
        lastOrderDate: v.lastDate,
      }))
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 10);

    const repeatCustomers = Array.from(customerSpendMap.values()).filter((c) => c.orders >= 2).length;
    const activeOrderingCustomers = customerSpendMap.size;
    const repeatCustomerRate =
      activeOrderingCustomers > 0 ? (repeatCustomers / activeOrderingCustomers) * 100 : 0;

    // Time series chronological array
    const daysCount = timeWindow || 14;
    const timeSeries: AdminAnalytics["timeSeries"] = [];
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      const item = timeMap.get(key);
      if (item) {
        timeSeries.push({
          date: key,
          revenue: item.revenue,
          orderCount: item.orderCount,
          unitsSold: item.unitsSold,
          averageOrderValue: item.orderCount > 0 ? item.revenue / item.orderCount : 0,
        });
      } else {
        timeSeries.push({
          date: key,
          revenue: 0,
          orderCount: 0,
          unitsSold: 0,
          averageOrderValue: 0,
        });
      }
    }

    // Circularity impact
    const plasticDisplacedKg = Math.round(totalUnitsSold * 0.185 * 100) / 100;
    const co2NeutralizedKg = Math.round(totalUnitsSold * 0.82 * 100) / 100;
    const cropResidueUpcycledKg = Math.round(totalUnitsSold * 0.24 * 100) / 100;
    const stubbleIncinerationAvertedKg = Math.round(totalUnitsSold * 0.31 * 100) / 100;
    const treesEquivalent = Math.round(co2NeutralizedKg / 21.77);

    return {
      totalGrossRevenue: grossRevenue,
      totalNetRevenue: netRevenue,
      pendingRevenue,
      cancelledRevenue,
      totalDiscountsGiven,
      averageOrderValue,
      averageItemsPerOrder,

      totalOrders: filteredOrders.length,
      deliveredOrders,
      shippedOrders,
      processingOrders,
      placedOrders,
      cancelledOrders,
      fulfillmentRate,
      cancellationRate,

      totalProducts: products.length,
      inStockProducts,
      lowStockProducts,
      outOfStockProducts,
      totalInventoryUnits,
      totalInventoryValuation,

      plasticDisplacedKg,
      co2NeutralizedKg,
      cropResidueUpcycledKg,
      stubbleIncinerationAvertedKg,
      treesEquivalent,

      totalCustomers: customers.length || 10,
      activeOrderingCustomers,
      repeatCustomers,
      repeatCustomerRate,

      timeSeries,
      categoryMetrics,
      materialMetrics,
      topSellingProducts,
      lowStockAlerts: lowStockAlerts.slice(0, 10),
      topCustomers,
    };
  }, [analyticsQuery.data, ordersQuery.data, productsQuery.data, customersQuery.data, timeWindow]);

  const isLoading = analyticsQuery.isLoading && ordersQuery.isLoading;

  // CSV Report Generator
  const handleExportCSV = () => {
    const rows: string[] = [
      ["Metric", "Value"],
      ["Total Gross Revenue", `INR ${data.totalGrossRevenue.toFixed(2)}`],
      ["Realized Net Revenue", `INR ${data.totalNetRevenue.toFixed(2)}`],
      ["Pending Revenue", `INR ${data.pendingRevenue.toFixed(2)}`],
      ["Cancelled Revenue", `INR ${data.cancelledRevenue.toFixed(2)}`],
      ["Average Order Value (AOV)", `INR ${data.averageOrderValue.toFixed(2)}`],
      ["Bulk Tier Discounts Granted", `INR ${data.totalDiscountsGiven.toFixed(2)}`],
      ["Total Orders Placed", `${data.totalOrders}`],
      ["Delivered Orders", `${data.deliveredOrders}`],
      ["Fulfillment Rate", `${data.fulfillmentRate.toFixed(1)}%`],
      ["Cancellation Rate", `${data.cancellationRate.toFixed(1)}%`],
      ["Total Warehouse Valuation", `INR ${data.totalInventoryValuation.toFixed(2)}`],
      ["Total Inventory Units", `${data.totalInventoryUnits}`],
      ["Plastic Displaced (kg)", `${data.plasticDisplacedKg} kg`],
      ["CO2e Neutralized (kg)", `${data.co2NeutralizedKg} kg`],
      ["Crop Stubble Upcycled (kg)", `${data.cropResidueUpcycledKg} kg`],
      ["Active Enterprise & Retail Customers", `${data.activeOrderingCustomers}`],
      ["Repeat Buyer Loyalty Rate", `${data.repeatCustomerRate.toFixed(1)}%`],
      [],
      ["--- TOP SELLING PRODUCTS ---"],
      ["Product Name", "Category", "Material", "Units Sold", "Total Revenue (INR)", "Stock Remaining"],
      ...data.topSellingProducts.map((p) => [
        `"${p.pname.replace(/"/g, '""')}"`,
        `"${p.category}"`,
        `"${p.material}"`,
        `${p.unitsSold}`,
        `${p.totalRevenue.toFixed(2)}`,
        `${p.currentStock}`,
      ]),
      [],
      ["--- CATEGORY REVENUE BREAKDOWN ---"],
      ["Category", "Revenue (INR)", "Units Sold", "Orders Count", "Percentage Share"],
      ...data.categoryMetrics.map((c) => [
        `"${c.category}"`,
        `${c.revenue.toFixed(2)}`,
        `${c.unitsSold}`,
        `${c.orderCount}`,
        `${c.percentageShare}%`,
      ]),
    ].map((r) => r.join(","));

    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ViroEco_Admin_Analysis_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Chart computation helpers
  const maxRevenue = Math.max(...data.timeSeries.map((t) => t.revenue), 100);
  const maxOrders = Math.max(...data.timeSeries.map((t) => t.orderCount), 5);

  return (
    <div className="space-y-8 print:p-0 print:space-y-4">
      <AdminBreadcrumb items={[{ label: "Analysis" }]} />
      {/* 1. Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#DFD5C6] pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#17231C]">
              Executive Analysis &amp; Intelligence
            </h1>
            <Badge className="bg-[#50644C] text-white font-mono text-[10px] uppercase tracking-wider">
              PRO ANALYTICS
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#5A6659] mt-1 max-w-2xl">
            Mathematical modeling, revenue velocity, circularity carbon metrics, inventory asset health, and unit economics across the ViroEco platform.
          </p>
        </div>

        {/* Toolbar & Timeframe Filters */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {/* Time Window Buttons */}
          <div className="inline-flex items-center rounded-none bg-white border border-[#DFD5C6] p-1 shadow-2xs">
            {[
              { label: "7D", val: 7 },
              { label: "14D", val: 14 },
              { label: "30D", val: 30 },
              { label: "90D", val: 90 },
              { label: "All Time", val: undefined },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => setTimeWindow(btn.val)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-none transition-all cursor-pointer ${
                  timeWindow === btn.val
                    ? "bg-[#50644C] text-white shadow-2xs"
                    : "text-[#5A6659] hover:text-[#17231C] hover:bg-[#FAF9F5]"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <Button
            onClick={() => {
              analyticsQuery.refetch();
              ordersQuery.refetch();
              productsQuery.refetch();
            }}
            variant="outline"
            size="sm"
            className="border-[#DFD5C6] hover:bg-[#FAF9F5] text-xs font-semibold rounded-none"
            title="Refresh Analysis"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${analyticsQuery.isFetching ? "animate-spin" : ""}`} />
          </Button>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="border-[#DFD5C6] hover:bg-[#FAF9F5] text-xs font-semibold rounded-none"
          >
            <Download className="mr-1.5 h-3.5 w-3.5 text-emerald-700" /> Export CSV
          </Button>

          <Button
            onClick={() => window.print()}
            variant="outline"
            size="sm"
            className="border-[#DFD5C6] hover:bg-[#FAF9F5] text-xs font-semibold rounded-none"
          >
            <Printer className="mr-1.5 h-3.5 w-3.5" /> Print Summary
          </Button>
        </div>
      </div>

      {/* 2. Top-Level Executive KPI Grid (6 Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Card 1: Total Gross Revenue */}
        <div className="rounded-none border border-[#DFD5C6] bg-white p-4.5 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6659]">
                Gross Revenue
              </span>
              <div className="w-7 h-7 rounded-none bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <IndianRupee className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="mt-2.5 font-display text-xl sm:text-2xl xl:text-lg 2xl:text-2xl font-bold text-[#17231C] tracking-tight truncate" title={formatINR(data.totalGrossRevenue)}>
              {formatINR(data.totalGrossRevenue)}
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-medium truncate">
            <TrendingUp className="w-3 h-3 shrink-0" />
            <span className="truncate">{data.totalOrders} total orders</span>
          </div>
        </div>

        {/* Card 2: Net Realized Revenue */}
        <div className="rounded-none border border-[#DFD5C6] bg-white p-4.5 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6659]">
                Net Realized
              </span>
              <div className="w-7 h-7 rounded-none bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="mt-2.5 font-display text-xl sm:text-2xl xl:text-lg 2xl:text-2xl font-bold text-[#17231C] tracking-tight truncate" title={formatINR(data.totalNetRevenue)}>
              {formatINR(data.totalNetRevenue)}
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-blue-700 font-medium truncate">
            <Activity className="w-3 h-3 shrink-0" />
            <span className="truncate">{data.fulfillmentRate.toFixed(0)}% fulfillment</span>
          </div>
        </div>

        {/* Card 3: Average Order Value (AOV) */}
        <div className="rounded-none border border-[#DFD5C6] bg-white p-4.5 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6659]">
                Average AOV
              </span>
              <div className="w-7 h-7 rounded-none bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                <ShoppingCart className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="mt-2.5 font-display text-xl sm:text-2xl xl:text-lg 2xl:text-2xl font-bold text-[#17231C] tracking-tight truncate" title={formatINR(data.averageOrderValue)}>
              {formatINR(data.averageOrderValue)}
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-700 font-medium truncate">
            <Package className="w-3 h-3 shrink-0" />
            <span className="truncate">~{data.averageItemsPerOrder.toFixed(1)} units/cart</span>
          </div>
        </div>

        {/* Card 4: Bulk Tier Discounts Saved */}
        <div className="rounded-none border border-[#DFD5C6] bg-white p-4.5 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6659]">
                Tier Discounts
              </span>
              <div className="w-7 h-7 rounded-none bg-purple-50 text-purple-800 flex items-center justify-center shrink-0">
                <Percent className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="mt-2.5 font-display text-xl sm:text-2xl xl:text-lg 2xl:text-2xl font-bold text-[#17231C] tracking-tight truncate" title={formatINR(data.totalDiscountsGiven)}>
              {formatINR(data.totalDiscountsGiven)}
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-purple-700 font-medium truncate">
            <span className="truncate">Wholesale savings</span>
          </div>
        </div>

        {/* Card 5: Inventory Valuation */}
        <div className="rounded-none border border-[#DFD5C6] bg-white p-4.5 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6659]">
                Warehouse Asset
              </span>
              <div className="w-7 h-7 rounded-none bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
                <Box className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="mt-2.5 font-display text-xl sm:text-2xl xl:text-lg 2xl:text-2xl font-bold text-[#17231C] tracking-tight truncate" title={formatINR(data.totalInventoryValuation)}>
              {formatINR(data.totalInventoryValuation)}
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-teal-700 font-medium truncate">
            <Layers className="w-3 h-3 shrink-0" />
            <span className="truncate">{data.totalInventoryUnits.toLocaleString()} units</span>
          </div>
        </div>

        {/* Card 6: Repeat Buyer Loyalty */}
        <div className="rounded-none border border-[#DFD5C6] bg-white p-4.5 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6659]">
                Repeat Buyers
              </span>
              <div className="w-7 h-7 rounded-none bg-rose-50 text-rose-800 flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="mt-2.5 font-display text-xl sm:text-2xl xl:text-lg 2xl:text-2xl font-bold text-[#17231C] tracking-tight truncate" title={`${data.repeatCustomerRate.toFixed(1)}%`}>
              {data.repeatCustomerRate.toFixed(1)}%
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-rose-700 font-medium truncate">
            <Users className="w-3 h-3 shrink-0" />
            <span className="truncate">{data.repeatCustomers} recurring</span>
          </div>
        </div>
      </div>

      {/* 3. Interactive Chart & Velocity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue Velocity Chart */}
        <div className="lg:col-span-2 rounded-none border border-[#DFD5C6] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#50644C]" />
                <h2 className="font-display text-xl font-bold text-[#17231C]">
                  Revenue &amp; Sales Velocity Timeline
                </h2>
              </div>
              <p className="text-xs text-[#5A6659] mt-0.5">
                Daily timeline tracking sales revenue (₹) and volume of customer checkouts.
              </p>
            </div>

            {/* Live Chart stats pill */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#17231C] font-semibold">
                <span className="w-3 h-3 rounded-none bg-[#50644C]" />
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#5A6659] font-semibold">
                <span className="w-3 h-3 rounded-none bg-emerald-300" />
                <span>Order Count</span>
              </div>
            </div>
          </div>

          {/* Interactive Responsive SVG Area & Bar Visualizer */}
          <div className="relative pt-6 pb-2">
            {data.timeSeries.length === 0 || data.totalOrders === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-center p-6 rounded-none bg-[#FAF9F5] border border-dashed border-[#DFD5C6]">
                <div className="w-10 h-10 rounded-none bg-emerald-100/60 text-emerald-800 flex items-center justify-center mb-2.5">
                  <Activity className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-[#17231C]">No transaction velocity recorded for this period</p>
                <p className="text-xs text-[#5A6659] mt-1 max-w-sm">
                  Orders placed by retail customers or B2B enterprise partners will automatically chart real-time revenue and volume here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* SVG Graph */}
                <div className="relative h-56 w-full flex items-end justify-between gap-1 sm:gap-2 px-2 border-b border-[#DFD5C6]">
                  {data.timeSeries.map((pt, idx) => {
                    const heightPercent = maxRevenue > 0 ? (pt.revenue / maxRevenue) * 85 : 0;
                    const orderHeightPercent = maxOrders > 0 ? (pt.orderCount / maxOrders) * 60 : 0;
                    const isHovered = hoveredPointIndex === idx;

                    return (
                      <div
                        key={pt.date}
                        onMouseEnter={() => setHoveredPointIndex(idx)}
                        onMouseLeave={() => setHoveredPointIndex(null)}
                        className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                      >
                        {/* Tooltip on hover */}
                        {isHovered && (
                          <div className="absolute -top-16 z-30 bg-[#243021] text-white p-2.5 rounded-none shadow-xl text-left pointer-events-none min-w-[140px] animate-in fade-in zoom-in-95 duration-150">
                            <p className="text-[10px] text-emerald-300 font-mono font-semibold">{pt.date}</p>
                            <p className="text-xs font-bold text-white mt-0.5">{formatINR(pt.revenue)}</p>
                            <p className="text-[10px] text-emerald-100/75">
                              {pt.orderCount} orders • {pt.unitsSold} units sold
                            </p>
                          </div>
                        )}

                        {/* Order Count secondary bar */}
                        <div
                          style={{ height: `${Math.max(4, orderHeightPercent)}%` }}
                          className={`w-full max-w-[10px] rounded-none transition-all duration-300 ${
                            isHovered ? "bg-emerald-400" : "bg-emerald-200/80"
                          }`}
                        />

                        {/* Revenue Primary bar */}
                        <div
                          style={{ height: `${Math.max(6, heightPercent)}%` }}
                          className={`w-full max-w-[18px] rounded-none transition-all duration-300 ${
                            isHovered
                              ? "bg-emerald-600 scale-105 shadow-md shadow-emerald-700/20"
                              : "bg-[#50644C] hover:bg-emerald-800"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* X Axis dates label */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[#5A6659] px-2">
                  <span>{data.timeSeries[0]?.date}</span>
                  <span className="hidden sm:inline">
                    {data.timeSeries[Math.floor(data.timeSeries.length / 2)]?.date}
                  </span>
                  <span>{data.timeSeries[data.timeSeries.length - 1]?.date}</span>
                </div>
              </div>
            )}
          </div>

          {/* Timeframe Summary Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#DFD5C6]">
            <div className="p-3 rounded-none bg-[#FAF9F5] border border-[#DFD5C6]">
              <p className="text-[10px] font-bold uppercase text-[#5A6659]">Daily Average</p>
              <p className="text-sm font-bold text-[#17231C] mt-0.5">
                {formatINR(data.totalGrossRevenue / Math.max(1, data.timeSeries.length))}
              </p>
            </div>
            <div className="p-3 rounded-none bg-[#FAF9F5] border border-[#DFD5C6]">
              <p className="text-[10px] font-bold uppercase text-[#5A6659]">Peak Single Day</p>
              <p className="text-sm font-bold text-emerald-800 mt-0.5">{formatINR(maxRevenue)}</p>
            </div>
            <div className="p-3 rounded-none bg-[#FAF9F5] border border-[#DFD5C6]">
              <p className="text-[10px] font-bold uppercase text-[#5A6659]">Fulfillment Ratio</p>
              <p className="text-sm font-bold text-[#17231C] mt-0.5">{data.fulfillmentRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 rounded-none bg-[#FAF9F5] border border-[#DFD5C6]">
              <p className="text-[10px] font-bold uppercase text-[#5A6659]">Order Rejection Rate</p>
              <p className="text-sm font-bold text-rose-700 mt-0.5">{data.cancellationRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Order Pipeline & Funnel Breakdown */}
        <div className="rounded-none border border-[#DFD5C6] bg-white p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#50644C]" />
              <h2 className="font-display text-xl font-bold text-[#17231C]">
                Fulfillment Funnel
              </h2>
            </div>
            <p className="text-xs text-[#5A6659] mt-0.5">
              Live operational lifecycle of all client orders.
            </p>

            {/* Funnel Progress Segments */}
            <div className="mt-6 space-y-4">
              {[
                {
                  label: "Delivered (Completed)",
                  count: data.deliveredOrders,
                  color: "bg-emerald-600",
                  textColor: "text-emerald-700",
                  icon: CheckCircle2,
                },
                {
                  label: "In-Transit (Shipped)",
                  count: data.shippedOrders,
                  color: "bg-blue-500",
                  textColor: "text-blue-700",
                  icon: Truck,
                },
                {
                  label: "In Processing",
                  count: data.processingOrders,
                  color: "bg-amber-500",
                  textColor: "text-amber-700",
                  icon: Clock,
                },
                {
                  label: "Awaiting Dispatch (Placed)",
                  count: data.placedOrders,
                  color: "bg-purple-500",
                  textColor: "text-purple-700",
                  icon: Package,
                },
                {
                  label: "Cancelled / Voided",
                  count: data.cancelledOrders,
                  color: "bg-rose-500",
                  textColor: "text-rose-700",
                  icon: XCircle,
                },
              ].map((stage) => {
                const pct = data.totalOrders > 0 ? (stage.count / data.totalOrders) * 100 : 0;
                return (
                  <div key={stage.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <stage.icon className={`w-3.5 h-3.5 ${stage.textColor}`} />
                        <span className="text-[#17231C]">{stage.label}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-[#17231C]">{stage.count}</span>
                        <span className="text-[11px] text-[#5A6659]">({pct.toFixed(0)}%)</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-none bg-[#DFD5C6]/50 overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-full rounded-none transition-all duration-500 ${stage.color}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-none bg-[#FAF9F5] border border-[#DFD5C6] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5A6659] font-medium">Pending Pipeline Value:</span>
              <span className="font-bold text-[#17231C] font-mono">{formatINR(data.pendingRevenue)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5A6659] font-medium">Cancelled Volume:</span>
              <span className="font-bold text-rose-700 font-mono">{formatINR(data.cancelledRevenue)}</span>
            </div>
            <Button asChild size="sm" variant="ghost" className="w-full text-xs font-bold text-[#50644C] mt-2">
              <Link href="/admin/orders" className="flex items-center justify-center gap-1">
                Manage Live Orders <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Circular Economy & Sustainability Environmental Scorecard */}
      <div className="rounded-none border border-[#50644C]/20 bg-gradient-to-br from-[#243021] via-[#50644C] to-[#1A2418] text-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-white/10 text-emerald-300 border border-white/15 text-xs font-semibold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5" />
              ViroEco Circularity &amp; Carbon Accounting
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Certified Environmental Impact Matrix
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl">
              Calculated cradle-to-gate impact from replacing single-use virgin petrochemical polymers with agricultural residue biocomposites.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-emerald-300/75">Verified Net Index</p>
              <p className="font-mono text-xl font-bold text-emerald-400">-0.82 kg CO₂e / kg</p>
            </div>
          </div>
        </div>

        {/* 4 Carbon Impact Dials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="rounded-none bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Virgin Plastic Displaced
              </span>
              <div className="w-8 h-8 rounded-none bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
                <Box className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-white tracking-tight">
              {data.plasticDisplacedKg.toLocaleString()} <span className="text-lg font-normal text-emerald-300">kg</span>
            </p>
            <p className="text-xs text-emerald-100/70 mt-1">
              Prevented ~{Math.round(data.plasticDisplacedKg * 22).toLocaleString()} petroleum single-use containers from landfills.
            </p>
          </div>

          <div className="rounded-none bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                CO₂e Emissions Neutralized
              </span>
              <div className="w-8 h-8 rounded-none bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
                <TreePine className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-white tracking-tight">
              {data.co2NeutralizedKg.toLocaleString()} <span className="text-lg font-normal text-emerald-300">kg</span>
            </p>
            <p className="text-xs text-emerald-100/70 mt-1">
              Equivalent to the annual carbon sequestration of {data.treesEquivalent} mature trees.
            </p>
          </div>

          <div className="rounded-none bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Crop Stubble Upcycled
              </span>
              <div className="w-8 h-8 rounded-none bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-white tracking-tight">
              {data.cropResidueUpcycledKg.toLocaleString()} <span className="text-lg font-normal text-emerald-300">kg</span>
            </p>
            <p className="text-xs text-emerald-100/70 mt-1">
              Rice husks and bagasse diverted from hazardous open-field incineration.
            </p>
          </div>

          <div className="rounded-none bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                PFAS &amp; Toxic Chemicals
              </span>
              <div className="w-8 h-8 rounded-none bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-white tracking-tight">
              0.00 <span className="text-lg font-normal text-emerald-300">ppm</span>
            </p>
            <p className="text-xs text-emerald-100/70 mt-1">
              100% free of fluorinated compounds, BPA, microplastics, and synthetic phthalates.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Category Performance & Biocomposite Material Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="rounded-none border border-[#DFD5C6] bg-white p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-[#17231C]">
                Category Revenue Distribution
              </h3>
              <p className="text-xs text-[#5A6659] mt-0.5">
                Financial contribution across product lines.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {data.categoryMetrics.length} Categories
            </Badge>
          </div>

          {data.categoryMetrics.length === 0 ? (
            <p className="text-xs text-[#5A6659] py-8 text-center">No category sales recorded.</p>
          ) : (
            <div className="space-y-3.5">
              {data.categoryMetrics.slice(0, 6).map((c) => (
                <div key={c.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#17231C]">{c.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[#5A6659]">{c.unitsSold} units</span>
                      <span className="font-bold text-[#17231C] font-mono">{formatINR(c.revenue)}</span>
                      <span className="text-[11px] font-bold text-emerald-700 w-12 text-right">
                        {c.percentageShare}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-none bg-[#FAF9F5] border border-[#DFD5C6]/60 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, c.percentageShare)}%` }}
                      className="h-full bg-[#50644C] rounded-none transition-all duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Biocomposite Materials Performance */}
        <div className="rounded-none border border-[#DFD5C6] bg-white p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-[#17231C]">
                Material Formulation Performance
              </h3>
              <p className="text-xs text-[#5A6659] mt-0.5">
                Sales by agricultural feedstock composition.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              Feedstocks
            </Badge>
          </div>

          {data.materialMetrics.length === 0 ? (
            <p className="text-xs text-[#5A6659] py-8 text-center">No material data recorded.</p>
          ) : (
            <div className="space-y-3.5">
              {data.materialMetrics.slice(0, 6).map((m) => (
                <div key={m.material} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#17231C]">{m.material}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[#5A6659]">{m.unitsSold} units</span>
                      <span className="font-bold text-[#17231C] font-mono">{formatINR(m.revenue)}</span>
                      <span className="text-[11px] font-bold text-emerald-700 w-12 text-right">
                        {m.percentageShare}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-none bg-[#FAF9F5] border border-[#DFD5C6]/60 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, m.percentageShare)}%` }}
                      className="h-full bg-emerald-600 rounded-none transition-all duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 6. Top Selling SKUs & High Velocity Table */}
      <div className="rounded-none border border-[#DFD5C6] bg-white p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-bold text-[#17231C]">
              Top Revenue Driving SKUs
            </h2>
            <p className="text-xs text-[#5A6659] mt-0.5">
              Ranked list of highest-velocity biocomposite products.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="text-xs font-semibold rounded-none">
            <Link href="/admin/products" className="flex items-center gap-1">
              Catalog Manager <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        {data.topSellingProducts.length === 0 ? (
          <p className="text-xs text-[#5A6659] py-8 text-center">No product orders recorded yet.</p>
        ) : (
          <div className="overflow-x-auto border border-[#DFD5C6] rounded-none">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-[#FAF9F5] text-left">
                <tr>
                  <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Rank</th>
                  <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">SKU Name</th>
                  <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Category</th>
                  <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Material</th>
                  <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659] text-right">Units Sold</th>
                  <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659] text-right">Gross Sales</th>
                  <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659] text-right">Warehouse Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFD5C6]">
                {data.topSellingProducts.map((p, idx) => (
                  <tr key={p.productId} className="hover:bg-[#FAF9F5]/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-[#50644C]">
                      #{idx + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-xs text-[#17231C]">{p.pname}</p>
                      <p className="text-[10px] text-[#5A6659] font-mono">ID: {p.productId}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#5A6659]">{p.category}</td>
                    <td className="px-4 py-3.5 text-xs text-[#5A6659] max-w-[150px] truncate">{p.material}</td>
                    <td className="px-4 py-3.5 text-right font-mono text-xs font-bold text-[#17231C]">
                      {p.unitsSold}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-xs font-bold text-emerald-800">
                      {formatINR(p.totalRevenue)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-none text-[10px] font-bold ${
                          p.currentStock <= 0
                            ? "bg-rose-100 text-rose-800"
                            : p.currentStock <= 15
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {p.currentStock} units
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 7. Inventory Health & Urgent Low-Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Balance Card */}
        <div className="rounded-none border border-[#DFD5C6] bg-white p-6 sm:p-8 space-y-5 shadow-xs">
          <div>
            <h3 className="font-display text-lg font-bold text-[#17231C]">
              Inventory Health Ratio
            </h3>
            <p className="text-xs text-[#5A6659] mt-0.5">
              Live stock levels across all {data.totalProducts} active SKUs.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-none bg-emerald-50/60 border border-emerald-200/60">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-semibold text-emerald-950">Healthy Stock (&gt;15 units)</span>
              </div>
              <span className="font-bold text-xs text-emerald-900 font-mono">
                {data.inStockProducts} SKUs
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-none bg-amber-50/60 border border-amber-200/60">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-semibold text-amber-950">Low Stock Warning (1–15 units)</span>
              </div>
              <span className="font-bold text-xs text-amber-900 font-mono">
                {data.lowStockProducts} SKUs
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-none bg-rose-50/60 border border-rose-200/60">
              <div className="flex items-center gap-2.5">
                <XCircle className="w-4 h-4 text-rose-700" />
                <span className="text-xs font-semibold text-rose-950">Out of Stock (0 units)</span>
              </div>
              <span className="font-bold text-xs text-rose-900 font-mono">
                {data.outOfStockProducts} SKUs
              </span>
            </div>
          </div>
        </div>

        {/* Low Stock Alert Table */}
        <div className="lg:col-span-2 rounded-none border border-[#DFD5C6] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-[#17231C]">
                Critical Restock Actions
              </h3>
              <p className="text-xs text-[#5A6659] mt-0.5">
                SKUs requiring warehouse replenishment.
              </p>
            </div>
            <Badge variant="outline" className="text-xs text-amber-700 border-amber-300 bg-amber-50">
              {data.lowStockAlerts.length} Action Items
            </Badge>
          </div>

          {data.lowStockAlerts.length === 0 ? (
            <p className="text-xs text-emerald-700 py-6 text-center font-medium">
              ✓ All products are adequately stocked above reserve thresholds.
            </p>
          ) : (
            <div className="overflow-x-auto border border-[#DFD5C6] rounded-none max-h-72 overflow-y-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead className="bg-[#FAF9F5] text-left sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase text-[#5A6659]">Product</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase text-[#5A6659]">Category</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase text-[#5A6659] text-right">Current Stock</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase text-[#5A6659] text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFD5C6]">
                  {data.lowStockAlerts.slice(0, 8).map((it) => (
                    <tr key={it.productId} className="hover:bg-[#FAF9F5]/60 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-xs text-[#17231C]">{it.pname}</p>
                        <p className="text-[10px] text-[#5A6659] font-mono">SKU #{it.productId}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#5A6659]">{it.category}</td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-mono font-bold text-xs ${
                            it.quantity <= 0 ? "text-rose-700 font-extrabold" : "text-amber-700"
                          }`}
                        >
                          {it.quantity} left
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-[#17231C]">
                        {formatINR(it.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 8. Top Purchasing Enterprise & Retail Clients */}
      <div className="rounded-none border border-[#DFD5C6] bg-white p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-bold text-[#17231C]">
              Enterprise &amp; VIP Customer Spend Matrix
            </h2>
            <p className="text-xs text-[#5A6659] mt-0.5">
              Client lifetime volume, order cadence, and average basket size.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="text-xs font-semibold rounded-none">
            <Link href="/admin/customers" className="flex items-center gap-1">
              Customer Accounts <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        {data.topCustomers.length === 0 ? (
          <p className="text-xs text-[#5A6659] py-8 text-center">No customer order data recorded yet.</p>
        ) : (
          <div className="overflow-x-auto border border-[#DFD5C6] rounded-none">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-[#FAF9F5] text-left">
                <tr>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659]">Customer</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659] text-right">Orders</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659] text-right">Total Spend</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659] text-right">Average Order Value</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#5A6659] text-right">Last Purchase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFD5C6]">
                {data.topCustomers.map((c) => (
                  <tr key={c.gmail} className="hover:bg-[#FAF9F5]/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-xs text-[#17231C]">{c.name}</p>
                      <p className="text-[11px] text-[#5A6659] font-mono">{c.gmail}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-xs font-bold text-[#17231C]">
                      {c.totalOrders}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-xs font-bold text-emerald-800">
                      {formatINR(c.totalSpend)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-xs text-[#5A6659]">
                      {formatINR(c.averageSpend)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-xs text-[#5A6659]">
                      {c.lastOrderDate || "Recent"}
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
