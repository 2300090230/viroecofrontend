import Link from "next/link";
import { Container } from "@/components/container";
import { SavingsCalculator } from "@/components/savings-calculator";
import { CertificationsBar } from "@/components/certifications-bar";
import {
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
  Building2,
} from "lucide-react";

export const metadata = {
  title: "Circular Savings & ESG Calculator | ViroEco",
  description:
    "Calculate your enterprise plastic diversion, carbon footprint reduction, and landfill savings by switching to ViroEco sustainable packaging.",
};

const METHODOLOGIES = [
  {
    title: "1. Plastic Substitution Index (PSI)",
    description:
      "Calculates the net kilograms of virgin fossil polymer (Polypropylene, Polystyrene, PET) eliminated per unit based on standard ASTM D5988 weight baselines.",
  },
  {
    title: "2. GHG Protocol Scope 3 Offset",
    description:
      "Measures avoided upstream oil cracking emissions and downstream low-temperature incineration emissions, verified at -0.007 kg CO₂e avoided per unit.",
  },
  {
    title: "3. Landfill Volume Diverted",
    description:
      "Based on cubic meter density of compressed solid waste diverted directly into agricultural compost heaps, freeing municipal landfill capacity.",
  },
  {
    title: "4. Agrarian Value Redistribution",
    description:
      "Measures direct financial disbursements paid directly to smallholder farming cooperatives for collecting fallen areca sheaths and sugarcane bagasse.",
  },
];

export default function CalculatorPage() {
  return (
    <div className="pb-20 bg-cream min-h-screen text-ink">
      {/* Hero Header */}
      <section className="border-b border-line bg-gradient-to-r from-sand via-cream to-sage-wash py-14 lg:py-16">
        <Container>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sage-wash text-forest text-xs font-bold uppercase tracking-wider">
              ESG &amp; Carbon Accounting Tool
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-forest leading-tight">
              Annual Circular Savings &amp; ESG Simulator
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Model your annual sustainability metrics, plastic reduction tonnage, and Scope 3 emissions
              reductions before procuring. Trusted by enterprise sustainability officers and procurement directors worldwide.
            </p>
          </div>
        </Container>
      </section>

      {/* Embedded Dynamic Calculator Component */}
      <SavingsCalculator />

      {/* Methodology Section */}
      <Container className="py-14 space-y-8">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-forest font-bold flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Audit Standards
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest">
            Simulation Methodologies &amp; Scientific Baselines
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Our carbon accounting formulas adhere to ISO 14040/14044 Life Cycle Assessment guidelines and the Greenhouse Gas Protocol Corporate Value Chain (Scope 3) Standard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {METHODOLOGIES.map((m) => (
            <div
              key={m.title}
              className="bg-white border border-line rounded-md p-6 space-y-2 hover:border-forest/30 transition-colors"
            >
              <h3 className="font-display text-lg font-bold text-forest">
                {m.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>

        {/* Enterprise Callout */}
        <div className="bg-forest-dark text-white rounded-md p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-4 h-4" /> Customized Auditing for Enterprises
            </div>
            <h3 className="font-display text-2xl font-bold text-white">
              Need a formal ESG compliance audit for your annual report?
            </h3>
            <p className="text-xs sm:text-sm text-white/80">
              Our sustainability analysts generate third-party verified carbon offset and plastic elimination certificates for corporate filings.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              href="/enterprise"
              className="bg-emerald-400 hover:bg-emerald-300 text-forest-dark font-bold text-xs px-6 py-3.5 rounded-md inline-flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              Enterprise Solutions
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Container>

      <CertificationsBar />
    </div>
  );
}
