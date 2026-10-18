import { Container } from "@/components/container";
import { ShieldCheck, Award } from "lucide-react";

const CERTS = [
  { code: "FDA 21 CFR", name: "US Food & Drug Admin", desc: "Safe for hot, fatty & aqueous foods" },
  { code: "EN 13432", name: "European Standard", desc: "100% biodegradable in 90 days" },
  { code: "ASTM D6400", name: "North America Standard", desc: "Industrial & municipal compostable" },
  { code: "ISO 9001:2015", name: "Quality Assurance", desc: "Standardized sterile manufacturing" },
  { code: "USDA Biobased", name: "100% Bio-Preferred", desc: "Zero fossil polymers or additives" },
  { code: "Intertek Zero-PFAS", name: "Total Fluorine Free", desc: "Tested < 10ppm non-detectable" },
];

export function CertificationsBar() {
  return (
    <section className="py-12 bg-cream border-b border-line">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-forest" />
            <h3 className="font-display text-lg font-bold text-forest">
              Certified &amp; Tested Across Global Standards
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Independent laboratory certificates available upon request for B2B export audits.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CERTS.map((c) => (
            <div
              key={c.code}
              className="bg-white border border-line rounded-md p-3.5 space-y-1 text-center shadow-2xs hover:border-forest/30 transition-colors"
            >
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-forest">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {c.code}
              </div>
              <p className="text-[11px] font-semibold text-ink">{c.name}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{c.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
