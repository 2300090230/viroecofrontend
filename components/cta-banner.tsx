"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Box } from "lucide-react";
import { QuoteDialog } from "@/components/quote-dialog";

export function CtaBanner() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <section className="py-16 bg-[#FAF9F5]">
        <Container>
          <div className="bg-[#243021] text-white rounded-none p-6 sm:p-12 lg:p-14 shadow-xl overflow-hidden relative">
            {/* Subtle background glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -bottom-20 h-[30rem] w-[30rem] rounded-none bg-emerald-500/10 blur-3xl"
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-white/10 text-emerald-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Enterprise Full-Volume Supply &amp; Custom Tooling
                </div>

                <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                  Transition Your Enterprise to Zero-Plastic Packaging Today
                </h2>

                <p className="text-xs sm:text-base text-white/80 leading-relaxed max-w-xl">
                  Eliminate waste, elevate dining presentation, and meet corporate ESG targets with
                  certified circular tableware. Request custom brand debossing or a physical sample kit.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="bg-emerald-400 hover:bg-emerald-300 text-[#243021] rounded-none px-6 sm:px-7 py-5 sm:py-6 text-sm font-bold cursor-pointer shadow-md transition-all justify-center"
                  >
                    <Link href="/products" className="flex items-center justify-center gap-2">
                      Browse Entire Catalog
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setQuoteOpen(true)}
                    className="border-white/30 text-white hover:bg-white/10 rounded-none px-5 sm:px-6 py-5 sm:py-6 text-sm font-semibold cursor-pointer transition-colors justify-center text-center"
                  >
                    <Box className="w-4 h-4 mr-2 text-emerald-300" />
                    Request B2B Sample Kit
                  </Button>
                </div>
              </div>

              {/* Right Image Preview Box */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-none overflow-hidden border border-white/15 shadow-2xl aspect-[4/3] bg-white/5">
                  <Image
                    src="https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80"
                    alt="Viro Eco custom enterprise packaging sample box"
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium px-3 py-1 rounded-none">
                    Sample Kits Dispatched in 24h
                  </div>
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
