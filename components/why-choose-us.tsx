import { Container } from "@/components/container";
import { ShieldCheck, Flame, RefreshCw, Truck, CheckCircle2 } from "lucide-react";

export function WhyChooseUs() {
  return (
    <section id="why-us" className="py-20 bg-cream scroll-mt-20">
      <Container>
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-forest font-bold">
            Circular Engineering &amp; Reliability
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-forest">
            Why Visionary Brands Choose Viro Eco
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Overcoming the fragile quality of early generation eco-packaging with aerospace-grade
            hot press molding and rigorous international food contact certifications.
          </p>
        </div>

        {/* Feature Cards Grid matching Stitch Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: 100% Compostable (7 Cols) */}
          <div className="col-span-1 md:col-span-7 bg-white border border-line rounded-md p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-sage-wash text-forest flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-forest">
                100% Home &amp; Industrial Compostable
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Leaves zero microplastics, synthetic residues, or forever chemicals. Fully breaks
                down in commercial and backyard compost heaps into rich, fertile soil conditioning.
              </p>
            </div>

            {/* Breakdown Timeline Bar */}
            <div className="p-3.5 sm:p-4 rounded-md bg-cream border border-line space-y-2">
              <div className="flex justify-between text-[10px] sm:text-xs font-semibold text-forest">
                <span>Day 0 (Disposal)</span>
                <span>Day 45 (Bio-degrade)</span>
                <span>Day 90 (Soil Nutrients)</span>
              </div>
              <div className="w-full bg-line h-2 sm:h-2.5 rounded-md overflow-hidden">
                <div className="bg-forest h-full rounded-md w-full" />
              </div>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                EN 13432 &amp; ASTM D6400 certified full biodegradation timeline.
              </p>
            </div>
          </div>

          {/* Card 2: Deep Forest Green Highlight Card (5 Cols) */}
          <div className="col-span-1 md:col-span-5 bg-forest-dark text-white rounded-md p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-white/10 text-emerald-300 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                Food Safe &amp; Chemical-Free
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Zero PFAS, zero bleach, zero heavy metals. Certified according to US FDA 21 CFR and
                EU Regulation (EC) No 1935/2004 for direct greasy and acidic food contact.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10 text-xs text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>US FDA 21 CFR 176.170 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>EU 10/2011 Migration Tested (0.00% Heavy Metals)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Extreme Temperature Resistance (4 Cols) */}
          <div className="col-span-1 md:col-span-4 bg-white border border-line rounded-md p-5 sm:p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-md bg-sage-wash text-forest flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-forest">
              Extreme Thermal Resistance
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Engineered to endure -20°C deep freeze to +140°C microwave &amp; baking reheat without
              softening, cracking, or warping.
            </p>
          </div>

          {/* Card 4: Zero-Effluent Methodology (4 Cols) */}
          <div className="col-span-1 md:col-span-4 bg-white border border-line rounded-md p-5 sm:p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-md bg-sage-wash text-forest flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-forest">
              Zero-Effluent Methodology
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              100% closed-loop wash water recycling. No chemical bleaching runoffs or toxic synthetic
              adhesives during hydraulic forming.
            </p>
          </div>

          {/* Card 5: Global Scale Logistics (4 Cols) */}
          <div className="col-span-1 md:col-span-4 bg-white border border-line rounded-md p-5 sm:p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-md bg-sage-wash text-forest flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-forest">
              Global Scale Logistics
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Guaranteed SLA supply chains with warehouse hubs in India, UAE, UK, and North America.
              Zero inventory runout risk.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
