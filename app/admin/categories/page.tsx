"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/endpoints";

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<{ id: number; name: string } | null>(null);

  const categories = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["categories"] });

  const create = useMutation({
    mutationFn: (n: string) => createCategory(n),
    onSuccess: () => {
      invalidate();
      setName("");
      toast.success("Category added");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: ({ id, n }: { id: number; n: string }) => updateCategory(id, n),
    onSuccess: () => {
      invalidate();
      setEditing(null);
      toast.success("Category updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      invalidate();
      toast.success("Category removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const list = categories.data ?? [];

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-4xl tracking-tight">Categories</h1>
      <p className="mt-1 text-muted-foreground">Organise the catalogue.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) create.mutate(name.trim());
        }}
        className="mt-8 flex gap-2"
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          aria-label="New category name"
        />
        <Button type="submit" className="cursor-pointer" disabled={create.isPending || !name.trim()}>
          Add
        </Button>
      </form>

      <div className="mt-8">
        {categories.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : list.length === 0 ? (
          <p className="text-muted-foreground">No categories yet. Add one above.</p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {list.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                {editing?.id === c.id ? (
                  <>
                    <Input
                      value={editing.name}
                      onChange={(e) => setEditing({ id: c.id, name: e.target.value })}
                      className="max-w-xs"
                    />
                    <div className="flex gap-1">
                      <button
                        className="cursor-pointer p-2 text-moss-deep hover:opacity-70"
                        aria-label="Save"
                        onClick={() => update.mutate({ id: c.id, n: editing.name.trim() })}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        className="cursor-pointer p-2 text-muted-foreground hover:text-foreground"
                        aria-label="Cancel"
                        onClick={() => setEditing(null)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span>{c.name}</span>
                    <div className="flex gap-1">
                      <button
                        className="cursor-pointer p-2 text-muted-foreground hover:text-foreground"
                        aria-label={`Edit ${c.name}`}
                        onClick={() => setEditing({ id: c.id, name: c.name })}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className="cursor-pointer p-2 text-muted-foreground hover:text-destructive"
                        aria-label={`Delete ${c.name}`}
                        onClick={() => remove.mutate(c.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
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
