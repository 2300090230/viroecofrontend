// URL <-> filter mapping for the shop page. Pure, so server and client both use it.
import type { ProductSort } from "@/lib/endpoints";

export interface CatalogFilters {
  query: string;
  category: string;
  material: string;
  inStock: boolean;
  minPrice: string;
  maxPrice: string;
  sort: ProductSort;
  page: number;
  size: number;
}

export const DEFAULT_PAGE_SIZE = 24;
const SORT_VALUES: ProductSort[] = ["newest", "price-asc", "price-desc", "name"];

type ParamSource = { get(name: string): string | null };

export function parseCatalogFilters(sp: ParamSource): CatalogFilters {
  const sort = sp.get("sort") as ProductSort | null;
  const size = Number(sp.get("size"));
  return {
    query: sp.get("query") ?? "",
    category: sp.get("category") ?? "",
    material: sp.get("material") ?? "",
    inStock: sp.get("stock") === "1",
    minPrice: sp.get("min") ?? "",
    maxPrice: sp.get("max") ?? "",
    sort: sort && SORT_VALUES.includes(sort) ? sort : "newest",
    page: Math.max(0, Number(sp.get("page")) || 0),
    size: [12, 24, 48].includes(size) ? size : DEFAULT_PAGE_SIZE,
  };
}
