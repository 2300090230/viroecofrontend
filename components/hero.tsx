"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { QuoteDialog } from "@/components/quote-dialog";

export function Hero() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-20 bg-[#FAF9F5]">
        {/* Soft natural radial glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-20 h-[36rem] w-[36rem] rounded-none bg-[#50644C]/5 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-40 h-[28rem] w-[28rem] rounded-none bg-[#94A478]/8 blur-3xl"
        />

        <Container className="relative grid items-center gap-12 lg:grid-cols-12">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#EDF2EB] text-[#50644C] text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#50644C]" />
              100% Bamboo &amp; Rice Husk — Zero Fossil Plastic
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#50644C] leading-[1.1]">
              Beautiful{" "}
              <span className="italic font-normal text-[#94A478]">Eco Products</span> for a{" "}
              <strong className="font-bold text-[#50644C]">Greener Home</strong>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#5A6659] leading-relaxed max-w-xl">
              Drinkware, gardenware, tableware and storage crafted from bamboo and rice husk
              biocomposites. Carbon negative, microwave safe, and built to last for years — not days.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="bg-[#50644C] hover:bg-[#243021] text-white rounded-none px-6 sm:px-7 py-5 sm:py-6 text-sm font-semibold cursor-pointer shadow-md hover:shadow-lg transition-all justify-center"
              >
                <Link href="/products" className="flex items-center justify-center gap-2">
                  Shop the Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => setQuoteOpen(true)}
                className="border-[#50644C]/30 text-[#50644C] hover:bg-[#EDF2EB] rounded-none px-5 sm:px-6 py-5 sm:py-6 text-sm font-medium cursor-pointer transition-colors justify-center text-center"
              >
                Request Enterprise Quote
              </Button>
            </div>

            {/* Viroeco Key stats */}
            <div className="pt-5 sm:pt-6 grid grid-cols-3 gap-2 sm:gap-3 border-t border-[#DFD5C6]">
              <div className="space-y-0.5">
                <p className="font-display text-lg sm:text-2xl font-bold text-[#50644C]">1,000+</p>
                <p className="text-[10px] sm:text-xs text-[#5A6659] leading-tight">Tons CO₂ Reduced</p>
              </div>
              <div className="space-y-0.5 border-l border-[#DFD5C6] pl-2 sm:pl-3">
                <p className="font-display text-lg sm:text-2xl font-bold text-[#50644C]">350+</p>
                <p className="text-[10px] sm:text-xs text-[#5A6659] leading-tight">Tons Upcycled</p>
              </div>
              <div className="space-y-0.5 border-l border-[#DFD5C6] pl-2 sm:pl-3">
                <p className="font-display text-lg sm:text-2xl font-bold text-[#50644C]">400+</p>
                <p className="text-[10px] sm:text-xs text-[#5A6659] leading-tight">Tons Less Plastic</p>
              </div>
            </div>
          </div>

          {/* Right Hero Card Visual — Viroeco Mug Product Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-none overflow-hidden border border-[#DFD5C6] bg-white shadow-xl aspect-[4/3] sm:aspect-[16/11]">
              <Image
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80"
                alt="Viroeco Classic Mug — eco-friendly drinkware made from bamboo and rice husk biocomposite"
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              {/* Floating Top-Right Badge */}
              <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 bg-white/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-none border border-[#DFD5C6] shadow-sm flex items-center gap-1.5 sm:gap-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-none bg-emerald-500 animate-pulse" />
                <div className="text-left">
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#50644C]">Carbon Negative</p>
                  <p className="text-[10px] sm:text-[11px] text-[#5A6659] hidden sm:block">Bamboo &amp; Rice Husk Biocomposite</p>
                </div>
              </div>

              {/* Floating Bottom Badge */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-auto bg-[#50644C]/95 text-white backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-none shadow-lg flex items-center gap-2 sm:gap-2.5">
                <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-none bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-white text-[11px] sm:text-xs">500+ SKUs — 18+ Earth Colors</span>
                  <p className="text-[9px] sm:text-[10px] text-white/75">Drinkware · Gardenware · Tableware · Storage</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <QuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
    </>
  );
}
