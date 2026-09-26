"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddresses } from "@/hooks/use-addresses";
import type { Address, AddressInput } from "@/lib/types";

const EMPTY: AddressInput = {
  doorNumber: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "India",
  addressType: "HOME",
};

export function AddressFormDialog({
  trigger,
  address,
  onSaved,
}: {
  trigger: React.ReactNode;
  address?: Address;
  onSaved?: () => void;
}) {
  const { create, update } = useAddresses();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AddressInput>(address ?? EMPTY);
  const set = (k: keyof AddressInput, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const saving = create.isPending || update.isPending;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (address) await update.mutateAsync({ id: address.id, body: form });
      else {
        await create.mutateAsync(form);
        setForm(EMPTY);
      }
      setOpen(false);
      onSaved?.();
    } catch {
      /* toast handled in hook */
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {address ? "Edit address" : "Add a new address"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Door / Flat no." value={form.doorNumber} onChange={(v) => set("doorNumber", v)} />
            <Field label="Street" value={form.street} onChange={(v) => set("street", v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" value={form.city} onChange={(v) => set("city", v)} />
            <Field label="State" value={form.state} onChange={(v) => set("state", v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ZIP / PIN" value={form.zipCode} onChange={(v) => set("zipCode", v)} />
            <Field label="Country" value={form.country} onChange={(v) => set("country", v)} />
          </div>
          <div className="space-y-1.5">
            <Label>Address type</Label>
            <Select value={form.addressType} onValueChange={(v) => set("addressType", v)}>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOME">Home</SelectItem>
                <SelectItem value="OFFICE">Office</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" className="cursor-pointer" disabled={saving}>
              {saving ? "Saving…" : "Save address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input required value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
