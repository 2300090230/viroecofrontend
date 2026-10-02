"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Send,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Leaf,
  Award,
  CheckCircle2,
  Globe,
  ChevronUp,
  ArrowUp,
  Building2,
  ArrowUpRight,
  Truck,
  HeartHandshake,
  Check,
} from "lucide-react";

import { Logo } from "@/components/logo";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success("Subscribed to ViroEco Circular Insights!", {
      description: "Quarterly sustainability benchmarks and catalog updates will be sent to " + email,
    });
    setEmail("");
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-[#50644C]/20 bg-[#243021] text-white select-none">
      {/* 1. Top Enterprise Impact & Certification Banner */}
      <div className="border-b border-white/10 bg-[#1A2418]/95 py-6 px-4 sm:px-6 lg:px-8">
        <Container className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Key Circular Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full lg:w-auto text-center lg:text-left">
            <div>
              <p className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-[#CCAC88] tracking-tight">
                1,000+ <span className="text-xs sm:text-sm font-normal text-emerald-200/80">MT</span>
              </p>
              <p className="text-[10px] sm:text-[11px] text-emerald-100/70 uppercase tracking-wider font-semibold mt-0.5">
                CO₂e Neutralized
              </p>
            </div>
            <div>
              <p className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-[#CCAC88] tracking-tight">
                400+ <span className="text-xs sm:text-sm font-normal text-emerald-200/80">MT</span>
              </p>
              <p className="text-[10px] sm:text-[11px] text-emerald-100/70 uppercase tracking-wider font-semibold mt-0.5">
                Plastic Displaced
              </p>
            </div>
            <div>
              <p className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-[#CCAC88] tracking-tight">
                4,500+
              </p>
              <p className="text-[10px] sm:text-[11px] text-emerald-100/70 uppercase tracking-wider font-semibold mt-0.5">
                Farmer Partners
              </p>
            </div>
            <div>
              <p className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-[#CCAC88] tracking-tight">
                0.00 <span className="text-xs sm:text-sm font-normal text-emerald-200/80">ppm</span>
              </p>
              <p className="text-[10px] sm:text-[11px] text-emerald-100/70 uppercase tracking-wider font-semibold mt-0.5">
                PFAS &amp; Toxic Free
              </p>
            </div>
          </div>

          {/* Accredited Verification Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 sm:gap-2.5 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-none bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-medium text-emerald-200">
              <Award className="w-3.5 h-3.5 text-[#CCAC88]" />
              TUV OK Compost
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-none bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-medium text-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#CCAC88]" />
              CIPET ISO 17088
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-none bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-medium text-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#CCAC88]" />
              FDA 21 CFR
            </span>
          </div>
        </Container>
      </div>

      {/* 2. Main 5-Column Information Architecture */}
      <Container className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8">
        {/* Column 1: Brand, Mission & Enterprise Newsletter (4 Cols) */}
        <div className="sm:col-span-2 lg:col-span-4 space-y-4 sm:space-y-5">
          <Logo variant="light" size="lg" imageClassName="h-9 sm:h-10 w-auto" />

          <p className="text-xs text-emerald-100/75 leading-relaxed pr-2">
            ViroEco converts post-harvest agricultural crop residues—rice husks, bamboo fibers, sugarcane bagasse, and fallen areca palm leaves—into high-performance, 100% biodegradable dinnerware, drinkware, kitchen storage, and foodservice packaging.
          </p>

          {/* Newsletter Input */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
              Subscribe for ESG Case Studies &amp; Pricing
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-sm">
              <Input
                type="email"
                placeholder="procurement@enterprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/15 text-white placeholder:text-emerald-200/50 rounded-none text-xs h-9 focus-visible:ring-emerald-400"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-none px-4 cursor-pointer text-xs shrink-0 font-semibold h-9 shadow-xs justify-center"
              >
                {subscribed ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              </Button>
            </form>
            <p className="text-[10px] text-emerald-300/60">
              Zero spam. Verified enterprise insights &amp; catalog releases only.
            </p>
          </div>

          {/* Corporate Legal Identifiers */}
          <div className="pt-2 text-[10px] font-mono text-emerald-200/50 space-y-0.5 border-t border-white/10">
            <p>CIN: U24299KA2024PTC184920</p>
            <p>GSTIN: 29AABCU9603R1ZM • IEC: 0724018892</p>
          </div>
        </div>

        {/* Column 2: Circular Solutions & Catalog (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <p className="text-xs uppercase tracking-[0.18em] font-bold text-emerald-400">
            Products &amp; Lines
          </p>
          <nav className="flex flex-col space-y-2.5 text-xs text-emerald-100/70">
            <Link href="/products?category=Drinkware" className="hover:text-white transition-colors flex items-center justify-between group">
              <span>Drinkware &amp; Sippers</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
            </Link>
            <Link href="/products?category=Tableware" className="hover:text-white transition-colors flex items-center justify-between group">
              <span>Tableware &amp; Dinner sets</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
            </Link>
            <Link href="/products?query=Bagasse" className="hover:text-white transition-colors flex items-center justify-between group">
              <span>Sugarcane Meal Trays</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
            </Link>
            <Link href="/products?category=Gardenware" className="hover:text-white transition-colors flex items-center justify-between group">
              <span>Self-Watering Planters</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
            </Link>
            <Link href="/products?category=Storage" className="hover:text-white transition-colors flex items-center justify-between group">
              <span>Stackable Food Storage</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
            </Link>
            <Link href="/categories" className="hover:text-white transition-colors flex items-center justify-between group">
              <span>All 26 Categories</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
            </Link>
          </nav>
        </div>

        {/* Column 3: Materials & Sustainability (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <p className="text-xs uppercase tracking-[0.18em] font-bold text-emerald-400">
            Technology &amp; ESG
          </p>
          <nav className="flex flex-col space-y-2.5 text-xs text-emerald-100/70">
            <Link href="/materials" className="hover:text-white transition-colors flex items-center justify-between group">
              <span>Materials Science</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
            </Link>
            <Link href="/calculator" className="hover:text-white transition-colors flex items-center justify-between group">
              <span>Carbon Offset Calculator</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
            </Link>
            <Link href="/impact" className="hover:text-white transition-colors flex items-center justify-between group">
              <span>Life Cycle Analysis (LCA)</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
            </Link>
            <Link href="/why-us" className="hover:text-white transition-colors flex items-center justify-between group">
              <span>Stubble Burning Prevention</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
            </Link>
            <Link href="/enterprise" className="hover:text-white transition-colors flex items-center justify-between group">
              <span>Hospitality &amp; Cloud Kitchens</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
            </Link>
            <Link href="/about" className="hover:text-white transition-colors flex items-center justify-between group">
              <span>Farmer Empowerment</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
            </Link>
          </nav>
        </div>

        {/* Column 4: Distribution Hubs (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <p className="text-xs uppercase tracking-[0.18em] font-bold text-emerald-400">
            Global Hubs
          </p>
          <div className="space-y-3 text-xs text-emerald-100/75">
            <div className="space-y-0.5">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Bengaluru HQ
              </p>
              <p className="text-[11px] text-emerald-200/60 leading-tight">
                42 Industrial Agro Park, Whitefield, KA
              </p>
            </div>

            <div className="space-y-0.5">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Delhi-NCR Hub
              </p>
              <p className="text-[11px] text-emerald-200/60 leading-tight">
                Sector 18 Logistics Center, Gurugram, HR
              </p>
            </div>

            <div className="space-y-0.5">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                International
              </p>
              <p className="text-[11px] text-emerald-200/60 leading-tight">
                JAFZA One Dubai &amp; London EC2A UK
              </p>
            </div>
          </div>
        </div>

        {/* Column 5: Direct Support & Contact (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <p className="text-xs uppercase tracking-[0.18em] font-bold text-emerald-400">
            Direct Procurement
          </p>
          <div className="space-y-2.5 text-xs text-emerald-100/75">
            <a
              href="tel:+918004567890"
              className="flex items-center gap-2 text-white hover:text-emerald-300 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              +91 (800) 456-7890
            </a>

            <a
              href="mailto:info@viroeco.com"
              className="flex items-center gap-2 text-white hover:text-emerald-300 transition-colors font-medium truncate"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              info@viroeco.com
            </a>

          </div>
        </div>
      </Container>

      {/* 3. Security, Payment & Trust Bar */}
      <div className="border-t border-white/10 bg-[#1A2418] py-5 px-4 sm:px-6 lg:px-8">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-100/70">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fair Trade Certified Farming Network</span>
            </div>
            <span className="hidden sm:inline text-white/20">•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Razorpay Verified Merchant</span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-300/80">
            <span className="px-2 py-0.5 rounded-none bg-white/5 border border-white/10">UPI</span>
            <span className="px-2 py-0.5 rounded-none bg-white/5 border border-white/10">VISA</span>
            <span className="px-2 py-0.5 rounded-none bg-white/5 border border-white/10">Mastercard</span>
            <span className="px-2 py-0.5 rounded-none bg-white/5 border border-white/10">RuPay</span>
            <span className="px-2 py-0.5 rounded-none bg-white/5 border border-white/10">Net 30 Invoicing</span>
          </div>
        </Container>
      </div>

      {/* 4. Bottom Legal, Status & Back-to-Top Bar */}
      <div className="border-t border-white/10 py-6 text-xs text-emerald-200/60 bg-[#06150E]">
        <Container className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} ViroEco Global Inc. All rights reserved.</p>
            <div className="hidden sm:flex items-center gap-2 text-emerald-400 text-[11px]">
              <span className="w-2 h-2 rounded-none bg-emerald-400 animate-pulse" />
              <span>Circular Supply Chain Operational</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Supply
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/faq" className="hover:text-white transition-colors">
              Compliance &amp; FAQ
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Support Desk
            </Link>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center justify-center ml-2 p-1.5 rounded-none bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
              title="Back to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </Container>
      </div>
    </footer>
  );
}
