import { Container } from "@/components/container";
import { Sparkles, Building2, Utensils, Coffee, Music, Plane, ShoppingBag, Store, HeartPulse } from "lucide-react";

const INDUSTRIES = [
  {
    icon: Building2,
    title: "Luxury Hotels & Resorts",
    description:
      "Bespoke palm leaf banqueting plates, poolside drinkware, and in-room amenities replacing single-use plastic across 5-star properties.",
  },
  {
    icon: Utensils,
    title: "Food Delivery & Cloud Kitchens",
    description:
      "Aqueous-coated leak-resistant curry bowls, ramen bowls, and steam-vented burger boxes engineered for 45+ minute transit without soggy breakdown.",
  },
  {
    icon: Coffee,
    title: "Corporate Pantries & Cafeterias",
    description:
      "High-throughput enterprise cafeteria meal trays, compostable hot coffee cups, and packaged cutlery sets for thousands of daily meals.",
  },
  {
    icon: Music,
    title: "Stadiums & Large Festivals",
    description:
      "Rapid-dispense, shatterproof drink tumblers, snack trays, and waste-sorting compostable bins handling 50,000+ guest footfalls.",
  },
  {
    icon: Plane,
    title: "Railroads & Aviation Catering",
    description:
      "Ultra-compact, lightweight nestable meal boxes and sealed hygiene packs certified for airline galley heating ovens.",
  },
  {
    icon: ShoppingBag,
    title: "Retail & Organic Grocery",
    description:
      "High-end shelf-ready retail barcoded multipacks (10-packs, 25-packs) for eco-conscious supermarket chains and organic grocers.",
  },
  {
    icon: Store,
    title: "QSR & Fast-Casual Chains",
    description:
      "Standardized custom-molded fry boats, sandwich clamshells, and portion sauce pots with custom debossed brand logos.",
  },
  {
    icon: HeartPulse,
    title: "Hospitals & Healthcare",
    description:
      "Sterile single-patient compostable meal trays eliminating pathogen cross-contamination while cutting bio-hazard medical waste.",
  },
];

export function IndustryScale() {
  return (
    <section id="industries" className="py-20 bg-white border-b border-[#DFD5C6] scroll-mt-20">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#50644C] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Tailored Sector Solutions
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#50644C]">
              Engineered for High-Pressure Scale
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#5A6659] leading-relaxed">
            High-volume operations cannot afford supply disruptions or soggy failures. Our
            products are stress-tested for real-world commercial foodservice environments.
          </p>
        </div>

        {/* 8 Industry Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDUSTRIES.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.title}
                className="bg-[#FAF9F5] border border-[#DFD5C6] rounded-none p-6 space-y-3 hover:border-[#50644C]/40 hover:shadow-xs transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-none bg-white border border-[#DFD5C6] text-[#50644C] flex items-center justify-center shadow-2xs">
                  <Icon className="w-4.5 h-4.5 text-[#50644C]" />
                </div>
                <h3 className="font-display text-base font-semibold text-[#17231C]">
                  {ind.title}
                </h3>
                <p className="text-xs text-[#5A6659] leading-relaxed">
                  {ind.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
