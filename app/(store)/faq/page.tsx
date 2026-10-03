"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuoteDialog } from "@/components/quote-dialog";
import {
  Search,
  ChevronDown,
  HelpCircle,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const FAQ_CATEGORIES = [
  "All Questions",
  "Material & Compostability",
  "Food Safety & PFAS",
  "Wholesale & Custom Tooling",
  "Shipping & Logistics",
] as const;

const FAQ_ITEMS = [
  {
    category: "Material & Compostability",
    q: "What raw materials do you use in manufacturing ViroEco products?",
    a: "We exclusively utilize natural agricultural residues and rapidly renewable plant fibers — specifically naturally fallen areca palm sheaths, sugarcane bagasse pulp, bamboo fibers, and rice husks. There are zero synthetic petroleum binders, polypropylene linings, or forever chemicals used at any step.",
  },
  {
    category: "Material & Compostability",
    q: "What is the distinction between Home vs Industrial Compostability?",
    a: "Many 'compostable' plastics (PLA) only degrade in specialized industrial facilities with 60°C constant heat. ViroEco products are 100% plant fiber, meaning they break down naturally in standard backyard garden soil within 60 to 90 days as well as in municipal commercial composters, leaving zero toxic microplastics.",
  },
  {
    category: "Material & Compostability",
    q: "What is the verified shelf life of unused palm leaf and bagasse tableware?",
    a: "When stored in a dry, ventilated warehouse at room temperature in their original moisture-barrier cartons, our products have a verified shelf life of 24+ months with zero structural or aesthetic degradation.",
  },
  {
    category: "Food Safety & PFAS",
    q: "Which international food safety & PFAS tests do your materials pass?",
    a: "Every production batch is tested under US FDA 21 CFR 176.170, EU (EC) No 1935/2004, and certified Total Fluorine (PFAS) Free (< 10 ppm non-detectable). Full third-party Intertek and SGS laboratory test sheets are provided with every wholesale shipment.",
  },
  {
    category: "Food Safety & PFAS",
    q: "How do your products behave under boiling hot soup and heavy oil gravies?",
    a: "Unlike paper plates that turn soggy within minutes, our areca palm leaf and dense sugarcane bagasse ware endure boiling soups and hot oil up to 120°C–140°C for over 4 hours without softening, leaking, or altering food flavor.",
  },
  {
    category: "Food Safety & PFAS",
    q: "Are ViroEco products microwave, oven, and refrigerator safe?",
    a: "Yes. Our bamboo biocomposite and bagasse dinnerware are heat-resistant up to 140°C for microwave reheating (up to 3 minutes) and deep-freeze safe down to -20°C without brittleness or cracking.",
  },
  {
    category: "Wholesale & Custom Tooling",
    q: "What is your Minimum Order Quantity (MOQ) for wholesale and custom branding?",
    a: "Standard in-stock catalog products can be ordered in carton packs starting from just 100 to 500 units. For custom tooling, bespoke dimensions, or laser/heated logo debossing, our typical MOQ starts at 10,000 units with volume price tiers.",
  },
  {
    category: "Wholesale & Custom Tooling",
    q: "Can you create custom shapes or compartment layouts for our menu?",
    a: "Yes. Our internal tooling and mold design engineers develop rapid 3D prototypes in 5 business days and production-grade pneumatic molds within 14 days for proprietary takeout container shapes, airline tray sizes, or bento compartments.",
  },
  {
    category: "Shipping & Logistics",
    q: "How quickly are wholesale orders and sample kits dispatched?",
    a: "Standard enterprise sample kits are dispatched within 24 hours. Catalog in-stock wholesale orders ship from our domestic hubs (Bengaluru, Delhi-NCR) within 48 hours. International ocean consignments depart weekly from Nhava Sheva / Chennai ports.",
  },
  {
    category: "Shipping & Logistics",
    q: "Do you offer buffer stock SLA contracts for large restaurant chains?",
    a: "Yes. We provide scheduled recurring deliveries and maintain 30-day buffer inventory in regional warehouses for contract enterprise clients to guarantee zero stock-outs during seasonal surges.",
  },
];

export default function FaqPage() {
  const [selectedCat, setSelectedCat] = useState<string>("All Questions");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [quoteOpen, setQuoteOpen] = useState(false);

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCat === "All Questions" || item.category === selectedCat;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-8 pb-20 bg-[#FAF9F5] min-h-screen text-[#17231C]">
      {/* FAQ Hero */}
      <section className="border-b border-[#DFD5C6] bg-white py-14 lg:py-16">
        <Container>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#EDF2EB] text-[#50644C] text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
              Help &amp; Knowledge Base
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#50644C] leading-tight">
              Frequently Asked Questions &amp; Technical Compliance
            </h1>
            <p className="text-base sm:text-lg text-[#5A6659] leading-relaxed">
              Find detailed answers on our material science, food safety lab tests, MOQ pricing tiers, custom mold timelines, and global logistics.
            </p>

            {/* Search Box */}
            <div className="pt-2 relative max-w-xl">
              <Search className="w-4 h-4 text-[#5A6659] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search questions (e.g. MOQ, microwave, PFAS, shipping)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#FAF9F5] border-[#DFD5C6] rounded-none text-sm py-5"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Category Tabs */}
      <section className="py-6 border-b border-[#DFD5C6] bg-[#FAF9F5]/70 sticky top-18 z-30 backdrop-blur-md">
        <Container>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`shrink-0 px-4 py-2 rounded-none text-xs font-semibold cursor-pointer transition-all ${
                  selectedCat === cat
                    ? "bg-[#50644C] text-white shadow-xs"
                    : "bg-white border border-[#DFD5C6] text-[#5A6659] hover:text-[#50644C] hover:border-[#50644C]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Accordion Questions List */}
      <Container className="py-14 max-w-4xl space-y-6">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#DFD5C6] rounded-none p-8 space-y-3">
            <HelpCircle className="w-10 h-10 text-[#5A6659] mx-auto" />
            <h3 className="font-display text-lg font-bold text-[#50644C]">
              No questions found matching &ldquo;{searchQuery}&rdquo;
            </h3>
            <p className="text-xs text-[#5A6659]">
              Try searching with another keyword, or contact our support team directly.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCat("All Questions");
              }}
              variant="outline"
              className="mt-2 text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => {
              const isOpen = openIdx === i;
              return (
                <div
                  key={faq.q}
                  className="bg-white border border-[#DFD5C6] rounded-none overflow-hidden shadow-xs hover:border-[#50644C]/40 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF9F5]/70 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-[#EDF2EB] px-2.5 py-0.5 rounded-none">
                        {faq.category}
                      </span>
                      <h3 className="font-display text-base sm:text-lg font-semibold text-[#17231C]">
                        {faq.q}
                      </h3>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-none bg-[#EDF2EB] text-[#50644C] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-[#5A6659] leading-relaxed border-t border-[#DFD5C6]/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still Have Questions Box */}
        <div className="bg-[#243021] text-white rounded-none p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md mt-10">
          <div className="space-y-2">
            <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              Need Specific Lab Documentation?
            </span>
            <h3 className="font-display text-2xl font-bold text-white">
              Speak Directly with Our Technical Sourcing Team
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl">
              Our materials scientists and supply chain coordinators provide immediate compliance sheets, MSDS documentation, and custom volume quotes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button
              onClick={() => setQuoteOpen(true)}
              className="bg-emerald-400 hover:bg-emerald-300 text-[#243021] font-bold text-xs px-6 py-3.5 rounded-none cursor-pointer transition-colors"
            >
              Request Sample Kit
            </Button>
            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-none text-xs">
              <Link href="/contact">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </Container>

      <QuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
    </div>
  );
}
