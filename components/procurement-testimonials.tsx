import { Container } from "@/components/container";
import { Star, CheckCircle2 } from "lucide-react";

const REVIEWS = [
  {
    quote:
      "Transitioning 12 luxury properties to Viro Eco was completely seamless. Zero guest complaints regarding durability or hot curry heat retention, and we eliminated 8.4 tons of single-use plastic in year one.",
    author: "Vikram Singhal",
    role: "Director of Hospitality Procurement",
    company: "Luxury Hotels & Resorts Group",
    verified: "Enterprise Buyer",
  },
  {
    quote:
      "The bagasse meal trays and birchwood cutlery are exceptionally rigid. Our cloud kitchen deliveries arrive crisp without soggy box deflection, and our ESG rating jumped 34% in our annual sustainability report.",
    author: "Ananya Sen",
    role: "Head of Supply Chain & Packaging",
    company: "Pan-India QSR & Cloud Kitchens",
    verified: "Enterprise Buyer",
  },
  {
    quote:
      "Viro Eco's inventory supply SLA and custom logo embossing have made them our exclusive circular dinnerware partner across 120+ corporate cafeteria sites and airport lounges.",
    author: "Marcus Lindqvist",
    role: "VP Sustainable Operations",
    company: "Global Aviation & Catering Alliance",
    verified: "Enterprise Buyer",
  },
];

export function ProcurementTestimonials() {
  return (
    <section className="py-20 bg-white border-b border-[#DFD5C6]">
      <Container>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[#50644C] font-bold inline-flex items-center gap-1.5">
            Verified Customer Reviews
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#50644C]">
            What Global Procurement Leaders Say
          </h2>
          <div className="flex items-center justify-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
            <span className="text-xs font-semibold text-[#17231C] ml-2">
              4.98 / 5.0 from 500+ Enterprise Audits
            </span>
          </div>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <div
              key={r.author}
              className="bg-[#FAF9F5] border border-[#DFD5C6] rounded-none p-7 flex flex-col justify-between space-y-6 shadow-xs hover:border-[#50644C]/30 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#17231C] leading-relaxed italic">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#DFD5C6] flex items-center justify-between">
                <div>
                  <h4 className="font-display text-sm font-bold text-[#50644C]">
                    {r.author}
                  </h4>
                  <p className="text-[11px] text-[#5A6659]">{r.role}</p>
                  <p className="text-[11px] font-medium text-[#17231C]">{r.company}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-[#EDF2EB] px-2 py-0.5 rounded-none shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  {r.verified}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
