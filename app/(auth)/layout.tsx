import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Award, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row">
      {/* Left Brand Showcase Panel (Visible on lg screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-forest-dark text-white p-12 flex-col justify-between overflow-hidden">
        {/* Soft background glow accents */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-md bg-forest/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-32 h-[30rem] w-[30rem] rounded-md bg-camel/15 blur-3xl"
        />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Logo variant="light" size="lg" imageClassName="h-10 w-auto" />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 text-emerald-200 border border-white/15 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-camel" />
            Official Portal
          </div>
        </div>

        {/* Center Spotlight */}
        <div className="relative z-10 my-auto py-8 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-forest/40 border border-sage/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            100% Bamboo &amp; Rice Husk Biocomposites
          </div>

          <h2 className="font-display text-3xl xl:text-4xl text-white font-semibold leading-tight">
            Sustainable living engineered for modern homes and conscious brands.
          </h2>

          <p className="text-sm text-emerald-100/80 leading-relaxed">
            Access your unified commerce account to manage orders, explore the 500+ item catalog, track carbon offset metrics, and request bulk commercial pricing.
          </p>

          {/* Key Trust Highlights */}
          <div className="space-y-3 pt-2">
            {[
              "1,000+ Tons CO₂ Reduced via biogenic carbon locking",
              "Zero Fossil Plastics — Certified 100% toxin & PFAS free",
              "Dishwasher & Microwave Safe for daily high-durability use",
              "Direct manufacturer enterprise wholesale pricing & tiers",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-camel shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Certifications & Footer */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/70">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-camel" /> US FDA &amp; TUV Certified
            </span>
            <span>·</span>
            <span>ISO 9001:2015</span>
          </div>
          <span>© {new Date().getFullYear()} Viroeco Eco Tech</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-line">
            <Logo size="md" imageClassName="h-9 w-auto" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Official Portal</span>
          </div>

          {/* Main Card Container */}
          <div className="bg-white border border-line rounded-md p-8 sm:p-10 shadow-xs hover:shadow-md transition-shadow">
            {children}
          </div>

          {/* Global Trust Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>
              By continuing, you agree to Viroeco&apos;s{" "}
              <Link href="/terms" className="underline hover:text-forest">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-forest">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
