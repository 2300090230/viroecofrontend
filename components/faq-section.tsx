"use client";

import { useState } from "react";
import { Container } from "@/components/container";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What is your Minimum Order Quantity (MOQ) for custom branding & wholesale?",
    a: "Standard in-stock catalog products can be ordered in carton packs starting from just 100 to 500 units. For custom tooling, bespoke dimensions, or laser/heated logo debossing, our typical MOQ starts at 10,000 units with volume price tiers.",
  },
  {
    q: "How do your products behave under boiling hot soup and heavy oil gravies?",
    a: "Unlike paper plates that turn soggy within minutes, our areca palm leaf and dense sugarcane bagasse ware endure boiling soups and hot oil up to 120°C–140°C for over 4 hours without softening, leaking, or altering food flavor.",
  },
  {
    q: "What is the actual distinction between Home vs Industrial Compostability?",
    a: "Many 'compostable' plastics (PLA) only degrade in specialized industrial facilities with 60°C constant heat. Viro Eco products are 100% plant fiber, meaning they break down naturally in standard backyard garden soil within 60 to 90 days as well as in municipal commercial composters.",
  },
  {
    q: "What is the shelf life of unused palm leaf and bagasse dinnerware in storage?",
    a: "When stored in a dry, ventilated warehouse at room temperature in their original moisture-barrier cartons, our products have a verified shelf life of 24+ months with zero structural or aesthetic degradation.",
  },
  {
    q: "Which international food safety & PFAS tests do your materials pass?",
    a: "Every batch is tested under US FDA 21 CFR 176.170, EU (EC) No 1935/2004, and certified Total Fluorine (PFAS) Free (< 10 ppm non-detectable). Full third-party Intertek and SGS laboratory test sheets are provided with every wholesale shipment.",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-[#FAF9F5] border-b border-[#DFD5C6] scroll-mt-20">
      <Container>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[#50644C] font-bold inline-flex items-center gap-1.5">
            Technical &amp; Procurement FAQ
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#50644C]">
            Frequently Addressed Inquiries
          </h2>
          <p className="text-sm text-[#5A6659] leading-relaxed">
            Everything you need to know about material compliance, custom tooling, and supply chain SLAs.
          </p>
        </div>

        {/* Accordion list */}
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={faq.q}
                className="bg-white border border-[#DFD5C6] rounded-none overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF9F5]/80 transition-colors"
                >
                  <span className="font-display text-base sm:text-lg font-semibold text-[#17231C]">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-none bg-[#EDF2EB] text-[#50644C] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-[#5A6659] leading-relaxed border-t border-[#DFD5C6]/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
