import { Container } from "@/components/container";

const STEPS = [
  {
    step: "01",
    title: "Ethical Sourcing",
    description:
      "Fallen areca palm sheaths & sugarcane bagasse residue collected directly from vetted smallholder farming communities with fair trade income.",
  },
  {
    step: "02",
    title: "Natural Sanitization",
    description:
      "Washed in pressurized steam and pure filtered water. Absolutely zero chemical bleaching agents, chlorine, or synthetic surfactants used.",
  },
  {
    step: "03",
    title: "High-Heat Hydraulic Press",
    description:
      "Shaped under 150°C and 40-ton pneumatic heated molds to bind natural plant fibers into rigid, oil-resistant forms without artificial glues.",
  },
  {
    step: "04",
    title: "Sterile UV & Precision Trim",
    description:
      "Laser edge-trimmed for ultra-smooth dining comfort, followed by high-intensity UV sterilization and nitrogen-sealed protective packing.",
  },
  {
    step: "05",
    title: "Compost & Full Soil Return",
    description:
      "After culinary use, items biodegrade completely in 60 to 90 days, returning vital carbon and micronutrients to enrich garden and farm soils.",
  },
];

export function CircularProcess() {
  return (
    <section id="materials" className="py-20 bg-white border-y border-line scroll-mt-20">
      <Container>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-forest font-bold inline-flex items-center gap-1.5">
            Transparent Circular Supply Chain
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-forest">
            How Agri-Waste Becomes Luxury Dinnerware
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A zero-petroleum, zero-deforestation process that converts discarded agricultural
            byproducts into premium high-tensile foodservice packaging.
          </p>
        </div>

        {/* 5-Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STEPS.map((s, idx) => (
            <div
              key={s.step}
              className="relative bg-cream border border-line rounded-md p-6 flex flex-col justify-between space-y-4 hover:border-forest/40 hover:shadow-xs transition-all"
            >
              <div className="space-y-3">
                <span className="font-display text-2xl font-bold text-forest">
                  {s.step}
                </span>
                <h3 className="font-display text-base font-semibold text-ink leading-snug">
                  {s.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-md bg-white border border-line text-forest flex items-center justify-center text-[10px] shadow-xs">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
