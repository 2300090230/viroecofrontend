import { Container } from "@/components/container";
import { Catalog } from "@/components/catalog";

export const metadata = { title: "Shop" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string; page?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="pt-24">
      <Container>
        <header className="py-8">
          <p className="text-xs uppercase tracking-[0.25em] text-terra-deep">Shop</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">The collection</h1>
        </header>
        <Catalog
          initialQuery={sp.query ?? ""}
          initialCategory={sp.category ?? ""}
          initialPage={sp.page ? Number(sp.page) : 0}
        />
      </Container>
    </div>
  );
}
