import Link from "next/link";
import { Container } from "@/components/container";
import { LegalToc, ScrollToButton } from "@/components/legal-toc";
import {
  ShieldCheck,
  Lock,
  Server,
  UserCheck,
  Building2,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Database,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Official Privacy Policy & Data Governance | ViroEco Global",
  description:
    "Official Privacy Policy of ViroEco Global Inc. Explaining how we collect, protect, process, and respect personal, commercial, and enterprise data in accordance with global privacy frameworks.",
};

const SECTIONS = [
  { id: "overview-scope", title: "1. Overview & Data Governance Scope" },
  { id: "information-collected", title: "2. Categories of Information We Collect" },
  { id: "processing-purposes", title: "3. Purposes & Legal Bases for Data Processing" },
  { id: "payment-security", title: "4. Payment Processing & Financial Tokenization" },
  { id: "cookies-tracking", title: "5. Cookies, Telemetry & Local Session Storage" },
  { id: "disclosure-sharing", title: "6. Third-Party Sharing & Freight Logistics Disclosures" },
  { id: "no-sell-pledge", title: "7. Zero-Sale of Data Commitment" },
  { id: "international-transfers", title: "8. Cross-Border Data Transfers & Adequacy" },
  { id: "data-retention", title: "9. Data Retention & Erasure Protocols" },
  { id: "security-safeguards", title: "10. Technical & Organizational Security Safeguards" },
  { id: "user-rights", title: "11. Your Statutory Privacy Rights (GDPR / DPDPA / CCPA)" },
  { id: "children-privacy", title: "12. Children's Privacy Notice" },
  { id: "policy-amendments", title: "13. Updates to this Privacy Policy" },
  { id: "dpo-grievance", title: "14. Data Protection Officer (DPO) & Grievance Redressal" },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-24 pb-20 bg-[#FAF9F5] min-h-screen text-[#17231C]">
      {/* Hero Header */}
      <section className="border-b border-[#DFD5C6] bg-white py-14 lg:py-16">
        <Container>
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-semibold bg-[#EDF2EB] text-[#50644C] border border-[#50644C]/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Data Protection &amp; Privacy Charter
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-medium bg-[#FAF9F5] text-[#5A6659] border border-[#DFD5C6]">
                <Calendar className="w-3.5 h-3.5 text-[#5A6659]" />
                Version 2.4 — Effective January 1, 2026
              </span>
              <span className="text-xs text-[#5A6659]">
                Compliance: GDPR, DPDPA 2023, CCPA/CPRA
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#50644C] leading-tight">
              Privacy Policy &amp; Data Governance
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#5A6659] leading-relaxed max-w-3xl">
              At <strong>ViroEco Global Inc.</strong>, we consider data stewardship and transparency as foundational to our mission as circular sustainability. This policy details how we collect, safeguard, process, and respect your enterprise and personal data when you interact with our digital platforms, catalog, and supply chain services.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 pt-2">
              <Link
                href="/terms"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#50644C] hover:underline"
              >
                View Terms of Service <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <ScrollToButton
                targetId="dpo-grievance"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6659] hover:text-[#50644C] transition-colors cursor-pointer"
              >
                Contact Data Protection Officer <ChevronRight className="w-3.5 h-3.5" />
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
              <LegalToc title="Policy Contents" sections={SECTIONS} />

              {/* Privacy Officer Contact */}
              <div className="bg-[#50644C] text-white rounded-none p-6 space-y-3">
                <p className="text-xs uppercase tracking-widest text-emerald-300 font-semibold">
                  Privacy Office
                </p>
                <h4 className="font-display text-base font-semibold">
                  Exercise Your Data Rights
                </h4>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Request access to your stored records, request full erasure under GDPR/DPDPA, or update corporate tax data directly with our DPO team.
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

          {/* Main Content Clauses (8 Cols) */}
          <main className="lg:col-span-8 space-y-12">
            {/* Privacy Commitments Callout */}
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-none p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#50644C] font-semibold text-sm">
                <Lock className="w-4 h-4 text-emerald-700" />
                Our Core Privacy Promises
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#2A4434] pt-1">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Zero Data Monetization:</strong> We never sell, rent, or trade your personal or business data.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>PCI-DSS Compliant:</strong> Card data is tokenized directly by certified tier-1 payment gateways.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>AES-256 Storage:</strong> End-to-end encrypted databases and strict access controls.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Right to Erasure:</strong> Unrestricted ability to delete your profile and account history.</span>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <section id="overview-scope" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                1. Overview &amp; Data Governance Scope
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  This Privacy Policy applies to all personal, commercial, and technical information collected by{" "}
                  <strong>ViroEco Global Inc.</strong> (&ldquo;<strong>ViroEco</strong>&rdquo;, &ldquo;<strong>we</strong>&rdquo;, &ldquo;<strong>us</strong>&rdquo;, or &ldquo;<strong>our</strong>&rdquo;) through our website, mobile interfaces, enterprise quotation tooling, electronic order workflows, customer service channels, and physical supply chain touchpoints.
                </p>
                <p>
                  ViroEco acts as the &ldquo;Data Controller&rdquo; (under GDPR and UK GDPR) and &ldquo;Data Fiduciary&rdquo; (under the Indian Digital Personal Data Protection Act, 2023) with respect to personal information processed through our systems.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="information-collected" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                2. Categories of Information We Collect
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  We collect information strictly necessary to deliver high-quality eco-friendly products, manage wholesale accounts, and fulfill statutory obligations:
                </p>
                <div className="space-y-3 pt-1">
                  <div className="p-4 bg-[#FAF9F5] border border-[#DFD5C6] rounded-none space-y-1">
                    <p className="font-semibold text-xs text-[#50644C] flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-700" /> Identity &amp; Contact Details
                    </p>
                    <p className="text-xs text-[#5A6659]">
                      Full name, business email address, phone number, physical billing and dispatch addresses, corporate entity name, job designation, and company tax/GST numbers.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAF9F5] border border-[#DFD5C6] rounded-none space-y-1">
                    <p className="font-semibold text-xs text-[#50644C] flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-emerald-700" /> Commercial &amp; Transactional Data
                    </p>
                    <p className="text-xs text-[#5A6659]">
                      Purchase orders, carton quantities, custom mold specifications, quotation history, delivery status, shipping airway bills (AWB), and carbon offset verification certificates.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAF9F5] border border-[#DFD5C6] rounded-none space-y-1">
                    <p className="font-semibold text-xs text-[#50644C] flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-emerald-700" /> Device, Telemetry &amp; Technical Logs
                    </p>
                    <p className="text-xs text-[#5A6659]">
                      IP address, approximate location, browser user-agent, operating system, referral URL paths, page interaction latencies, error logs, and session tokens.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="processing-purposes" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                3. Purposes &amp; Legal Bases for Data Processing
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  We process data under lawful legal grounds recognized across international regulations:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>
                    <strong>Contractual Performance (Art. 6(1)(b) GDPR / DPDPA):</strong> Processing orders, executing warehouse picking and freight dispatches, manufacturing bespoke tooling, generating tax invoices, and transmitting delivery tracking notices.
                  </li>
                  <li>
                    <strong>Legal Compliance (Art. 6(1)(c) GDPR):</strong> Retaining tax and sales records according to statutory GST, income tax, customs declaration, and anti-fraud mandates.
                  </li>
                  <li>
                    <strong>Legitimate Business Interests (Art. 6(1)(f) GDPR):</strong> Enhancing catalog search, monitoring platform security, analyzing aggregate material demand for agricultural harvesting forecasts, and preventing unauthorized bulk scraping.
                  </li>
                  <li>
                    <strong>Explicit Consent (Art. 6(1)(a) GDPR):</strong> Opt-in subscription to ViroEco Circular Insights newsletters and quarterly sustainability case studies. You can revoke consent at any moment.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="payment-security" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                4. Payment Processing &amp; Financial Tokenization
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  All online payments executed on ViroEco are transmitted directly through certified <strong>PCI-DSS Level 1</strong> compliant payment service providers (e.g., Razorpay, Stripe, and authorized banking gateways).
                </p>
                <p>
                  ViroEco <strong>does not capture, store, or view</strong> unencrypted credit/debit card numbers, CVVs, or bank security PINs on our servers. We receive only secure transaction reference IDs, tokenized payment authorizations, and payment status flags to verify order settlement.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="cookies-tracking" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                5. Cookies, Telemetry &amp; Local Session Storage
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  Our web application utilizes lightweight cookies and browser local storage strictly for functional operations:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-[#FAF9F5] border border-[#DFD5C6] rounded-none">
                    <p className="font-semibold text-xs text-[#50644C]">Strictly Necessary Cookies</p>
                    <p className="text-xs text-[#5A6659] mt-0.5">Maintain your authenticated session, CSRF security tokens, and active cart items across page navigations.</p>
                  </div>
                  <div className="p-3 bg-[#FAF9F5] border border-[#DFD5C6] rounded-none">
                    <p className="font-semibold text-xs text-[#50644C]">Performance &amp; Diagnostics</p>
                    <p className="text-xs text-[#5A6659] mt-0.5">Aggregate anonymous metrics on page load speeds, catalog filter usage, and technical error monitoring.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="disclosure-sharing" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                6. Third-Party Sharing &amp; Freight Logistics Disclosures
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  We share your data strictly with vetted third-party service providers bound by comprehensive Data Processing Agreements (DPAs):
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li><strong>Logistics &amp; Freight Carriers:</strong> Sharing shipping address, contact phone, and commercial invoice with carriers (e.g. FedEx, Blue Dart, DHL, ocean freight forwarders) for physical consignment delivery.</li>
                  <li><strong>Cloud Infrastructure:</strong> High-security ISO/IEC 27001 certified server infrastructure and database hosting.</li>
                  <li><strong>Statutory Authorities:</strong> Regulatory bodies, customs officials, or tax authorities when mandated by statutory law or court order.</li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section id="no-sell-pledge" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                7. Zero-Sale of Data Commitment
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  <strong>We do not sell, rent, lease, or trade your personal information or business transaction records to third-party data brokers, advertising networks, or marketing syndicates.</strong>
                </p>
                <p>
                  Under California Consumer Privacy Act (CCPA/CPRA) definitions, ViroEco has never engaged in the sale or cross-context behavioral sharing of consumer personal information in the preceding 12 months.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="international-transfers" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                8. Cross-Border Data Transfers &amp; Adequacy
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  Because ViroEco operates international manufacturing and distribution hubs spanning India, the United Arab Emirates, the United Kingdom, and the United States, your information may be processed across these jurisdictions.
                </p>
                <p>
                  All international data transfers comply with statutory cross-border transfer requirements, utilizing European Commission Standard Contractual Clauses (SCCs), UK International Data Transfer Agreements (IDTAs), and equivalent legal transfer mechanisms.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="data-retention" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                9. Data Retention &amp; Erasure Protocols
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  We retain personal data only for the duration necessary to satisfy the purposes set forth in this policy:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li><strong>Active Accounts:</strong> Maintained while your account remains active and open.</li>
                  <li><strong>Financial &amp; Tax Records:</strong> Preserved for a statutory period of 7 years from transaction completion in accordance with corporate tax and accounting laws.</li>
                  <li><strong>Inactive Sessions:</strong> Deleted or anonymized within 24 months of sustained inactivity upon notification.</li>
                </ul>
              </div>
            </section>

            {/* Section 10 */}
            <section id="security-safeguards" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                10. Technical &amp; Organizational Security Safeguards
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  We deploy robust defense-in-depth security measures to protect your data against unauthorized access, alteration, disclosure, or destruction:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-[#FAF9F5] border border-[#DFD5C6] rounded-none flex items-start gap-2.5">
                    <KeyRound className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs text-[#50644C]">Encryption in Transit &amp; at Rest</p>
                      <p className="text-xs text-[#5A6659]">TLS 1.3 encryption across all network channels and AES-256 database disk encryption.</p>
                    </div>
                  </div>
                  <div className="p-3 bg-[#FAF9F5] border border-[#DFD5C6] rounded-none flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs text-[#50644C]">Role-Based Access Controls</p>
                      <p className="text-xs text-[#5A6659]">Strict principle of least privilege with mandatory multi-factor authentication (MFA) for administrative access.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 11 */}
            <section id="user-rights" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                11. Your Statutory Privacy Rights (GDPR / DPDPA / CCPA)
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  Depending on your jurisdiction, you possess the following statutory rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li><strong>Right to Access:</strong> Request a comprehensive export of personal data held about you.</li>
                  <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete contact or tax records.</li>
                  <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> Request permanent deletion of your profile and non-statutory records.</li>
                  <li><strong>Right to Restrict or Object:</strong> Restrict certain processing or object to direct marketing communications.</li>
                  <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable JSON/CSV format.</li>
                </ul>
                <p>
                  To exercise any of these rights, email our Data Protection Officer at <code className="bg-[#FAF9F5] px-1.5 py-0.5 rounded-none text-[#50644C] border border-[#DFD5C6]">info@viroeco.com</code>. We respond to all authenticated requests within thirty (30) calendar days.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section id="children-privacy" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                12. Children&apos;s Privacy Notice
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  Our services and wholesale platforms are directed exclusively toward adults and commercial enterprises. We do not knowingly solicit or collect personal information from individuals under 18 years of age. If we learn that personal data of a minor has been collected without verifiable parental consent, we will promptly delete that data.
                </p>
              </div>
            </section>

            {/* Section 13 */}
            <section id="policy-amendments" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                13. Updates to this Privacy Policy
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  ViroEco reserves the right to update this policy to reflect changes in regulatory standards or system functionality. The latest effective date will always be visible at the top of this document. Material modifications will be communicated via prominent notice on our website or email notification to active account holders.
                </p>
              </div>
            </section>

            {/* Section 14 */}
            <section id="dpo-grievance" className="scroll-mt-28 space-y-4 bg-white border border-[#DFD5C6] rounded-none p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#50644C]">
                14. Data Protection Officer (DPO) &amp; Grievance Redressal
              </h2>
              <div className="text-xs sm:text-sm text-[#5A6659] leading-relaxed space-y-3">
                <p>
                  In compliance with the Digital Personal Data Protection Act (DPDPA 2023) and GDPR Article 37, ViroEco has appointed a designated Grievance Officer and Data Protection Officer to address inquiries, grievances, and rights requests:
                </p>
              </div>

              {/* Official Corporate Contact Card */}
              <div className="mt-4 pt-6 border-t border-[#DFD5C6] bg-[#FAF9F5] rounded-none p-5 space-y-3">
                <p className="font-display font-bold text-sm text-[#50644C]">Office of the Data Protection Officer</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5A6659]">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#17231C]">ViroEco Global Inc.</strong><br />
                      Attn: Data Protection Officer / Grievance Redressal<br />
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
                      <span>+91 (800) 456-7890 (Ext. 405)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Response SLA: Within 48 business hours</span>
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
