"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useAuth } from "@/providers/auth-provider";
import { AdminSidebarProvider, useAdminSidebar } from "@/providers/admin-sidebar-context";
import { ExternalLink, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { isCollapsed, toggleSidebar } = useAdminSidebar();

  return (
    <div className="flex min-h-screen bg-[#FAF9F5] text-[#17231C]">
      {/* Collapsible Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Executive Header */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#DFD5C6] px-4 sm:px-6 lg:px-10 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Sidebar Open/Close Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-none border border-[#DFD5C6] hover:bg-[#FAF9F5] text-[#50644C] transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label="Toggle sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-none bg-[#EDF2EB] text-[#50644C] text-xs font-semibold">
              <span className="w-2 h-2 rounded-none bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Catalog Live: 513 SKUs</span>
              <span className="sm:hidden">513 SKUs</span>
            </div>

            <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-[#FAF9F5] border border-[#DFD5C6] text-[11px] text-[#5A6659] font-medium">
              <span>Viroeco Biocomposites Active</span>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="border-[#DFD5C6] hover:bg-[#FAF9F5] text-xs font-medium rounded-none">
              <Link href="/" target="_blank" className="flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Store</span>
              </Link>
            </Button>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, ready, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !isAdmin) router.replace(session ? "/" : "/login?next=/admin");
  }, [ready, isAdmin, session, router]);

  if (!ready || !isAdmin) return null;

  return (
    <AdminSidebarProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminSidebarProvider>
  );
}
