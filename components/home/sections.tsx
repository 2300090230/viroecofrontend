import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarHeart,
  Coffee,
  Factory,
  Gift,
  Headphones,
  Home,
  Leaf,
  Package,
  PackageCheck,
  ShieldCheck,
  Sprout,
  Truck,
  UtensilsCrossed,
  Wheat,
} from "lucide-react";
import { Container } from "@/components/container";
import { describeCollection, type Collection } from "@/lib/collections";
import { cn } from "@/lib/utils";

/* ── Shared heading ─────────────────────────────────────────────────────── */

export function SectionHeading({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8", className)}>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
      </div>
      {action && (
        <Link href={action.href} className="group inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest-dark">
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}

/* ── Trust strip (only promises the platform actually keeps) ───────────── */

const TRUST = [
  { icon: Leaf, title: "Plant-based", text: "Rice husk & bamboo" },
  { icon: Package, title: "Bulk pricing", text: "Tiered volume discounts" },
  { icon: ShieldCheck, title: "Secure payments", text: "Razorpay checkout" },
  { icon: Truck, title: "Order tracking", text: "Follow every order" },
  { icon: Headphones, title: "Customer support", text: "Real people, quick replies" },
];

export function TrustStrip() {
  return (
    <section aria-label="Why shop with us" className="border-b border-line bg-white">
      <Container className="grid grid-cols-2 gap-x-4 gap-y-5 py-6 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-line">
        {TRUST.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3 lg:justify-center lg:px-3">
            <Icon className="h-7 w-7 shrink-0 text-forest" strokeWidth={1.5} aria-hidden />
            <div className="leading-tight">
              <p className="text-sm font-medium text-ink">{title}</p>
              <p className="text-xs text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}

/* ── Collections grid ──────────────────────────────────────────────────── */

export function CollectionsGrid({ collections }: { collections: Collection[] }) {
  const visible = collections.filter((c) => c.count > 0).slice(0, 4);
  if (visible.length === 0) return null;

  return (
    <section className="bg-cream pt-12 sm:pt-16 lg:pt-20">
      <Container>
        <SectionHeading title="Shop our collections" action={{ label: "View all categories", href: "/categories" }} />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {visible.map((c) => (
            <Link
              key={c.name}
              href={c.href}
              className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-sand">
                {c.images[0] ? (
                  <Image src={c.images[0]} alt="" fill unoptimized sizes="(max-width: 1024px) 50vw, 300px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Sprout className="h-10 w-10 text-forest/30" aria-hidden />
                  </div>
                )}
              </div>
              <div className="flex flex-1 items-start justify-between gap-3 p-4">
                <div>
                  <h3 className="text-base font-semibold text-ink">{c.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {describeCollection(c.name)}
                  </p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-forest/30 text-forest transition-colors group-hover:bg-forest group-hover:text-white">
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── From nature to products ───────────────────────────────────────────── */

const PROCESS = [
  { icon: Wheat, title: "Crop residue", text: "Rice husk left after harvest" },
  { icon: Sprout, title: "Natural fibres", text: "Blended with bamboo fibre" },
  { icon: Factory, title: "Moulding & shaping", text: "Pressed into durable forms" },
  { icon: PackageCheck, title: "Everyday products", text: "Ready for home & business" },
];

export function ProcessStrip() {
  return (
    <section className="bg-cream py-10 sm:py-12 lg:py-14">
      <Container>
        <div className="grid items-center gap-6 rounded-xl border border-line bg-sage-wash p-6 sm:p-8 lg:grid-cols-[220px_1fr_auto] lg:gap-10">
          <div>
            <h2 className="font-display text-2xl font-semibold leading-tight text-forest-dark sm:text-3xl">
              From nature to products
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Turning agricultural residue into useful everyday things.</p>
          </div>
          <ol className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {PROCESS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative flex flex-col items-center rounded-lg bg-white p-4 text-center shadow-card">
                <span className="absolute left-3 top-2 text-xs font-semibold text-forest/40">0{i + 1}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-wash text-forest">
                  <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                </span>
                <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
          <Link
            href="/impact"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-forest/30 bg-white px-5 text-sm font-medium text-forest hover:bg-forest hover:text-white transition-colors"
          >
            Our materials <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}

/* ── Promo banners (material-led, real product photos) ─────────────────── */

export interface PromoBanner {
  title: string;
  text: string;
  href: string;
  cta: string;
  images: string[];
}

export function PromoBanners({ banners }: { banners: PromoBanner[] }) {
  if (banners.length === 0) return null;
  return (
    <section className="pb-12 sm:pb-16 lg:pb-20 bg-cream">
      <Container className={cn("grid gap-5", banners.length > 1 && "lg:grid-cols-2")}>
        {banners.map((b, i) => (
          <div
            key={b.title}
            className={cn(
              "relative flex min-h-[220px] overflow-hidden rounded-xl p-6 sm:p-8",
              i % 2 === 0 ? "bg-forest-dark text-white" : "bg-sage-wash text-ink",
            )}
          >
            <div className="relative z-10 flex max-w-[52%] flex-col justify-center xl:max-w-[50%]">
              <h3 className={cn("font-display text-2xl font-semibold leading-tight xl:text-[1.75rem]", i % 2 === 0 ? "text-white" : "text-forest-dark")}>
                {b.title}
              </h3>
              <p className={cn("mt-2 text-sm leading-relaxed", i % 2 === 0 ? "text-white/80" : "text-muted-foreground")}>{b.text}</p>
              <Link
                href={b.href}
                className={cn(
                  "mt-5 inline-flex h-10 w-fit items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors",
                  i % 2 === 0 ? "bg-white text-forest-dark hover:bg-sand" : "bg-forest text-white hover:bg-forest-dark",
                )}
              >
                {b.cta} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="absolute inset-y-0 right-0 flex w-[44%] items-center gap-3 pr-5 sm:pr-6">
              {b.images.slice(0, 2).map((src, k) => (
                <div
                  key={src}
                  className={cn(
                    "relative aspect-square flex-1 overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black/5",
                    k === 1 && "translate-y-6",
                  )}
                >
                  <Image src={src} alt="" fill unoptimized sizes="200px" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}

/* ── Made for real life ────────────────────────────────────────────────── */

const USE_CASES = [
  { icon: Home, title: "At home", text: "Everyday dining & family meals", href: "/products" },
  { icon: UtensilsCrossed, title: "Restaurants", text: "Serving, takeaway & kitchens", href: "/enterprise" },
  { icon: Coffee, title: "Cafés", text: "Cups & serveware for coffee bars", href: "/enterprise" },
  { icon: CalendarHeart, title: "Events", text: "Catering & celebrations", href: "/enterprise" },
];

export function UseCases() {
  return (
    <section className="section bg-white">
      <Container>
        <SectionHeading
          title="Made for real life"
          subtitle="Our products fit seamlessly into everyday moments."
          action={{ label: "Bulk solutions", href: "/enterprise" }}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {USE_CASES.map(({ icon: Icon, title, text, href }) => (
            <Link
              key={title}
              href={href}
              className="group relative overflow-hidden rounded-lg border border-line bg-gradient-to-br from-sand to-camel-light p-5 transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-forest shadow-xs">
                <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
              </span>
              <h3 className="mt-6 text-base font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{text}</p>
              <ArrowRight className="absolute right-5 top-5 h-5 w-5 text-forest/40 transition-all group-hover:translate-x-0.5 group-hover:text-forest" aria-hidden />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── Why choose VIRO eco ───────────────────────────────────────────────── */

const REASONS = [
  { icon: Leaf, title: "Plant-based materials", text: "Made using natural and agricultural residue materials." },
  { icon: Sprout, title: "Thoughtfully designed", text: "Practical, functional and modern." },
  { icon: Home, title: "Made for everyday life", text: "Suitable for home, business and events." },
  { icon: Package, title: "Ready for bulk", text: "Volume pricing applied automatically at checkout." },
];

export function WhyChoose() {
  return (
    <section className="bg-sage-wash">
      <Container className="grid gap-8 py-12 sm:py-14 lg:grid-cols-[1fr_340px] lg:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Why choose VIRO eco?</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {REASONS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3 lg:flex-col">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-forest/25 bg-white text-forest">
                  <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-ink">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-forest-dark p-8 text-white">
          <svg aria-hidden viewBox="0 0 200 200" className="absolute -right-10 -top-10 h-56 w-56 text-white/10">
            <path fill="currentColor" d="M100 10c40 20 70 60 70 100 0 30-20 60-70 80C50 170 30 140 30 110 30 70 60 30 100 10Z" />
          </svg>
          <p className="font-display relative text-3xl font-semibold leading-tight">
            Small choices make a big difference.
          </p>
          <Link href="/impact" className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white">
            See our impact <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}

/* ── Corporate gifting / bulk business ─────────────────────────────────── */

export function BusinessCtas({ images }: { images: string[] }) {
  const cards = [
    {
      icon: Gift,
      title: "Corporate gifting",
      text: "Thoughtful, sustainable gifts for your teams, clients and special occasions.",
      cta: "Explore gifting",
      href: "/enterprise",
      image: images[0],
    },
    {
      icon: Building2,
      title: "Bulk & business",
      text: "Looking for larger quantities? Solutions for businesses, events and retail.",
      cta: "Get a quote",
      href: "/enterprise#quote",
      image: images[1],
    },
  ];

  return (
    <section className="section bg-cream">
      <Container className="grid gap-5 lg:grid-cols-2">
        {cards.map(({ icon: Icon, title, text, cta, href, image }) => (
          <div key={title} className="relative flex min-h-[230px] overflow-hidden rounded-xl border border-line bg-gradient-to-r from-sand via-sand to-camel-light p-6 sm:p-8">
            <div className="relative z-10 max-w-[58%]">
              <Icon className="h-8 w-8 text-forest" strokeWidth={1.5} aria-hidden />
              <h3 className="font-display mt-3 text-2xl font-semibold text-forest-dark sm:text-3xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              <Link
                href={href}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-forest px-4 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
              >
                {cta} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            {image && (
              <div className="absolute bottom-0 right-0 top-0 w-[42%]">
                <div className="absolute inset-y-6 right-6 left-0 overflow-hidden rounded-lg shadow-xl ring-1 ring-black/5">
                  <Image src={image} alt="" fill unoptimized sizes="260px" className="object-cover" />
                </div>
              </div>
            )}
          </div>
        ))}
      </Container>
    </section>
  );
}
