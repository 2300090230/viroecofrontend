"use client";

import { useState } from "react";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { QuoteDialog } from "@/components/quote-dialog";

export function TopAnnouncementBar() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <div className="bg-[#243021] text-white/90 text-xs py-2 px-4 border-b border-white/10 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-white/10 text-[11px] font-medium text-emerald-300">
              B2B &amp; Enterprise Direct
            </span>
            <span className="hidden md:inline text-white/80">
              Custom Logo Embossing &amp; Volume Tier Pricing Available for Hospitality Chains
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-white/80">
            <a
              href="tel:+918004567890"
              className="hidden lg:flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              +91 (800) 456-7890
            </a>
            <a
              href="mailto:enterprise@viroeco.com"
              className="hidden sm:flex items-center gap-1 hover:text-white transition-colors"
            >
              <Mail className="w-3 h-3 text-emerald-400" />
              enterprise@viroeco.com
            </a>
            <button
              onClick={() => setQuoteOpen(true)}
              className="font-semibold text-emerald-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              Request Quote / Sample Kit <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <QuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
    </>
  );
}
