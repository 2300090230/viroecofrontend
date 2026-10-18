import Link from "next/link";
import { Headphones, Leaf, Mail, Package, Phone, ShieldCheck } from "lucide-react";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { BUSINESS, telHref } from "@/lib/business";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All products" },
      { href: "/categories", label: "Categories" },
      { href: "/calculator", label: "Savings calculator" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/impact", label: "Sustainability" },
      { href: "/enterprise", label: "Bulk & corporate" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/orders", label: "Track your order" },
      { href: "/faq", label: "FAQs" },
      { href: "/contact", label: "Contact us" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms & conditions" },
    ],
  },
];

// Promises backed by real platform features: Razorpay checkout, bulk tier pricing,
// plant-based catalogue, and the contact/quote channels.
const ASSURANCES = [
  { icon: ShieldCheck, title: "Secure payments", text: "Checkout powered by Razorpay" },
  { icon: Package, title: "Bulk pricing", text: "Automatic tier discounts on volume" },
  { icon: Leaf, title: "Plant-based materials", text: "Rice husk & bamboo composites" },
  { icon: Headphones, title: "Customer support", text: "We reply to every enquiry" },
];

export function Footer() {
  return (
    <footer className="no-print">
      <div className="border-y border-line bg-sage-wash">
        <Container className="grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {ASSURANCES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-forest/20 bg-white text-forest">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="text-xs text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </Container>
      </div>

      <div className="bg-cream">
        <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:py-14">
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <Logo size="lg" imageClassName="h-12 w-auto" />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Thoughtfully made everyday products from rice husk and bamboo — for homes,
              kitchens, gardens and businesses.
            </p>
            <div className="space-y-2 pt-1 text-sm">
              <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-2 text-ink hover:text-forest">
                <Mail className="h-4 w-4 text-forest" aria-hidden /> {BUSINESS.email}
              </a>
              <a href={telHref(BUSINESS.phone)} className="flex items-center gap-2 text-ink hover:text-forest">
                <Phone className="h-4 w-4 text-forest" aria-hidden /> {BUSINESS.phone}
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <p className="text-sm font-semibold text-ink">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-forest">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="sm:col-span-2 lg:col-span-2">
            <p className="text-sm font-semibold text-ink">Buying in bulk?</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Restaurants, events, retailers and corporate gifting — get a tailored quote.
            </p>
            <Link
              href="/enterprise"
              className="mt-4 inline-flex h-10 items-center rounded-md bg-forest px-4 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
            >
              Request a quote
            </Link>
          </div>
        </Container>

        <div className="border-t border-line">
          <Container className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
            <p>
              © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
              {BUSINESS.gstin && <span className="ml-2">GSTIN: {BUSINESS.gstin}</span>}
            </p>
            <div className="flex items-center gap-2" aria-label="Accepted payment methods">
              {["UPI", "VISA", "Mastercard", "RuPay", "Net banking"].map((m) => (
                <span key={m} className="rounded border border-line bg-white px-2 py-0.5 font-medium text-ink/70">
                  {m}
                </span>
              ))}
            </div>
          </Container>
        </div>
      </div>
    </footer>
  );
}
