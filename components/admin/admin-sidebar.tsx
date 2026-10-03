"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  ExternalLink,
  LogOut,
  Leaf,
  ShieldCheck,
  BarChart3,
  X,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useAdminSidebar } from "@/providers/admin-sidebar-context";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true, badge: "Live" },
  { href: "/admin/analysis", label: "Analytics & Intelligence", icon: BarChart3, badge: "Pro" },
  { href: "/admin/products", label: "Products Catalog", icon: Package, badge: "513" },
  { href: "/admin/categories", label: "Categories", icon: Tags, badge: "26" },
  { href: "/admin/orders", label: "Orders & Fulfillment", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customer Accounts", icon: Users },
  { href: "/admin/audit-logs", label: "Audit & Logs", icon: ShieldCheck, badge: "Sec" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { session, signOut } = useAuth();
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useAdminSidebar();

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between select-none">
      <div>
        {/* Brand Header */}
        <div
          className={cn(
            "border-b border-white/10 flex items-center justify-between transition-all duration-300",
            isCollapsed ? "px-2 py-4 justify-center" : "px-4 py-4"
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {isCollapsed ? (
              <Link href="/admin" title="Viroeco Admin">
                <Logo variant="light" size="sm" asLink={false} imageClassName="h-7 w-auto" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Logo variant="light" size="sm" href="/admin" imageClassName="h-8 w-auto" />
                <span className="text-[9px] bg-[#CCAC88]/20 text-[#CCAC88] font-bold px-1.5 py-0.5 rounded-none border border-[#CCAC88]/30 uppercase tracking-wider">
                  ADMIN
                </span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={closeMobile}
            className="lg:hidden p-1.5 rounded-none text-emerald-300/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation section */}
        <div className={cn("overflow-y-auto space-y-6 transition-all duration-300", isCollapsed ? "px-2 py-4" : "px-3 py-5")}>
          <div>
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-200/50 mb-2">
                Store Management
              </p>
            )}
            <nav className="space-y-1">
              {NAV.map(({ href, label, icon: Icon, exact, badge }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    title={isCollapsed ? label : undefined}
                    className={cn(
                      "flex cursor-pointer items-center rounded-none text-xs font-medium transition-all group relative",
                      isCollapsed
                        ? "justify-center p-2.5 h-10 w-10 mx-auto"
                        : "justify-between px-3.5 py-2.5",
                      active
                        ? "bg-emerald-600 text-white font-semibold shadow-xs"
                        : "text-emerald-100/75 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active ? "text-white" : "text-emerald-400/80 group-hover:text-emerald-300"
                        )}
                      />
                      {!isCollapsed && <span>{label}</span>}
                    </div>

                    {!isCollapsed && badge && (
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-none font-bold",
                          active
                            ? "bg-white/20 text-white"
                            : "bg-white/10 text-emerald-300 group-hover:bg-white/15"
                        )}
                      >
                        {badge}
                      </span>
                    )}

                    {isCollapsed && badge && (
                      <span
                        className={cn(
                          "absolute top-1.5 right-1.5 w-2 h-2 rounded-none",
                          active ? "bg-white" : "bg-emerald-400"
                        )}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* User Session Card & Quick Actions */}
      <div className={cn("border-t border-white/10 transition-all duration-300 bg-[#1A2418]", isCollapsed ? "p-2.5 space-y-2" : "p-4 space-y-2")}>
        <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "px-2 py-1")}>
          <div
            className="w-8 h-8 rounded-none bg-emerald-700 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-white shrink-0"
            title={session?.name || "Administrator"}
          >
            {session?.name ? session.name.charAt(0).toUpperCase() : "A"}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{session?.name || "Administrator"}</p>
              <p className="text-[10px] text-emerald-300/70 truncate">{session?.gmail || "admin@viroeco.com"}</p>
            </div>
          )}
        </div>

        <div className={cn("pt-1", isCollapsed ? "flex flex-col gap-1.5 items-center" : "grid grid-cols-2 gap-1.5")}>
          <Link
            href="/"
            target="_blank"
            title="Open Storefront"
            className={cn(
              "flex items-center justify-center rounded-none bg-white/5 hover:bg-white/10 text-emerald-200 font-medium transition-colors",
              isCollapsed ? "h-8 w-8 p-0" : "gap-1.5 py-2 px-2.5 text-[11px]"
            )}
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            {!isCollapsed && <span>Storefront</span>}
          </Link>
          <button
            onClick={signOut}
            title="Sign out"
            className={cn(
              "flex items-center justify-center rounded-none bg-red-500/10 hover:bg-red-500/20 text-red-300 font-medium transition-colors cursor-pointer",
              isCollapsed ? "h-8 w-8 p-0" : "gap-1.5 py-2 px-2.5 text-[11px]"
            )}
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            {!isCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer (Slide in from left) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#243021] text-white transition-transform duration-300 ease-in-out border-r border-[#DFD5C6]/20 lg:hidden shadow-2xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sticky Sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden lg:flex h-screen shrink-0 flex-col border-r border-[#DFD5C6] bg-[#243021] text-white transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
