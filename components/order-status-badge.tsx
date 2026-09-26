import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  PLACED: "bg-moss/20 text-moss-deep border-transparent",
  CONFIRMED: "bg-moss/20 text-moss-deep border-transparent",
  SHIPPED: "bg-terra/20 text-terra-deep border-transparent",
  DELIVERED: "bg-moss text-[#21281f] border-transparent",
  CANCELLED: "bg-destructive/15 text-destructive border-transparent",
};

export function OrderStatusBadge({ status }: { status: string }) {
  const key = status?.toUpperCase();
  return (
    <Badge variant="outline" className={cn("font-medium", STYLES[key] ?? "")}>
      {key}
    </Badge>
  );
}
