"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { adminSaveProduct, adminSetProductTiers, getCategories } from "@/lib/endpoints";
import type { Product, Category } from "@/lib/types";

type TierRow = { minQuantity: string; discountPercent: string };

function tiersFromProduct(p?: Product): TierRow[] {
  return (p?.discountTiers ?? []).map((t) => ({
    minQuantity: String(t.minQuantity),
    discountPercent: String(t.discountPercent),
  }));
}

type Fields = {
  pname: string;
  category: string;
  subCategory: string;
  size: string;
  material: string;
  color: string;
  packSize: string;
  price: string;
  originalPrice: string;
  quantity: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  sustainabilityTag: string;
  uvProtection: string;
  usage: string;
  features: string;
};

function fromProduct(p?: Product): Fields {
  return {
    pname: p?.pname ?? "",
    category: p?.category ?? "",
    subCategory: p?.subCategory ?? "",
    size: p?.size ?? "",
    material: p?.material ?? "",
    color: p?.color ?? "",
    packSize: p?.packSize ?? "",
    price: p ? String(p.price) : "",
    originalPrice: p ? String(p.originalPrice) : "",
    quantity: p ? String(p.quantity) : "",
    weight: p?.weight ?? "",
    length: p?.length ?? "",
    width: p?.width ?? "",
    height: p?.height ?? "",
    sustainabilityTag: p?.sustainabilityTag ?? "",
    uvProtection: p ? String(p.uvProtection) : "false",
    usage: p?.usage ?? "",
    features: p?.features ?? "",
  };
}

export function ProductFormDialog({
  trigger,
  product,
}: {
  trigger: React.ReactNode;
  product?: Product;
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Fields>(fromProduct(product));
  const [images, setImages] = useState<File[]>([]);
  const [tiers, setTiers] = useState<TierRow[]>(tiersFromProduct(product));
  const set = (k: keyof Fields, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const setTier = (i: number, k: keyof TierRow, v: string) =>
    setTiers((rows) => rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const fetched = await getCategories();
        if (Array.isArray(fetched)) return fetched;
      } catch {}
      return [] as Category[];
    },
  });

  const categoriesList = categoriesQuery.data ?? [];

  const save = useMutation({
    mutationFn: async () => {
      const result = await adminSaveProduct(form, images, product?.productId);
      // New products return "…with ID: <n>"; edits already have the id.
      const id = product?.productId ?? Number(result.match(/ID:\s*(\d+)/)?.[1]);
      if (id) {
        const clean = tiers
          .map((t) => ({
            minQuantity: Number(t.minQuantity),
            discountPercent: Number(t.discountPercent),
          }))
          .filter((t) => t.minQuantity > 0);
        // Send even when empty so removing all tiers on an edit clears them.
        if (clean.length > 0 || product) await adminSetProductTiers(id, clean);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
      toast.success(product ? "Product updated successfully." : "Product created successfully.");
      setOpen(false);
      if (!product) {
        setForm(fromProduct());
        setTiers([]);
      }
      setImages([]);
    },
    onError: (e: Error) => toast.error(e.message || (product ? "Failed to update product." : "Failed to create product.")),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-card sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {product ? "Edit product" : "New product"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
          className="space-y-4"
        >
          <Field label="Product name" required value={form.pname} onChange={(v) => set("pname", v)} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Field
                label="Category"
                required
                value={form.category}
                onChange={(v) => set("category", v)}
                list="category-suggestions"
              />
              <datalist id="category-suggestions">
                {categoriesList.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>
            <div>
              <Field
                label="Sub-category"
                value={form.subCategory}
                onChange={(v) => set("subCategory", v)}
                list="subcategory-suggestions"
              />
              <datalist id="subcategory-suggestions">
                <option value="Mugs" />
                <option value="Cups" />
                <option value="Bottles" />
                <option value="Sippers" />
                <option value="Tumblers" />
                <option value="Bowls" />
                <option value="Plates" />
                <option value="Dinner set" />
                <option value="Trays" />
                <option value="Large-Size Planters" />
                <option value="Medium-Size Planters" />
                <option value="Small-Size Planters" />
                <option value="Table-Top Planters" />
                <option value="Hanging Planters" />
                <option value="Planters with Tray" />
                <option value="Self-Watering" />
                <option value="Kitchen Storage" />
                <option value="General Organisers" />
                <option value="RAKHI" />
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Price (₹)" type="number" required value={form.price} onChange={(v) => set("price", v)} />
            <Field label="MRP (₹)" type="number" value={form.originalPrice} onChange={(v) => set("originalPrice", v)} />
            <Field label="Stock" type="number" required value={form.quantity} onChange={(v) => set("quantity", v)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Size" value={form.size} onChange={(v) => set("size", v)} />
            <Field label="Material" value={form.material} onChange={(v) => set("material", v)} />
          </div>

          <Field
            label="Colours (comma-separated)"
            value={form.color}
            onChange={(v) => set("color", v)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Pack size" value={form.packSize} onChange={(v) => set("packSize", v)} />
            <Field label="Sustainability tag" value={form.sustainabilityTag} onChange={(v) => set("sustainabilityTag", v)} />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Field label="Weight" value={form.weight} onChange={(v) => set("weight", v)} />
            <Field label="Length" value={form.length} onChange={(v) => set("length", v)} />
            <Field label="Width" value={form.width} onChange={(v) => set("width", v)} />
            <Field label="Height" value={form.height} onChange={(v) => set("height", v)} />
          </div>

          <div className="space-y-1.5">
            <Label>Usage</Label>
            <Textarea value={form.usage} onChange={(e) => set("usage", e.target.value)} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label>Features (comma-separated)</Label>
            <Textarea value={form.features} onChange={(e) => set("features", e.target.value)} rows={2} />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.uvProtection === "true"}
              onChange={(e) => set("uvProtection", String(e.target.checked))}
            />
            UV protection
          </label>

          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <Label>Bulk discount tiers</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => setTiers((rows) => [...rows, { minQuantity: "", discountPercent: "" }])}
              >
                Add tier
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Buy at least the quantity, get the discount %. Best matching tier applies.
            </p>
            {tiers.map((t, i) => (
              <div key={i} className="flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Min quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={t.minQuantity}
                    onChange={(e) => setTier(i, "minQuantity", e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Discount %</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={t.discountPercent}
                    onChange={(e) => setTier(i, "discountPercent", e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  aria-label="Remove tier"
                  className="mb-1 cursor-pointer p-2 text-muted-foreground hover:text-destructive"
                  onClick={() => setTiers((rows) => rows.filter((_, j) => j !== i))}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="images">
              Images {product ? "(uploading new ones replaces all existing)" : ""}
            </Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              className="cursor-pointer"
              onChange={(e) => setImages(Array.from(e.target.files ?? []))}
            />
            {images.length > 0 && (
              <p className="text-xs text-muted-foreground">{images.length} image(s) selected</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="cursor-pointer" disabled={save.isPending}>
              {save.isPending ? "Saving…" : product ? "Save changes" : "Create product"}
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
  type = "text",
  required,
  list,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  list?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        type={type}
        required={required}
        step={type === "number" ? "any" : undefined}
        min={type === "number" ? "0" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        list={list}
      />
    </div>
  );
}
