"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: Tags },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { session, signOut } = useAuth();

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="border-b border-sidebar-border px-5 py-5">
        <Link href="/admin" className="cursor-pointer font-display text-2xl tracking-tight">
          Viroeco
        </Link>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Admin</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-terra text-primary-foreground"
                  : "text-foreground/80 hover:bg-sidebar-accent",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <p className="truncate px-3 py-1 text-xs text-muted-foreground">{session?.gmail}</p>
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:bg-sidebar-accent"
        >
          <ArrowLeft className="h-4 w-4" /> Back to store
        </Link>
        <button
          onClick={signOut}
          className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}
