"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  productId,
  quantity = 1,
  disabled,
  className,
  label = "Add to cart",
  size = "default",
}: {
  productId: number;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
  size?: "sm" | "default" | "lg";
}) {
  const { session, ready } = useAuth();
  const { add } = useCart();
  const router = useRouter();

  function onClick() {
    if (!session) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (session.role === "ADMIN") {
      toast.error("Shopping is available on customer accounts.");
      return;
    }
    add.mutate({ productId, quantity });
  }

  return (
    <Button
      type="button"
      size={size}
      onClick={onClick}
      disabled={disabled || add.isPending || !ready}
      className={cn("cursor-pointer", className)}
    >
      {add.isPending ? "Adding…" : label}
    </Button>
  );
}
