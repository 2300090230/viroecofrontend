import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import {
  Home,
  ShoppingBag,
  Package,
  Building2,
  Recycle,
  Search,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist or has been moved.",
};

const POPULAR_SEARCHES = [
  { label: "Drinkware", href: "/products?category=drinkware" },
  { label: "Tableware", href: "/products?category=tableware" },
  { label: "Cutlery", href: "/products?category=cutlery" },
  { label: "Gift Hampers", href: "/products?category=gift-hampers" },
  { label: "Planters", href: "/products?category=planters" },
  { label: "Corporate Bulk", href: "/#industries" },
];

const HELPFUL_DESTINATIONS = [
  {
    title: "Browse Products",
    description: "Explore our collection of tableware and drinkware crafted from crop residues.",
    href: "/products",
    icon: ShoppingBag,
    badge: "Catalog",
  },
  {
    title: "Track Your Orders",
    description: "Look up order history, live fulfillment status, and tracking information.",
    href: "/orders",
    icon: Package,
    badge: "Account",
  },
  {
    title: "Enterprise Solutions",
    description: "Custom bulk procurement and sustainable corporate gifting for organizations.",
    href: "/#industries",
    icon: Building2,
    badge: "B2B",
  },
  {
    title: "Circular Lifecycle",
    description: "Discover how we turn agricultural waste into durable, carbon-negative goods.",
    href: "/#materials",
    icon: Recycle,
    badge: "Impact",
  },
];

export default function NotFound() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col bg-[#FAF9F5] text-[#17231C]">
        <Navbar />

        <main className="flex-1">
          <section className="relative overflow-hidden py-16 sm:py-24">
            {/* Background Ambient Eco Glows */}
            <div
              className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-none bg-gradient-to-tr from-[#50644C]/10 via-[#94A478]/10 to-transparent blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute bottom-10 right-10 w-72 h-72 rounded-none bg-[#C08058]/10 blur-2xl"
              aria-hidden="true"
            />

            <Container className="relative z-10 max-w-4xl">
              {/* Header Badge & 404 Visual */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 rounded-none border border-[#50644C]/15 bg-[#50644C]/5 px-3.5 py-1 text-xs font-semibold tracking-wide text-[#50644C] uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#94A478]" />
                  <span>404 · Page Not Found</span>
                </div>

                <div className="relative my-2 inline-block">
                  <h1 className="font-heading text-8xl sm:text-9xl font-extrabold tracking-tight text-[#50644C]/90 select-none drop-shadow-xs">
                    404
                  </h1>
                  <span className="absolute -bottom-1 -right-2 rotate-12 rounded-none bg-[#C08058] text-white px-2.5 py-0.5 text-xs font-bold shadow-xs">
                    Lost in nature
                  </span>
                </div>

                <h2 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight text-[#17231C]">
                  This page has naturally decomposed
                </h2>

                <p className="mx-auto max-w-xl text-base sm:text-lg text-[#5A6659] leading-relaxed">
                  The link you followed may be broken, or the page may have been relocated.
                  Let’s guide you back to our sustainable home &amp; kitchen collection.
                </p>
              </div>

              {/* Direct Search Form */}
              <div className="mt-8 mx-auto max-w-lg">
                <form
                  action="/products"
                  method="GET"
                  className="relative flex items-center shadow-xs rounded-none border border-[#50644C]/15 bg-white p-1.5 focus-within:border-[#50644C] focus-within:ring-2 focus-within:ring-[#50644C]/20 transition-all"
                >
                  <Search className="ml-3.5 w-5 h-5 text-[#5A6659] shrink-0" />
                  <input
                    type="text"
                    name="query"
                    placeholder="Search sustainable products, mugs, plates..."
                    className="w-full bg-transparent px-3 py-2 text-sm text-[#17231C] placeholder:text-[#5A6659]/70 focus:outline-none"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="cursor-pointer rounded-none bg-[#50644C] text-white hover:bg-[#243021] px-4 font-medium"
                  >
                    Search
                  </Button>
                </form>

                {/* Popular Tags */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-[#5A6659]">
                  <span className="font-medium text-[#17231C]">Popular:</span>
                  {POPULAR_SEARCHES.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="cursor-pointer rounded-none bg-[#50644C]/5 hover:bg-[#50644C]/10 px-2.5 py-1 text-[#50644C] font-medium transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
                <Button
                  asChild
                  size="lg"
                  className="cursor-pointer rounded-none bg-[#50644C] text-white hover:bg-[#243021] shadow-sm px-6 h-12 gap-2 text-base font-medium"
                >
                  <Link href="/">
                    <Home className="w-4 h-4" />
                    Back to Home
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="cursor-pointer rounded-none border-[#50644C]/20 bg-white hover:bg-[#EDF2EB] text-[#50644C] px-6 h-12 gap-2 text-base font-medium"
                >
                  <Link href="/products">
                    <ShoppingBag className="w-4 h-4" />
                    Explore Catalog
                  </Link>
                </Button>
              </div>

              {/* Helpful Destinations Grid */}
              <div className="mt-16">
                <div className="text-center mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#94A478]">
                    Or Jump Directly To
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {HELPFUL_DESTINATIONS.map((dest) => {
                    const Icon = dest.icon;
                    return (
                      <Link
                        key={dest.title}
                        href={dest.href}
                        className="cursor-pointer group relative flex flex-col justify-between rounded-none border border-[#50644C]/10 bg-white/80 p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#50644C]/30 hover:bg-white hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-[#EDF2EB] text-[#50644C] transition-colors group-hover:bg-[#50644C] group-hover:text-white">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-base text-[#17231C] group-hover:text-[#50644C]">
                                {dest.title}
                              </h4>
                              <span className="text-[11px] font-medium text-[#94A478] uppercase tracking-wider">
                                {dest.badge}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#5A6659] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#50644C]" />
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-[#5A6659]">
                          {dest.description}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Eco Fact Note */}
              <div className="mt-12 rounded-none border border-[#94A478]/20 bg-[#EDF2EB]/60 p-4 text-center sm:text-left flex flex-col sm:flex-row items-center gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-[#50644C] text-white text-sm font-bold">
                  🌱
                </div>
                <div className="text-xs text-[#17231C]">
                  <span className="font-bold text-[#50644C]">Sustainable by design: </span>
                  Every Viroeco product repurposes agricultural crop residues like rice husk and bamboo into durable, BPA-free essentials—diverting waste from stubble burning and landfills.
                </div>
              </div>
            </Container>
          </section>
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
