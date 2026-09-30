import { Hero } from "@/components/hero";
import { MetricsPartners } from "@/components/metrics-partners";
import { CategoryShowcase } from "@/components/category-showcase";
import { EnterpriseInventory } from "@/components/enterprise-inventory";
import { WhyChooseUs } from "@/components/why-choose-us";
import { CircularProcess } from "@/components/circular-process";
import { SavingsCalculator } from "@/components/savings-calculator";
import { IndustryScale } from "@/components/industry-scale";
import { CertificationsBar } from "@/components/certifications-bar";
import { ProcurementTestimonials } from "@/components/procurement-testimonials";
import { FaqSection } from "@/components/faq-section";
import { CtaBanner } from "@/components/cta-banner";
import { getAllProducts } from "@/lib/endpoints";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: Product[] = [];
  try {
    const fetched = await getAllProducts();
    if (fetched && Array.isArray(fetched)) {
      products = fetched;
    }
  } catch {
    products = [];
  }

  return (
    <>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Metrics & Enterprise Partners Ticker */}
      <MetricsPartners />

      {/* 3. High-Craft Ecological Categories */}
      <CategoryShowcase />

      {/* 4. Enterprise Inventory Highlights (Dynamic Real-Time Products) */}
      <EnterpriseInventory products={products} />

      {/* 5. Why Visionary Brands Choose Viro Eco */}
      <WhyChooseUs />

      {/* 6. Transparent Circular Supply Chain */}
      <CircularProcess />

      {/* 7. Interactive Annual Circular Savings Calculator */}
      <SavingsCalculator />

      {/* 8. Engineered for High-Pressure Scale (Industry Segments) */}
      <IndustryScale />

      {/* 9. Certifications & Global Compliance Badges */}
      <CertificationsBar />

      {/* 10. Procurement Leaders Testimonials */}
      <ProcurementTestimonials />

      {/* 11. Frequently Addressed Inquiries */}
      <FaqSection />

      {/* 12. Bottom Conversion CTA Banner */}
      <CtaBanner />
    </>
  );
}
