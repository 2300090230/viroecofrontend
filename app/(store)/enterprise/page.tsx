import Link from "next/link";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { IndustryScale } from "@/components/industry-scale";
import { ProcurementTestimonials } from "@/components/procurement-testimonials";
import { CertificationsBar } from "@/components/certifications-bar";
import { CtaBanner } from "@/components/cta-banner";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Layers,
  Wrench,
  CheckCircle2,
  Building2,
  FileCheck,
} from "lucide-react";

export const metadata = {
  title: "Enterprise Solutions & High-Volume B2B Supply | ViroEco",
  description:
    "Turnkey sustainable foodservice solutions for hotels, airlines, cloud kitchens, and corporate campuses. Custom tooling, debossing, and guaranteed volume SLAs.",
};

const SLA_PILLARS = [
  {
    icon: Truck,
    title: "Zero Stock-Out SLA Guarantee",
    description:
      "Buffer inventory maintained across our Bengaluru, Delhi-NCR, UAE, and European logistics hubs with guaranteed replenishment within 24-48 hours.",
  },
  {
    icon: Wrench,
    title: "Bespoke Custom Tooling & Molds",
    description:
      "From custom compartment meal trays to laser brand debossing and custom outer carton dimensions, our in-house tooling engineers deliver molds in 14 days.",
  },
  {
    icon: FileCheck,
    title: "Audit-Ready ESG Compliance Packs",
    description:
      "Receive automated quarterly carbon certificates, certified chain-of-custody documentation, and lab-tested non-detectable PFAS certificates for audits.",
  },
  {
    icon: Layers,
    title: "Tiered Volume Discounts",
    description:
      "Transparent wholesale tiered pricing designed for multi-location operators, hotel chains, and industrial contract caterers.",
  },
];

export default function EnterpriseSolutionsPage() {
  return (
    <div className="pt-8 pb-20 bg-[#FAF9F5] min-h-screen text-[#17231C]">
      {/* Enterprise Hero */}
      <section className="border-b border-[#DFD5C6] bg-white py-14 lg:py-16">
        <Container>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#EDF2EB] text-[#50644C] text-xs font-bold uppercase tracking-wider">
              B2B Enterprise &amp; Institutional Supply
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#50644C] leading-tight">
              Enterprise Foodservice Solutions Engineered for Scale
            </h1>
            <p className="text-base sm:text-lg text-[#5A6659] leading-relaxed">
              Serving Fortune 500 cafeterias, luxury resort chains, airline catering networks, and nationwide cloud kitchens with zero-failure, 100% circular tableware.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild className="bg-[#50644C] hover:bg-[#243021] text-white rounded-none px-6 cursor-pointer">
                <Link href="/contact">
                  Request Enterprise Sample Kit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-[#50644C]/20 text-[#50644C] hover:bg-[#EDF2EB] rounded-none px-6 cursor-pointer">
                <Link href="/products">
                  Browse Catalog
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 8 Industry Segments Component */}
      <IndustryScale />

      {/* Enterprise SLA Guarantees */}
      <Container className="py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#50644C] font-bold inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Institutional Reliability
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#50644C]">
            Why Enterprise Procurement Teams Partner With ViroEco
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6659]">
            We solve the real challenges of sustainable transitions: consistency, volume availability, temperature resilience, and pricing predictability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SLA_PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-white border border-[#DFD5C6] rounded-none p-6 space-y-3 shadow-xs hover:border-[#50644C]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-none bg-[#EDF2EB] text-[#50644C] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#50644C]" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#50644C]">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#5A6659] leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>

      {/* Procurement Testimonials */}
      <ProcurementTestimonials />

      {/* Global Compliance Certifications */}
      <CertificationsBar />

      {/* Conversion Banner */}
      <CtaBanner />
    </div>
  );
}
