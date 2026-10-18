import { normalizeImageUrls } from "@/lib/images";
import type { Category, Product } from "@/lib/types";

export interface Collection {
  name: string;
  count: number;
  /** First image of up to a few products in the collection — real catalogue photography. */
  images: string[];
  href: string;
}

const firstImage = (p: Product) => normalizeImageUrls(p.productImages)[0];

export function imagesOf(products: Product[], limit = 3): string[] {
  const out: string[] = [];
  for (const p of products) {
    const img = firstImage(p);
    if (img && !out.includes(img)) out.push(img);
    if (out.length === limit) break;
  }
  return out;
}

export const categoryHref = (name: string) => `/products?category=${encodeURIComponent(name)}`;

/**
 * Collections = admin-managed categories joined with their products, ordered by size.
 * Falls back to categories derived from products when the category table is empty.
 */
export function buildCollections(categories: Category[], products: Product[]): Collection[] {
  const names = categories.length > 0
    ? categories.map((c) => c.name)
    : Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  return names
    .map((name) => {
      const items = products.filter((p) => p.category?.toLowerCase() === name.toLowerCase());
      return { name, count: items.length, images: imagesOf(items, 3), href: categoryHref(name) };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Short, honest descriptions for well-known collection names; generic text otherwise. */
const COPY: [RegExp, string][] = [
  [/drink|mug|cup|bottle|sipper/i, "Mugs, cups, sippers and bottles for hot and cold drinks."],
  [/table|plate|bowl|dinner|serve/i, "Plates, bowls and serveware for everyday dining."],
  [/garden|plant|planter|pot/i, "Planters and pots for balconies, homes and offices."],
  [/storage|kitchen|jar|container|organi/i, "Containers and organisers for a tidier kitchen."],
  [/cutlery|spoon|fork/i, "Spoons, forks and cutlery for home and on the go."],
  [/lunch|tiffin|box/i, "Lunch boxes and tiffins for school, work and travel."],
  [/kid|child/i, "Lightweight, durable pieces made for little hands."],
];

export function describeCollection(name: string): string {
  return COPY.find(([re]) => re.test(name))?.[1] ?? `Explore our ${name.toLowerCase()} range.`;
}
