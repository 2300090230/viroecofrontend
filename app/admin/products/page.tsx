"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImage } from "@/components/product-image";
import { ProductFormDialog } from "@/components/admin/product-form-dialog";
import { DeleteProductDialog } from "@/components/admin/delete-product-dialog";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { getAllProducts, adminDeleteProduct, getCategories } from "@/lib/endpoints";
import { DataTablePagination } from "@/components/ui/pagination";
import { formatINR } from "@/lib/format";
import type { Product, Category } from "@/lib/types";

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const productsQuery = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      try {
        const fetched = await getAllProducts();
        if (Array.isArray(fetched)) return fetched;
      } catch (err) {
        console.error("Failed to load admin products:", err);
      }
      return [] as Product[];
    },
  });

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

  const del = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason?: string }) => {
      return await adminDeleteProduct(id, reason);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
      toast.success("Product deleted and logged in audit trail.");
    },
    onError: (e: Error) => toast.error(e.message || "Unable to delete product."),
  });

  const allList = productsQuery.data ?? [];
  const categoriesList = categoriesQuery.data ?? [];

  const filtered = useMemo(() => {
    return allList.filter((p) => {
      const matchesSearch =
        !q.trim() ||
        p.pname.toLowerCase().includes(q.toLowerCase()) ||
        p.category.toLowerCase().includes(q.toLowerCase()) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(q.toLowerCase()));
      const matchesCat = !selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCat;
    });
  }, [allList, q, selectedCategory]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    return filtered.slice(page * pageSize, (page + 1) * pageSize);
  }, [filtered, page, pageSize]);

  return (
    <div>
      <AdminBreadcrumb items={[{ label: "Products" }]} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-tight">Products</h1>
          <p className="mt-1 text-muted-foreground">
            {filtered.length} products found ({allList.length} total in catalogue).
          </p>
        </div>
        <ProductFormDialog
          trigger={
            <Button className="cursor-pointer">
              <Plus className="mr-1 h-4 w-4" /> New product
            </Button>
          }
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(0);
          }}
          placeholder="Search by name or category…"
          className="max-w-sm"
          aria-label="Search products"
        />

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(0);
          }}
          className="rounded-none border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-hidden focus:ring-2 focus:ring-ring"
        >
          <option value="">All Categories ({allList.length})</option>
          {categoriesList.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {productsQuery.isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center border border-border bg-card">
            <p className="text-muted-foreground">No products match your search.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto border border-border">
              <table className="w-full min-w-[680px] text-sm">
                <thead className="bg-sand text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Product</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Category</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Price</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Stock</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p) => (
                    <tr key={p.productId} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ProductImage
                            images={p.productImages}
                            alt={p.pname}
                            className="h-12 w-12 shrink-0 border border-border object-cover rounded-none"
                            sizes="48px"
                          />
                          <div>
                            <span className="font-medium line-clamp-1">{p.pname}</span>
                            <span className="text-xs text-muted-foreground">ID: {p.productId} · {p.material}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        <Badge variant="outline" className="mr-1 font-normal">
                          {p.category}
                        </Badge>
                        {p.subCategory && p.subCategory !== p.category && (
                          <span className="text-xs text-muted-foreground">· {p.subCategory}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 tabular-nums whitespace-nowrap">
                        <span className="font-semibold text-forest">{formatINR(p.price)}</span>
                        {p.originalPrice > p.price && (
                          <span className="ml-1.5 text-xs text-muted-foreground line-through">
                            {formatINR(p.originalPrice)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {p.quantity > 0 ? (
                          <span className="tabular-nums text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-none font-medium">
                            {p.quantity} in stock
                          </span>
                        ) : (
                          <Badge variant="outline" className="text-destructive">
                            Out
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
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
                          <DeleteProductDialog
                            product={p}
                            onConfirm={(id, reason) => del.mutateAsync({ id, reason })}
                            isDeleting={del.isPending && del.variables?.id === p.productId}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div className="mt-4">
              <DataTablePagination
                page={page}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={pageSize}
                pageSizeOptions={[10, 20, 50, 100]}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                showPageSize={true}
                showItemCount={true}
                itemLabel="products"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
