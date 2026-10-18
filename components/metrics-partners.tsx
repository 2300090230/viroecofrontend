import { Container } from "@/components/container";

const METRICS = [
  { value: "50M+", label: "Single-Use Plastics Prevented", subtext: "Diverted from global landfills & oceans" },
  { value: "100+", label: "Enterprise Brand Clients", subtext: "Hospitality chains, QSRs & airlines" },
  { value: "25+", label: "Farmer Export Hubs", subtext: "Direct agrarian partnerships across India" },
  { value: "100%", label: "Circular Agri-Waste", subtext: "Zero petroleum polymers or PFAS added" },
];

const PARTNERS = [
  "MARRIOTT LUXURY",
  "TAJ HOTELS",
  "INDIGO CATERING",
  "BLUE TOKAI COFFEE",
  "STARBUCKS ALLIANCE",
  "ZOMATO GLOBAL",
  "ITC HOTELS",
  "HYATT REGENCY",
  "CHAAYOS ENTERPRISE",
];

export function MetricsPartners() {
  return (
    <section className="bg-white border-y border-line py-14">
      <Container>
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-line">
          {METRICS.map((m, idx) => (
            <div key={m.label} className={`space-y-1.5 ${idx > 0 ? "pt-4 md:pt-0 md:pl-8" : ""}`}>
              <p className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight">
                {m.value}
              </p>
              <p className="text-sm font-semibold text-ink">{m.label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{m.subtext}</p>
            </div>
          ))}
        </div>

        {/* Partner Ticker / Logos */}
        <div className="mt-12 pt-8 border-t border-line">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold mb-6">
            TRUSTED BY VISIONARY PROCUREMENT LEADERS WORLDWIDE
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-12 opacity-70">
            {PARTNERS.map((partner) => (
              <span
                key={partner}
                className="font-display text-sm sm:text-base font-semibold tracking-wider text-ink/80 hover:text-forest transition-colors cursor-default"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
