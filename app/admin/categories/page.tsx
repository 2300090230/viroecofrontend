"use client";

import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Check, X, Plus, Loader2, Tags, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/endpoints";
import type { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<{ id: number; name: string } | null>(null);

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const fetched = await getCategories();
        if (Array.isArray(fetched)) return fetched;
      } catch (err) {
        console.error("Failed to load categories from DB:", err);
      }
      return [] as Category[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["categories"] });
    qc.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
  };

  const create = useMutation({
    mutationFn: async (n: string) => {
      return await createCategory(n);
    },
    onSuccess: (newCat) => {
      invalidate();
      setName("");
      toast.success(`Category "${newCat.name}" created successfully.`);
    },
    onError: (e: Error) => toast.error(e.message || "Failed to create category."),
  });

  const handleAddCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Please enter a category name in the field first.");
      document.getElementById("category-name-input")?.focus();
      return;
    }
    create.mutate(trimmed);
  };

  const update = useMutation({
    mutationFn: async ({ id, n }: { id: number; n: string }) => {
      return await updateCategory(id, n);
    },
    onSuccess: (updated) => {
      invalidate();
      setEditing(null);
      toast.success(`Category renamed to "${updated.name}".`);
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update category."),
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      return await deleteCategory(id);
    },
    onSuccess: () => {
      invalidate();
      toast.success("Category deleted successfully.");
    },
    onError: (e: Error) => toast.error(e.message || "Unable to delete category."),
  });

  const list = categories.data ?? [];
  const filteredList = list.filter((c) =>
    !search.trim() || c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl space-y-8">
      <AdminBreadcrumb items={[{ label: "Categories" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#17231C]">
              Categories
            </h1>
            <Badge variant="outline" className="bg-[#EDF2EB] text-[#50644C] border-[#50644C]/20 text-xs font-semibold">
              {list.length} Categories
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#5A6659] mt-1">
            Organize catalog classifications, collections, and product navigation.
          </p>
        </div>
      </div>

      {/* Add Category Form Card */}
      <div className="rounded-none border border-[#DFD5C6] bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#17231C] uppercase tracking-wider">
          <Plus className="w-4 h-4 text-[#50644C]" />
          <span>Add New Category</span>
        </div>
        <form
          onSubmit={handleAddCategory}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <Input
            ref={inputRef}
            id="category-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name (e.g. Planters, Tableware, Drinkware)..."
            aria-label="New category name"
            disabled={create.isPending}
            className="flex-1 text-xs rounded-none border-[#DFD5C6] h-10 focus-visible:ring-[#50644C]"
          />
          <Button
            type="submit"
            className="cursor-pointer bg-[#50644C] hover:bg-[#243021] text-white rounded-none text-xs font-semibold h-10 px-5 gap-1.5 shrink-0 shadow-xs active:scale-95 transition-all"
            disabled={create.isPending}
          >
            {create.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Category List Container */}
      <div className="rounded-none border border-[#DFD5C6] bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#DFD5C6] bg-[#FAF9F5] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Tags className="w-4 h-4 text-[#50644C]" />
            <span className="text-xs font-bold text-[#17231C]">Active Classifications</span>
          </div>

          {list.length > 5 && (
            <div className="relative max-w-xs w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-[#5A6659] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories..."
                className="pl-8 h-8 text-xs rounded-none border-[#DFD5C6] bg-white"
              />
            </div>
          )}
        </div>

        {categories.isLoading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-12 w-full rounded-none" />
            <Skeleton className="h-12 w-full rounded-none" />
            <Skeleton className="h-12 w-full rounded-none" />
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#5A6659]">
            {search.trim() ? "No categories matching your search." : "No categories yet. Add one above."}
          </div>
        ) : (
          <ul className="divide-y divide-[#DFD5C6]">
            {filteredList.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-[#FAF9F5]/80 transition-colors">
                {editing?.id === c.id ? (
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <Input
                      value={editing.name}
                      onChange={(e) => setEditing({ id: c.id, name: e.target.value })}
                      disabled={update.isPending}
                      className="h-8 text-xs rounded-none border-[#DFD5C6]"
                      autoFocus
                    />
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="cursor-pointer h-8 w-8 p-0 text-emerald-700 hover:bg-emerald-50 rounded-none"
                        aria-label="Save"
                        disabled={update.isPending || !editing.name.trim()}
                        onClick={() => update.mutate({ id: c.id, n: editing.name.trim() })}
                      >
                        {update.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="cursor-pointer h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-none"
                        aria-label="Cancel"
                        disabled={update.isPending}
                        onClick={() => setEditing(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-[#5A6659] w-8">#{c.id}</span>
                      <span className="text-xs font-semibold text-[#17231C]">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="cursor-pointer h-8 w-8 p-0 text-[#5A6659] hover:text-[#17231C] hover:bg-[#EDF2EB] rounded-none"
                        aria-label={`Edit ${c.name}`}
                        onClick={() => setEditing({ id: c.id, name: c.name })}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="cursor-pointer h-8 w-8 p-0 text-[#5A6659] hover:text-red-600 hover:bg-rose-50 rounded-none"
                        aria-label={`Delete ${c.name}`}
                        disabled={remove.isPending}
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete category "${c.name}"?`)) {
                            remove.mutate(c.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
