"use client";

import { useState } from "react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Trash2, CloudRain, ShieldCheck, Coins, FileText } from "lucide-react";
import { QuoteDialog } from "@/components/quote-dialog";
import { toast } from "sonner";

export function SavingsCalculator() {
  const [monthlyUnits, setMonthlyUnits] = useState(100000);
  const [quoteOpen, setQuoteOpen] = useState(false);

  // Dynamic calculations based on unit volume
  const annualUnits = monthlyUnits * 12;
  const plasticSavedKg = Math.round((annualUnits * 0.0118));
  const co2OffsetKg = Math.round((annualUnits * 0.007));
  const landfillSavedM3 = Math.round((annualUnits * 0.019));
  const farmerIncomeInr = Math.round((annualUnits * 0.0375));

  const handleDownloadReport = () => {
    toast.success("ESG Impact Simulation Report Generated", {
      description: `Annual savings summary for ${(monthlyUnits).toLocaleString("en-IN")} units/mo saved to your procurement dashboard.`,
    });
  };

  return (
    <>
      <section id="calculator" className="py-20 bg-cream scroll-mt-20">
        <Container>
          <div className="bg-white border border-line rounded-md p-5 sm:p-10 lg:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Interactive Slider */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-sage-wash text-forest text-xs font-semibold">
                  Enterprise Impact &amp; ESG Simulator
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-forest">
                    Estimate Your Annual Circular Savings
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Adjust your expected monthly takeaway packaging or dining ware volume to calculate
                    direct landfill diversion and Scope 3 greenhouse gas reductions.
                  </p>
                </div>

                {/* Slider */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap justify-between items-center gap-1 text-xs font-semibold">
                    <span className="text-muted-foreground">Monthly Packaging Volume:</span>
                    <span className="text-xs sm:text-sm font-bold text-forest bg-sage-wash px-2.5 sm:px-3 py-1 rounded-md">
                      {monthlyUnits.toLocaleString("en-IN")} units / month
                    </span>
                  </div>

                  <input
                    type="range"
                    min="5000"
                    max="500000"
                    step="5000"
                    value={monthlyUnits}
                    onChange={(e) => setMonthlyUnits(Number(e.target.value))}
                    className="w-full h-2.5 bg-line rounded-md appearance-none cursor-pointer accent-forest"
                  />

                  <div className="flex justify-between text-[10px] sm:text-[11px] text-muted-foreground">
                    <span>5,000 / mo</span>
                    <span>100,000 / mo</span>
                    <span>500,000+ / mo</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2">
                  <Button
                    onClick={handleDownloadReport}
                    variant="outline"
                    className="border-forest/20 text-forest hover:bg-sage-wash text-xs font-semibold rounded-md cursor-pointer justify-center"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                    Download ESG Report PDF
                  </Button>
                  <Button
                    onClick={() => setQuoteOpen(true)}
                    className="bg-forest hover:bg-forest-dark text-white text-xs font-semibold rounded-md cursor-pointer justify-center"
                  >
                    Get Matched Wholesale Tier
                  </Button>
                </div>
              </div>

              {/* Right Column: 4 Real-time Metric Cards */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Metric 1 */}
                <div className="bg-cream border border-line rounded-md p-6 space-y-2 hover:border-forest/30 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-white text-forest flex items-center justify-center shadow-xs">
                    <Trash2 className="w-4 h-4 text-emerald-700" />
                  </div>
                  <p className="font-display text-3xl font-bold text-forest">
                    {plasticSavedKg.toLocaleString("en-IN")} <span className="text-base font-normal">kg</span>
                  </p>
                  <p className="text-xs font-semibold text-ink">Plastic Diverted</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Petroleum single-use polymers permanently removed from waterways.
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="bg-cream border border-line rounded-md p-6 space-y-2 hover:border-forest/30 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-white text-forest flex items-center justify-center shadow-xs">
                    <CloudRain className="w-4 h-4 text-emerald-700" />
                  </div>
                  <p className="font-display text-3xl font-bold text-forest">
                    {co2OffsetKg.toLocaleString("en-IN")} <span className="text-base font-normal">kg CO₂e</span>
                  </p>
                  <p className="text-xs font-semibold text-ink">Carbon Offset</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Avoided virgin fossil extraction and low-temp incineration emissions.
                  </p>
                </div>

                {/* Metric 3 */}
                <div className="bg-cream border border-line rounded-md p-6 space-y-2 hover:border-forest/30 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-white text-forest flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  </div>
                  <p className="font-display text-3xl font-bold text-forest">
                    {landfillSavedM3.toLocaleString("en-IN")} <span className="text-base font-normal">m³</span>
                  </p>
                  <p className="text-xs font-semibold text-ink">Landfill Volume Saved</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Reduced municipal solid waste volume by rapid on-site composting.
                  </p>
                </div>

                {/* Metric 4 */}
                <div className="bg-cream border border-line rounded-md p-6 space-y-2 hover:border-forest/30 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-white text-forest flex items-center justify-center shadow-xs">
                    <Coins className="w-4 h-4 text-emerald-700" />
                  </div>
                  <p className="font-display text-3xl font-bold text-forest">
                    ₹{farmerIncomeInr.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs font-semibold text-ink">Agrarian Income Generated</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Direct fair-wage supplemental revenue paid to rural farmer cooperatives.
                  </p>
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
