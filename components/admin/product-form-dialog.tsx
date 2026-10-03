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
import { ImagePlus, Star, Trash2, X } from "lucide-react";
import { adminSaveProduct, adminSetProductTiers, getCategories } from "@/lib/endpoints";
import { ProductImage } from "@/components/product-image";
import type { Product, Category } from "@/lib/types";

type TierRow = { minQuantity: string; discountPercent: string };

const MAX_IMAGES = 10;

// One gallery slot: an already-saved image URL, or a new file awaiting upload.
type GalleryItem = { key: string; src: string; file?: File };

function galleryFromProduct(p?: Product): GalleryItem[] {
  return (p?.productImages ?? []).map((url, i) => ({ key: `saved-${i}-${url}`, src: url }));
}

function releasePreviews(items: GalleryItem[]) {
  items.forEach((it) => it.file && URL.revokeObjectURL(it.src));
}

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
  const [gallery, setGallery] = useState<GalleryItem[]>(galleryFromProduct(product));
  const [tiers, setTiers] = useState<TierRow[]>(tiersFromProduct(product));
  const set = (k: keyof Fields, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const addFiles = (files: File[]) => {
    const room = MAX_IMAGES - gallery.length;
    if (files.length > room) toast.error(`A product can have at most ${MAX_IMAGES} images.`);
    const added = files.slice(0, Math.max(room, 0)).map((file) => ({
      key: `new-${file.name}-${file.lastModified}-${Math.random()}`,
      src: URL.createObjectURL(file),
      file,
    }));
    setGallery((g) => [...g, ...added]);
  };
  const removeImage = (key: string) =>
    setGallery((g) => {
      releasePreviews(g.filter((it) => it.key === key));
      return g.filter((it) => it.key !== key);
    });
  const makeCover = (key: string) =>
    setGallery((g) => [...g.filter((it) => it.key === key), ...g.filter((it) => it.key !== key)]);
  // Reopening the dialog starts from the product's current data.
  const handleOpenChange = (next: boolean) => {
    if (next) {
      releasePreviews(gallery);
      setGallery(galleryFromProduct(product));
      if (product) {
        setForm(fromProduct(product));
        setTiers(tiersFromProduct(product));
      }
    }
    setOpen(next);
  };
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
      const productId = await adminSaveProduct(
        form,
        gallery.map((it) => it.file ?? it.src),
        product?.productId,
      );
      const clean = tiers
        .map((t) => ({
          minQuantity: Number(t.minQuantity),
          discountPercent: Number(t.discountPercent),
        }))
        .filter((t) => t.minQuantity > 0);
      // Send even when empty so removing all tiers on an edit clears them.
      if (clean.length > 0 || product) await adminSetProductTiers(productId, clean);
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
      releasePreviews(gallery);
      setGallery([]);
    },
    onError: (e: Error) => toast.error(e.message || (product ? "Failed to update product." : "Failed to create product.")),
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="images">
                Images ({gallery.length}/{MAX_IMAGES})
              </Label>
              <label
                htmlFor="images"
                className={`inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium ${
                  gallery.length >= MAX_IMAGES ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-muted"
                }`}
              >
                <ImagePlus className="h-3.5 w-3.5" />
                Add images
              </label>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                disabled={gallery.length >= MAX_IMAGES}
                onChange={(e) => {
                  addFiles(Array.from(e.target.files ?? []));
                  e.target.value = ""; // allow picking the same file again
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The first image is the cover shown in the store. Use the star to make an image the cover.
            </p>

            {gallery.length === 0 ? (
              <p className="rounded border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                No images yet.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {gallery.map((it, idx) => (
                  <div
                    key={it.key}
                    className="group relative aspect-square overflow-hidden rounded border border-border bg-muted/40"
                  >
                    {it.file ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.src} alt={`New image ${idx + 1}`} className="h-full w-full object-cover" />
                    ) : (
                      <ProductImage images={[it.src]} alt={`Product image ${idx + 1}`} className="h-full w-full" />
                    )}
                    {idx === 0 && (
                      <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                        Cover
                      </span>
                    )}
                    {it.file && (
                      <span className="absolute bottom-1 left-1 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium">
                        New
                      </span>
                    )}
                    <div className="absolute right-1 top-1 flex gap-1">
                      {idx !== 0 && (
                        <button
                          type="button"
                          aria-label="Make cover image"
                          title="Make cover"
                          onClick={() => makeCover(it.key)}
                          className="cursor-pointer rounded bg-background/90 p-1 hover:text-primary"
                        >
                          <Star className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label="Remove image"
                        title="Remove"
                        onClick={() => removeImage(it.key)}
                        className="cursor-pointer rounded bg-background/90 p-1 hover:text-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
