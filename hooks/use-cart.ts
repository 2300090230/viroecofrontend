"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as ep from "@/lib/endpoints";
import { useAuth } from "@/providers/auth-provider";
import type { Cart } from "@/lib/types";

export function useCart() {
  const { session } = useAuth();
  const qc = useQueryClient();

  const cart = useQuery({
    queryKey: ["cart"],
    queryFn: ep.getCart,
    enabled: !!session && session.role === "USER",
  });

  const set = (data: Cart) => qc.setQueryData(["cart"], data);

  const add = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      ep.addToCart(productId, quantity),
    onSuccess: (data) => {
      set(data);
      toast.success("Added to cart");
    },
    onError: (e: Error) => toast.error(e.message || "Could not add to cart"),
  });

  const update = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      ep.updateCartItem(productId, quantity),
    onSuccess: set,
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (productId: number) => ep.removeCartItem(productId),
    onSuccess: (data) => {
      set(data);
      toast.success("Removed from cart");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const items = cart.data?.items ?? [];
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const unit = (i: { price: number; discountedPrice?: number }) => i.discountedPrice ?? i.price;
  // subtotal is the discounted total — matches what the backend charges.
  const subtotal = items.reduce((n, i) => n + unit(i) * i.quantity, 0);
  const savings = items.reduce((n, i) => n + (i.price - unit(i)) * i.quantity, 0);

  return { cart, items, count, subtotal, savings, add, update, remove };
}
