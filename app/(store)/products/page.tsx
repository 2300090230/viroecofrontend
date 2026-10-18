import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { Catalog } from "@/components/catalog";
import { PageHeader, type Crumb } from "@/components/page-header";
import { describeCollection } from "@/lib/collections";
import { parseCatalogFilters } from "@/lib/catalog-filters";

export const metadata: Metadata = { title: "Shop" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(raw)) if (typeof v === "string") params.set(k, v);
  const filters = parseCatalogFilters(params);

  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, { label: "Shop", href: filters.category ? "/products" : undefined }];
  if (filters.category) crumbs.push({ label: filters.category });

  const title = filters.category || (filters.query ? `Results for “${filters.query}”` : "All products");
  const subtitle = filters.category
    ? describeCollection(filters.category)
    : "Everyday essentials made from rice husk and bamboo composites — for homes, kitchens, gardens and businesses.";

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} crumbs={crumbs} />
      <Container className="py-8 sm:py-10">
        <Suspense>
          <Catalog />
        </Suspense>
      </Container>
    </>
  );
}
