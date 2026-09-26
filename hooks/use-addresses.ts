"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as ep from "@/lib/endpoints";
import { useAuth } from "@/providers/auth-provider";
import type { AddressInput } from "@/lib/types";

export function useAddresses() {
  const { session } = useAuth();
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["addresses"] });

  const list = useQuery({
    queryKey: ["addresses"],
    queryFn: ep.getAddresses,
    enabled: !!session,
  });

  const create = useMutation({
    mutationFn: (b: AddressInput) => ep.createAddress(b),
    onSuccess: () => {
      invalidate();
      toast.success("Address saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: number; body: AddressInput }) => ep.updateAddress(id, body),
    onSuccess: () => {
      invalidate();
      toast.success("Address updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: number) => ep.deleteAddress(id),
    onSuccess: () => {
      invalidate();
      toast.success("Address removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return { list, create, update, remove };
}
