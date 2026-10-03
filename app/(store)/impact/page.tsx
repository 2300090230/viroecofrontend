import Link from "next/link";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { CircularProcess } from "@/components/circular-process";
import { CertificationsBar } from "@/components/certifications-bar";
import {
  ArrowRight,
  Leaf,
  RefreshCw,
  Droplets,
  Wind,
  ShieldCheck,
  CheckCircle2,
  TreePine,
  Factory,
} from "lucide-react";

export const metadata = {
  title: "Circular Impact & Sustainable Materials | ViroEco",
  description:
    "Discover ViroEco's circular lifecycle and eco-materials: bamboo fiber, rice husk biocomposite, sugarcane bagasse, and areca palm leaf. Zero fossil plastic and certified carbon-negative.",
};

const MATERIALS = [
  {
    name: "Bamboo Fiber Biocomposite",
    badge: "Rapidly Renewable",
    stats: "Matures in 3 Years · Zero Fertilizers",
    description:
      "Harvested from FSC-certified sustainable bamboo culms that regrow naturally without chemical pesticides. High tensile strength, feather-light, and naturally antibacterial.",
    applications: "Drinkware, Tumblers, Reusable Sippers, Lunchboxes",
  },
  {
    name: "Rice Husk Agricultural Residue",
    badge: "Zero-Waste Upcycling",
    stats: "Prevents Crop Burning · Upcycles 350+ Tons Waste",
    description:
      "Crafted from the outer protective husks of rice grains that are otherwise burned in farm fields, producing toxic particulate smoke. High thermal resilience and microwave safe.",
    applications: "Bowls, Plates, Storage Canisters, Planters",
  },
  {
    name: "Sugarcane Bagasse Pulp",
    badge: "100% Home Compostable",
    stats: "Breaks Down in 60-90 Days · Zero Bleach",
    description:
      "Repurposed fibrous residue leftover after sugarcane juice extraction. High hydraulic density resists boiling liquids, soups, and greasy sauces without plastic coatings.",
    applications: "Takeaway Containers, Meal Trays, Soup Bowls, Clamshells",
  },
  {
    name: "Naturally Fallen Areca Palm Leaves",
    badge: "Zero Deforestation",
    stats: "100% Natural Leaf · Washed in Pure Spring Water",
    description:
      "Collected from naturally fallen sheaths of the Areca palm tree. Hand-washed, steam-sanitized, and heated-pressed with no chemicals, varnishes, or artificial glues.",
    applications: "Dinner Plates, Banqueting Wares, Platters, Canape Trays",
  },
];

const LCA_COMPARISON = [
  {
    metric: "Fossil Petroleum Usage",
    viroeco: "0% (Zero fossil polymer)",
    plastic: "100% (Virgin crude oil / PP / PS)",
    paper: "15-20% (Polyethylene / PLA plastic lining)",
  },
  {
    metric: "Carbon Footprint (Cradle-to-Gate)",
    viroeco: "-0.82 kg CO₂e / kg (Net Carbon Sink)",
    plastic: "+3.20 kg CO₂e / kg",
    paper: "+1.95 kg CO₂e / kg",
  },
  {
    metric: "Water Consumption in Manufacturing",
    viroeco: "95% Closed-Loop Recycled",
    plastic: "High toxic wastewater discharge",
    paper: "Intensive chemical bleaching water",
  },
  {
    metric: "End of Life Degradation",
    viroeco: "60-90 Days in natural garden soil",
    plastic: "450+ Years (Microplastic shedding)",
    paper: "Landfill methane (Plastic liner prevents composting)",
  },
  {
    metric: "PFAS & Forever Chemicals",
    viroeco: "0.00 ppm (Certified PFAS Free)",
    plastic: "Phthalates & Bisphenols (BPA/BPS)",
    paper: "Often treated with Fluorinated coatings",
  },
];

export default function ImpactMaterialsPage() {
  return (
    <div className="pt-8 pb-20 bg-[#FAF9F5] min-h-screen text-[#17231C]">
      {/* Hero Header */}
      <section className="border-b border-[#DFD5C6] bg-white py-14 lg:py-16">
        <Container>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#EDF2EB] text-[#50644C] text-xs font-bold uppercase tracking-wider">
              Circular Lifecycle &amp; Material Science
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#50644C] leading-tight">
              Sustainable Materials for a Regenerative Planet
            </h1>
            <p className="text-base sm:text-lg text-[#5A6659] leading-relaxed">
              We convert agricultural crop waste and rapidly renewable fibers into durable, high-performance
              dinnerware and packaging. Zero single-use plastic, zero forever chemicals, and 100% circular from soil to table and back to soil.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild className="bg-[#50644C] hover:bg-[#243021] text-white rounded-none px-6 cursor-pointer">
                <Link href="/calculator">
                  Simulate ESG Savings
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-[#50644C]/20 text-[#50644C] hover:bg-[#EDF2EB] rounded-none px-6 cursor-pointer">
                <Link href="/products">
                  Shop Eco Products
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 4 Core Sustainable Materials Grid */}
      <Container className="py-16 space-y-12">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[#50644C] font-bold flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            Bio-Engineered Feedstocks
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#50644C]">
            Our Four Pillars of Agricultural Circularity
          </h2>
          <p className="max-w-2xl text-xs sm:text-sm text-[#5A6659]">
            By utilizing agricultural byproducts that farmers would otherwise incinerate, we provide supplementary rural farmer livelihoods while neutralizing carbon emissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MATERIALS.map((mat) => (
            <div
              key={mat.name}
              className="bg-white border border-[#DFD5C6] rounded-none p-7 shadow-xs hover:shadow-md hover:border-[#50644C]/40 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-[#EDF2EB] text-[#50644C] px-3 py-1 rounded-none">
                    {mat.badge}
                  </span>
                  <span className="text-[11px] font-medium text-[#5A6659]">
                    {mat.stats}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-[#50644C]">
                  {mat.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#5A6659] leading-relaxed">
                  {mat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#DFD5C6]/80 text-xs">
                <span className="font-semibold text-[#50644C]">Primary Product Applications:</span>
                <p className="text-[#5A6659] mt-0.5">{mat.applications}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Embedded 5-Step Process */}
      <CircularProcess />

      {/* Life Cycle Assessment (LCA) Comparative Table */}
      <Container className="py-16 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#50644C] font-bold inline-flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            Verified LCA Data
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#50644C]">
            Life Cycle Assessment vs. Conventional Packaging
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6659]">
            Independent environmental benchmarking comparing ViroEco biocomposites to petroleum plastics and lined paperboard.
          </p>
        </div>

        <div className="bg-white border border-[#DFD5C6] rounded-none overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#50644C] text-white">
                <tr>
                  <th className="p-4 sm:p-5 font-semibold">Impact Assessment Metric</th>
                  <th className="p-4 sm:p-5 font-semibold text-emerald-300">🌱 ViroEco Circular Wares</th>
                  <th className="p-4 sm:p-5 font-semibold text-white/80">Petroleum Plastic (PP / PS / PET)</th>
                  <th className="p-4 sm:p-5 font-semibold text-white/80">PE-Lined Paperboard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFD5C6]">
                {LCA_COMPARISON.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF9F5]/70 transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-[#17231C]">{row.metric}</td>
                    <td className="p-4 sm:p-5 font-bold text-[#50644C] bg-emerald-50/50">{row.viroeco}</td>
                    <td className="p-4 sm:p-5 text-[#5A6659]">{row.plastic}</td>
                    <td className="p-4 sm:p-5 text-[#5A6659]">{row.paper}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>

      {/* Certifications Bar */}
      <CertificationsBar />
    </div>
  );
}
