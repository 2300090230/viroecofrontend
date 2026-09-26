"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { adminGetCustomers, adminSetCustomerEnabled } from "@/lib/endpoints";
import { useAuth } from "@/providers/auth-provider";

export default function AdminCustomersPage() {
  const qc = useQueryClient();
  const { session } = useAuth();
  const customers = useQuery({ queryKey: ["admin", "customers"], queryFn: adminGetCustomers });

  const toggle = useMutation({
    mutationFn: ({ gmail, enabled }: { gmail: string; enabled: boolean }) =>
      adminSetCustomerEnabled(gmail, enabled),
    onSuccess: (msg) => {
      qc.invalidateQueries({ queryKey: ["admin", "customers"] });
      toast.success(typeof msg === "string" ? msg : "Updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const list = customers.data ?? [];

  return (
    <div>
      <h1 className="font-display text-4xl tracking-tight">Customers</h1>
      <p className="mt-1 text-muted-foreground">{list.length} registered accounts.</p>

      <div className="mt-8">
        {customers.isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="overflow-x-auto border border-border">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-sand text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Phone</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Role</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {list.map((c) => {
                  const isSelf = c.gmail === session?.gmail;
                  return (
                    <tr key={c.gmail} className="border-t border-border">
                      <td className="px-4 py-3">{c.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.gmail}</td>
                      <td className="px-4 py-3">{c.contactno}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{c.role}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {c.enabled ? (
                          <span className="text-moss-deep">Active</span>
                        ) : (
                          <span className="text-destructive">Disabled</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          disabled={isSelf || toggle.isPending}
                          onClick={() => toggle.mutate({ gmail: c.gmail, enabled: !c.enabled })}
                        >
                          {isSelf ? "You" : c.enabled ? "Disable" : "Enable"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
