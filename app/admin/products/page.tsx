"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImage } from "@/components/product-image";
import { ProductFormDialog } from "@/components/admin/product-form-dialog";
import { getAllProducts, adminDeleteProduct } from "@/lib/endpoints";
import { formatINR } from "@/lib/format";

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const products = useQuery({ queryKey: ["admin", "products"], queryFn: getAllProducts });

  const del = useMutation({
    mutationFn: (id: number) => adminDeleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    const list = products.data ?? [];
    if (!q.trim()) return list;
    const term = q.toLowerCase();
    return list.filter(
      (p) => p.pname.toLowerCase().includes(term) || p.category.toLowerCase().includes(term),
    );
  }, [products.data, q]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-tight">Products</h1>
          <p className="mt-1 text-muted-foreground">{products.data?.length ?? 0} in the catalogue.</p>
        </div>
        <ProductFormDialog
          trigger={
            <Button className="cursor-pointer">
              <Plus className="mr-1 h-4 w-4" /> New product
            </Button>
          }
        />
      </div>

      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name or category…"
        className="mt-6 max-w-sm"
        aria-label="Search products"
      />

      <div className="mt-6">
        {products.isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="overflow-x-auto border border-border">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="bg-sand text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Product</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Price</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Stock</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.productId} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProductImage
                          images={p.productImages}
                          alt={p.pname}
                          className="h-12 w-12 shrink-0 border border-border"
                          sizes="48px"
                        />
                        <span className="font-medium">{p.pname}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {p.category}
                      {p.subCategory ? ` · ${p.subCategory}` : ""}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{formatINR(p.price)}</td>
                    <td className="px-4 py-3">
                      {p.quantity > 0 ? (
                        <span className="tabular-nums">{p.quantity}</span>
                      ) : (
                        <Badge variant="outline" className="text-destructive">
                          Out
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <ProductFormDialog
                          product={p}
                          trigger={
                            <button
                              className="cursor-pointer p-2 text-muted-foreground hover:text-foreground"
                              aria-label={`Edit ${p.pname}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          }
                        />
                        <button
                          className="cursor-pointer p-2 text-muted-foreground hover:text-destructive"
                          aria-label={`Delete ${p.pname}`}
                          onClick={() => {
                            if (confirm(`Delete "${p.pname}"?`)) del.mutate(p.productId);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
