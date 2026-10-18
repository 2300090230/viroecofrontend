import Link from "next/link";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { WhyChooseUs } from "@/components/why-choose-us";
import { MetricsPartners } from "@/components/metrics-partners";
import { CertificationsBar } from "@/components/certifications-bar";
import {
  ArrowRight,
  Leaf,
  HeartHandshake,
  Factory,
  Globe2,
  ShieldCheck,
  Target,
} from "lucide-react";

export const metadata = {
  title: "About Us & Why Choose ViroEco | Regenerative Bio-Materials",
  description:
    "Learn about ViroEco's mission to eliminate single-use petroleum plastics through agricultural waste biocomposites and ethical rural supply chains.",
};

const VALUES = [
  {
    icon: Leaf,
    title: "100% Plant-First Chemistry",
    description:
      "We believe true sustainability requires eliminating synthetic petroleum polymers entirely. Every item is molded purely from agricultural waste, bamboo fibers, and rice husks.",
  },
  {
    icon: HeartHandshake,
    title: "Direct Agrarian Livelihoods",
    description:
      "We partner directly with over 4,500 smallholder farming families across Southern and Western India, buying fallen areca sheaths and post-harvest crop residues at fair trade premiums.",
  },
  {
    icon: Factory,
    title: "Zero-Effluent Closed-Loop Plants",
    description:
      "Our automated manufacturing hubs utilize closed-loop filtration for wash water, zero toxic bleaching emissions, and 100% solar-assisted hydraulic thermal presses.",
  },
  {
    icon: Globe2,
    title: "International Supply Security",
    description:
      "With distribution centers in Bengaluru, Delhi-NCR, Dubai (JAFZA), and London, we ensure robust, uninterrupted supply chains for global enterprise clients.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-20 bg-cream min-h-screen text-ink">
      {/* Hero Header */}
      <section className="border-b border-line bg-gradient-to-r from-sand via-cream to-sage-wash py-14 lg:py-16">
        <Container>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sage-wash text-forest text-xs font-bold uppercase tracking-wider">
              Our Mission &amp; Purpose
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-forest leading-tight">
              Redefining Single-Use Through Agricultural Circularity
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Founded on the belief that everyday convenience should never come at the expense of our planet,
              ViroEco crafts durable, elegant tableware and home goods that regenerate the earth instead of polluting it.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild className="bg-forest hover:bg-forest-dark text-white rounded-md px-6 cursor-pointer">
                <Link href="/products">
                  Explore Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-forest/20 text-forest hover:bg-sage-wash rounded-md px-6 cursor-pointer">
                <Link href="/impact">
                  Read Impact Report
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Metrics Ticker */}
      <MetricsPartners />

      {/* Why Choose Us Feature Cards Grid */}
      <WhyChooseUs />

      {/* 4 Core Pillars of Values */}
      <Container className="py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-forest font-bold inline-flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            Core Values
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest">
            Our Foundational Commitments
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            How we maintain unmatched product quality while delivering authentic ecological and socio-economic impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="bg-white border border-line rounded-md p-8 space-y-3 shadow-xs hover:border-forest/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-md bg-sage-wash text-forest flex items-center justify-center">
                    <Icon className="w-5 h-5 text-forest" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-forest">
                    {v.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>

      {/* Certifications Bar */}
      <CertificationsBar />
    </div>
  );
}
