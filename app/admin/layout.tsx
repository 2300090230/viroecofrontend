"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useAuth } from "@/providers/auth-provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, ready, isAdmin } = useAuth();
  const router = useRouter();

  // Belt-and-suspenders: proxy.ts gates server navigations; this covers client-side ones.
  useEffect(() => {
    if (ready && !isAdmin) router.replace(session ? "/" : "/login?next=/admin");
  }, [ready, isAdmin, session, router]);

  if (!ready || !isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden px-6 py-8 lg:px-10">{children}</div>
    </div>
  );
}
