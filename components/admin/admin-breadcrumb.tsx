import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Reusable breadcrumb component for the admin panel.
 *
 * Usage:
 *   <AdminBreadcrumb items={[{ label: "Products", href: "/admin/products" }, { label: "Edit Product" }]} />
 *
 * The last item is always rendered as plain text (current page).
 * All preceding items are rendered as links.
 */
export function AdminBreadcrumb({ items }: AdminBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#5A6659] mb-6">
      <Link
        href="/admin"
        className="font-medium hover:text-[#50644C] transition-colors"
      >
        Admin
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-[#C5C3BC] shrink-0" />
            {isLast || !item.href ? (
              <span className={isLast ? "text-[#17231C] font-semibold" : "font-medium hover:text-[#50644C]"}>
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="font-medium hover:text-[#50644C] transition-colors">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
