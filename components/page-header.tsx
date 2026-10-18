import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/container";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs text-muted-foreground", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
            {c.href ? (
              <Link href={c.href} className="hover:text-forest">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-ink">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Banner used at the top of inner storefront pages. */
export function PageHeader({
  title,
  subtitle,
  crumbs,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  crumbs: Crumb[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden border-b border-line bg-gradient-to-r from-sand via-cream to-sage-wash", className)}>
      <svg aria-hidden viewBox="0 0 200 200" className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 text-forest/[0.06]">
        <path fill="currentColor" d="M100 10c40 20 70 60 70 100 0 30-20 60-70 80C50 170 30 140 30 110 30 70 60 30 100 10Z" />
      </svg>
      <Container className="relative py-8 sm:py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display mt-4 text-3xl font-semibold text-forest-dark sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{subtitle}</p>}
        {children}
      </Container>
    </section>
  );
}
