import Link from "next/link";
import { Container } from "@/components/container";
import { LegalToc, ScrollToButton } from "@/components/legal-toc";
import {
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Scale,
} from "lucide-react";

export const metadata = {
  title: "Official Terms of Service | ViroEco Global",
  description:
    "Official Terms of Service and Commercial Conditions of Sale governing purchases, wholesale procurement, custom tooling, and platform usage with ViroEco Global Inc.",
};

const SECTIONS = [
  { id: "entity-acceptance", title: "1. Corporate Entity & Acceptance of Terms" },
  { id: "eligibility-accounts", title: "2. Account Registration & Commercial Eligibility" },
  { id: "product-specs", title: "3. Material Specifications, Natural Tolerances & Standards" },
  { id: "certifications-safety", title: "4. Food Contact Safety & PFAS-Free Certifications" },
  { id: "orders-quotations", title: "5. Orders, Wholesale Quotations & Custom Tooling" },
  { id: "pricing-payments", title: "6. Pricing, Taxes, Invoicing & Payment Terms" },
  { id: "shipping-logistics", title: "7. Shipping, International Freight & Risk of Loss" },
  { id: "inspection-returns", title: "8. Quality Inspection, Claims, Returns & Refunds" },
  { id: "intellectual-property", title: "9. Intellectual Property & Proprietary Molds" },
  { id: "environmental-claims", title: "10. Environmental Impact & ESG Assertions" },
  { id: "liability-disclaimers", title: "11. Warranties, Disclaimers & Limitation of Liability" },
  { id: "force-majeure", title: "12. Force Majeure & Agricultural Feedstock Events" },
  { id: "governing-law", title: "13. Governing Law & Dispute Resolution" },
  { id: "updates-contact", title: "14. Amendments, Severability & Legal Notices" },
];

export default function TermsOfServicePage() {
  return (
    <div className="pt-24 pb-20 bg-[#FAF9F5] min-h-screen text-[#17231C]">
      {/* Hero Header */}
      <section className="border-b border-[#DFD5C6] bg-white py-14 lg:py-16">
        <Container>
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-semibold bg-[#EDF2EB] text-[#50644C] border border-[#50644C]/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Official Corporate Policy
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-medium bg-[#FAF9F5] text-[#5A6659] border border-[#DFD5C6]">
                <Calendar className="w-3.5 h-3.5 text-[#5A6659]" />
                Version 2.4 — Effective January 1, 2026
              </span>
              <span className="text-xs text-[#5A6659]">
                Last Revised: September 2026
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#50644C] leading-tight">
              Terms of Service &amp; Commercial Conditions
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#5A6659] leading-relaxed max-w-3xl">
              These official Terms of Service constitute a legally binding agreement between you
              (whether as an individual buyer, institutional purchaser, or enterprise procurement entity)
              and <strong>ViroEco Global Inc.</strong> governing your access to our commerce platform,
              wholesale services, bespoke tooling, and circular bio-packaging deliveries.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 pt-2">
              <Link
                href="/privacy"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#50644C] hover:underline"
              >
                View Privacy Policy <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <ScrollToButton
                targetId="updates-contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6659] hover:text-[#50644C] transition-colors cursor-pointer"
              >
                Legal Department Inquiries <ChevronRight className="w-3.5 h-3.5" />
              </ScrollToButton>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Layout */}
      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sticky Table of Contents (Desktop 4 Cols) */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <LegalToc title="Table of Contents" sections={SECTIONS} />

              {/* Quick Legal Support Box */}
              <div className="bg-[#50644C] text-white rounded-none p-6 space-y-3">
                <p className="text-xs uppercase tracking-widest text-emerald-300 font-semibold">
                  Corporate Counsel
                </p>
                <h4 className="font-display text-base font-semibold">
                  Need a Master Services Agreement (MSA)?
                </h4>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  For enterprise volume contracts exceeding 100,000 units/month, custom tooling SLA guarantees, or EDI procurement integrations, contact our legal counsel.
                </p>
                <div className="pt-2">
                  <a
                    href="mailto:info@viroeco.com"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 rounded-none transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    info@viroeco.com
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Legal Clauses (8 Cols) */}
          <main className="lg:col-span-8 space-y-12">
            {/* Executive Highlights Callout */}
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-none p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#50644C] font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Key Commercial Takeaways for Buyers
              </div>
              <ul className="text-xs text-[#2A4434] space-y-1.5 leading-relaxed list-disc list-inside">
                <li>
                  <strong>100% Certified Bio-Origin:</strong> All dinnerware and packaging are manufactured from agricultural residues without synthetic binder polymers or intentionally added fluorochemicals (PFAS).
                </li>
                <li>
                  <strong>Wholesale &amp; Custom Tooling:</strong> Custom molds undergo engineering sign-off with dedicated pre-production sample prototypes.
                </li>
                <li>
                  <strong>7-Day Inspection Window:</strong> Enterprise freight shipments must be formally inspected within 7 business days of bill-of-lading delivery for transit damage or variance claims.
                </li>
                <li>
                  <strong>Transparent Compliance:</strong> Batch-specific FDA 21 CFR 176.170, EU 1935/2004, and SGS compostability certificates are furnished on demand.
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <section id="entity-acceptance" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                1. Corporate Entity &amp; Acceptance of Terms
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  This website, application, procurement portal, and digital commerce interface are owned and operated by{" "}
                  <strong>ViroEco Global Inc.</strong> (together with its subsidiaries, affiliates, and manufacturing arms, herein referenced as &ldquo;<strong>ViroEco</strong>&rdquo;, &ldquo;<strong>we</strong>&rdquo;, &ldquo;<strong>us</strong>&rdquo;, or &ldquo;<strong>our</strong>&rdquo;), registered at 42 Industrial Agro Park, Whitefield, Bengaluru, Karnataka 560066, India, with international supply hubs in Dubai JAFZA and London, United Kingdom.
                </p>
                <p>
                  By creating an account, browsing our catalog, placing a wholesale or retail order, requesting custom mold quotes, or authorizing electronic payment, you explicitly acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service, our{" "}
                  <Link href="/privacy" className="text-[#50644C] underline font-medium">
                    Privacy Policy
                  </Link>
                  , and all referenced operating guidelines. If you do not accept these terms in their entirety, you must immediately discontinue use of the platform and refrain from placing transactions.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="eligibility-accounts" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                2. Account Registration &amp; Commercial Eligibility
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  <strong>Eligibility:</strong> You must be at least 18 years of age and possess full legal capacity to enter into binding contracts. If you are registering an account or executing purchase orders on behalf of a corporation, hospitality group, institution, or catering company, you warrant that you possess valid statutory or corporate authority to bind that entity to these Terms.
                </p>
                <p>
                  <strong>Account Security:</strong> You are solely responsible for maintaining the confidentiality of your authentication credentials (including email verification, OAuth access, and password data). Any activity conducted under your authenticated session shall be deemed authorized by you. In the event of unauthorized access or compromised security, you must notify ViroEco Security immediately at <code className="bg-[#FAF9F5] px-1.5 py-0.5 rounded-none text-[#50644C] border border-[#DFD5C6]">info@viroeco.com</code>.
                </p>
                <p>
                  <strong>Corporate Tax &amp; GST Verification:</strong> Enterprise purchasers requesting GST tax invoices, B2B wholesale pricing, or input tax credit allocations must supply authentic and active GSTIN / Corporate Tax Identification credentials during checkout or onboarding.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="product-specs" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                3. Material Specifications, Natural Tolerances &amp; Standards
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  ViroEco manufactures eco-friendly tableware, dinnerware, food containers, and cutlery primarily from natural agricultural residues, including:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li><strong>Fallen Areca Nut Palm Leaves:</strong> Heat-pressed, chemical-free washed foliage.</li>
                  <li><strong>Sugarcane Bagasse:</strong> Reclaimed sugarcane fiber pulp thermoformed under hydraulic pressure.</li>
                  <li><strong>FSC-Certified Birchwood:</strong> Kiln-dried, splinter-free precision-milled timber.</li>
                  <li><strong>Rice Husk &amp; Bamboo Biocomposites:</strong> Mineralized agricultural starch-bound polymer-free substrates.</li>
                </ul>
                <p>
                  <strong>Natural Material Inherent Tolerances:</strong> Because our goods are derived from raw botanical materials without synthetic bleaching or heavy uniform plastic dyes:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li>Minor variations in grain, striation, natural shade (cream to light tan/brown), and organic leaf texture are intrinsic characteristics and do not constitute defects.</li>
                  <li>Dimensional tolerances of ±1.5% to ±2.5% may occur across thermal pressing cycles and humidity conditions.</li>
                  <li>All products remain structurally rigid, moisture-resistant up to 140°C for hot gravies/soups, microwave-safe for up to 3 minutes, and freezer-safe to -20°C.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="certifications-safety" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                4. Food Contact Safety &amp; PFAS-Free Certifications
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  ViroEco adheres to the highest international statutory standards for direct food contact:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-[#FAF9F5] border border-[#DFD5C6] rounded-none">
                    <p className="font-semibold text-xs text-[#50644C]">US FDA 21 CFR 176.170</p>
                    <p className="text-xs text-[#5A6659] mt-0.5">Complies with aqueous and fatty food contact migration limits.</p>
                  </div>
                  <div className="p-3 bg-[#FAF9F5] border border-[#DFD5C6] rounded-none">
                    <p className="font-semibold text-xs text-[#50644C]">EU Regulation (EC) 1935/2004</p>
                    <p className="text-xs text-[#5A6659] mt-0.5">Certified non-transfer of chemical constituents into foodstuffs.</p>
                  </div>
                  <div className="p-3 bg-[#FAF9F5] border border-[#DFD5C6] rounded-none">
                    <p className="font-semibold text-xs text-[#50644C]">100% Total Fluorine (PFAS) Free</p>
                    <p className="text-xs text-[#5A6659] mt-0.5">Third-party lab tested below detectable threshold (&lt;10 ppm).</p>
                  </div>
                  <div className="p-3 bg-[#FAF9F5] border border-[#DFD5C6] rounded-none">
                    <p className="font-semibold text-xs text-[#50644C]">EN 13432 &amp; ASTM D6400</p>
                    <p className="text-xs text-[#5A6659] mt-0.5">Industrial &amp; backyard home compostable within 60-90 days.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="orders-quotations" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                5. Orders, Wholesale Quotations &amp; Custom Tooling
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  <strong>Order Acceptance:</strong> Placement of an order online or via purchase order (PO) represents an offer to purchase. An order is deemed formally accepted only upon transmission of an official Order Confirmation email and dispatch docket from ViroEco.
                </p>
                <p>
                  <strong>Minimum Order Quantities (MOQ):</strong> Standard catalog SKUs have specified pack/carton MOQ requirements displayed on each product page. Bulk enterprise pricing tiers apply automatically according to carton thresholds.
                </p>
                <p>
                  <strong>Bespoke Tooling &amp; Custom Logo Molds:</strong> For custom-designed clamshells, debossed branding, or custom compartments:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li>Engineering tooling deposits (50% upfront) are non-refundable once CNC aluminum mold cutting commences.</li>
                  <li>Buyer shall review and electronically approve the physical pre-production sample before mass thermoforming begins.</li>
                  <li>Customer represents and warrants that all logos, trademarks, and artwork submitted for custom embossing do not infringe any third-party intellectual property.</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section id="pricing-payments" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                6. Pricing, Taxes, Invoicing &amp; Payment Terms
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  <strong>Currency &amp; Taxes:</strong> All prices displayed for domestic orders in India are denominated in Indian Rupees (INR, ₹) and are inclusive or exclusive of GST as indicated at checkout. For international export quotes, prices are denominated in USD ($) or EUR (€) under agreed Incoterms.
                </p>
                <p>
                  <strong>Payment Gateways &amp; Security:</strong> Electronic payments are processed securely via certified PCI-DSS Level 1 payment partners (including Razorpay and authorized banking partners). ViroEco never stores raw payment card numbers or CVVs on our servers.
                </p>
                <p>
                  <strong>Enterprise Credit Terms (Net 30 / Net 60):</strong> Credit lines are extended exclusively to vetted institutional accounts following formal credit appraisal. Overdue invoices beyond stipulated credit terms shall incur a statutory finance charge of 1.5% per month (18% per annum) or the maximum permitted under applicable commercial law.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="shipping-logistics" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                7. Shipping, International Freight &amp; Risk of Loss
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  <strong>Fulfillment &amp; Hubs:</strong> Dispatches originate from our logistics facilities in Bengaluru (HQ), Delhi-NCR, or international distribution hubs (Dubai JAFZA, London).
                </p>
                <p>
                  <strong>Packaging &amp; Palletization:</strong> All goods are packaged in heavy-duty 5-ply corrugated export cartons with food-grade inner moisture-barrier liners to safeguard against atmospheric humidity during ocean/air freight.
                </p>
                <p>
                  <strong>Risk of Loss:</strong> For retail and standard domestic orders, risk of loss transfers upon confirmed carrier delivery. For B2B export consignments, risk transfer is governed by the agreed Incoterms 2020 specification (e.g., FOB Chennai/Nhava Sheva, CIF Destination Port, or DDP).
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="inspection-returns" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                8. Quality Inspection, Claims, Returns &amp; Refunds
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  <strong>7-Day Mandatory Inspection Period:</strong> Commercial buyers must inspect all delivered cartons and pallets within seven (7) business days of physical receipt.
                </p>
                <p>
                  <strong>Defect &amp; Transit Damage Claims:</strong> If any cartons exhibit water ingress, crushing, or manufacturing defects exceeding agreed AQL 1.5 standards:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 pl-2">
                  <li>Photograph and document the carton batch codes, tamper seals, and damaged units.</li>
                  <li>Transmit notice to <code className="bg-[#FAF9F5] px-1.5 py-0.5 rounded-none text-[#50644C] border border-[#DFD5C6]">info@viroeco.com</code> referencing your Order ID / PO number within the 7-day window.</li>
                  <li>Upon verification, ViroEco will issue either an immediate replacement shipment or a corresponding credit note/refund within 5 to 7 business days.</li>
                </ol>
                <p>
                  <strong>Hygienic Return Limitations:</strong> Due to strict food safety protocols, opened packaging sleeves or consumer-used items cannot be returned for restock unless a validated manufacturing defect is proven.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="intellectual-property" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                9. Intellectual Property &amp; Proprietary Molds
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  All software, user interface design, logos, trademarks (&ldquo;ViroEco&rdquo;), product photography, technical spec sheets, and proprietary thermoforming algorithms are the exclusive intellectual property of ViroEco Global Inc.
                </p>
                <p>
                  Proprietary custom tooling molds developed specifically for a buyer under an exclusive agreement will remain dedicated to that buyer&apos;s production runs and will not be deployed for competing third-party orders without express written consent.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="environmental-claims" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                10. Environmental Impact &amp; ESG Assertions
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  All carbon offset metrics, plastic replacement calculations, and Life Cycle Assessment (LCA) figures provided in your dashboard or impact certificates are calculated based on peer-reviewed ISO 14040/14044 methodologies and agricultural bio-locking models.
                </p>
                <p>
                  Enterprises are permitted to utilize ViroEco impact verification badges in their corporate ESG, sustainability, and annual CSR reports provided that the figures are quoted accurately and without misleading alteration.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section id="liability-disclaimers" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                11. Warranties, Disclaimers &amp; Limitation of Liability
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  <strong>Warranty of Material Quality:</strong> ViroEco warrants that all goods shipped strictly conform to published technical data sheets and food contact certifications for a period of 24 months from the date of manufacture when stored under standard dry warehouse conditions (temperature 15°C–30°C, RH &lt; 65%).
                </p>
                <p>
                  <strong>Limitation of Liability:</strong> TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL VIROECO GLOBAL INC., ITS DIRECTORS, EMPLOYEES, OR SUPPLIERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES (INCLUDING LOSS OF REPUTATION, PROFIT LOSS, BUSINESS INTERRUPTION, OR PROCUREMENT OF SUBSTITUTE GOODS). VIROECO&apos;S AGGREGATE LIABILITY ARISING OUT OF ANY TRANSACTION SHALL BE STRICTLY LIMITED TO THE ACTUAL PURCHASE AMOUNT PAID BY THE CUSTOMER FOR THE SPECIFIC SHIPMENT GIVING RISE TO THE CLAIM.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section id="force-majeure" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                12. Force Majeure &amp; Agricultural Feedstock Events
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  Neither party shall be held liable for failure or delay in performance resulting from causes beyond reasonable control, including but not limited to acts of God, floods, droughts, severe agricultural crop failures, extreme monsoons impacting palm shed harvests, pandemics, maritime port blockades, customs strikes, or government trade embargoes.
                </p>
              </div>
            </section>

            {/* Section 13 */}
            <section id="governing-law" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                13. Governing Law &amp; Dispute Resolution
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  <strong>Governing Law:</strong> These Terms and any dispute arising from them shall be governed by and construed in accordance with the substantive laws of India, without regard to its conflict of law principles.
                </p>
                <p>
                  <strong>Arbitration &amp; Jurisdiction:</strong> Any dispute, controversy, or claim that cannot be resolved through good-faith commercial negotiation within thirty (30) days shall be referred to and finally settled by binding arbitration in Bengaluru, Karnataka, in accordance with the Arbitration and Conciliation Act, 1996. The language of arbitration shall be English. Subject to arbitration, the courts located in Bengaluru, Karnataka, shall possess exclusive jurisdiction.
                </p>
              </div>
            </section>

            {/* Section 14 */}
            <section id="updates-contact" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                14. Amendments, Severability &amp; Legal Notices
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  <strong>Amendments:</strong> ViroEco reserves the right to update or modify these Terms of Service periodically. Changes take effect immediately upon publication on this URL. Continued use of our services following revision constitutes binding agreement to the amended terms.
                </p>
                <p>
                  <strong>Severability:</strong> If any provision of these Terms is found to be unlawful, void, or unenforceable by an authorized court or arbitral tribunal, that provision shall be severed without impairing the validity and enforceability of the remaining provisions.
                </p>
              </div>

              {/* Official Corporate Contact Card */}
              <div className="mt-6 pt-6 border-t border-[#DFD5C6] bg-[#FAF9F5] rounded-none p-5 space-y-3">
                <p className="font-display font-bold text-sm text-[#50644C]">Official Legal Notices &amp; Communications</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5A6659]">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#17231C]">ViroEco Global Inc.</strong><br />
                      Attn: Office of the General Counsel<br />
                      42 Industrial Agro Park, Whitefield<br />
                      Bengaluru, Karnataka 560066, India
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                      <a href="mailto:info@viroeco.com" className="text-[#50644C] underline font-medium">
                        info@viroeco.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>+91 (800) 456-7890 (Ext. 402)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>CIN / Registration: U24100KA2023PTC178942</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </Container>
    </div>
  );
}
