"use client";

import { useState } from "react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Send,
  Building2,
  Package,
  Clock,
} from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    category: "Drinkware & Cups",
    volume: "10,000 - 50,000 units/mo",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Bulk enquiry submitted successfully.", {
        description:
          "Our corporate supply chain specialist will contact you within 24 hours with custom pricing & sample dispatch confirmation.",
      });
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        category: "Drinkware & Cups",
        volume: "10,000 - 50,000 units/mo",
        message: "",
      });
    }, 800);
  };

  return (
    <div className="pb-20 bg-cream min-h-screen text-ink">
      {/* Contact Hero */}
      <section className="border-b border-line bg-gradient-to-r from-sand via-cream to-sage-wash py-14 lg:py-16">
        <Container>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sage-wash text-forest text-xs font-bold uppercase tracking-wider">
              Global Procurement &amp; Support
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-forest leading-tight">
              Connect with Our Sustainable Packaging Specialists
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Whether you require physical sample kits, custom tooling blueprints, high-volume price tiers, or international container shipping schedules, our team is at your service.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Grid */}
      <Container className="py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-line rounded-md p-8 sm:p-10 shadow-xs">
            <div className="space-y-2 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-forest">
                Direct Inquiry Form
              </span>
              <h2 className="font-display text-2xl font-bold text-forest">
                Request Samples or Enterprise Pricing
              </h2>
              <p className="text-xs text-muted-foreground">
                Fill out the details below and an enterprise account manager will respond within 24 business hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">
                    Full Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-cream border-line rounded-md text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">
                    Corporate Email *
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="john@hotelchain.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-cream border-line rounded-md text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">
                    Company / Organization *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Grand Horizon Resorts"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="bg-cream border-line rounded-md text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">
                    Phone Number
                  </label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="bg-cream border-line rounded-md text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">
                    Product Interest
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-cream border border-line rounded-md text-xs p-2.5 text-ink focus:outline-none focus:ring-1 focus:ring-forest"
                  >
                    <option>Drinkware &amp; Cups</option>
                    <option>Tableware &amp; Dinner Sets</option>
                    <option>Takeaway Packaging &amp; Clamshells</option>
                    <option>Birchwood &amp; Bamboo Cutlery</option>
                    <option>Gardenware &amp; Planters</option>
                    <option>Bespoke Custom Tooling</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">
                    Estimated Volume
                  </label>
                  <select
                    value={formData.volume}
                    onChange={(e) =>
                      setFormData({ ...formData, volume: e.target.value })
                    }
                    className="w-full bg-cream border border-line rounded-md text-xs p-2.5 text-ink focus:outline-none focus:ring-1 focus:ring-forest"
                  >
                    <option>Under 10,000 units/mo</option>
                    <option>10,000 - 50,000 units/mo</option>
                    <option>50,000 - 200,000 units/mo</option>
                    <option>200,000+ units/mo (Full Container)</option>
                    <option>Physical Sample Kit Evaluation</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink">
                  Project Specifications &amp; Requirements
                </label>
                <textarea
                  rows={4}
                  placeholder="Share details on your target items, custom branding needs, destination port, or specific delivery timeline..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-cream border border-line rounded-md text-xs p-3 text-ink focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-forest hover:bg-forest-dark text-white rounded-md py-6 text-xs font-bold cursor-pointer transition-all shadow-xs"
              >
                {loading ? (
                  "Transmitting Inquiry..."
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" /> Submit Enterprise Request
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Right Distribution Hubs (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Info */}
            <div className="bg-forest-dark text-white rounded-md p-8 space-y-5 shadow-md">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> 24h Enterprise SLA
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  Direct Communications Desk
                </h3>
              </div>

              <div className="space-y-3 text-xs text-white/90">
                <a
                  href="tel:+918004567890"
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="font-semibold text-white">Toll-Free Support</p>
                    <p className="text-[11px] text-emerald-200">+91 (800) 456-7890</p>
                  </div>
                </a>

                <a
                  href="mailto:info@viroeco.com"
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
                >
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="font-semibold text-white">Wholesale Inquiries</p>
                    <p className="text-[11px] text-emerald-200">info@viroeco.com</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Distribution Hubs */}
            <div className="bg-white border border-line rounded-md p-8 space-y-4 shadow-xs">
              <h3 className="font-display text-lg font-bold text-forest flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                Global Warehouses &amp; Hubs
              </h3>

              <div className="space-y-3.5 text-xs text-muted-foreground">
                <div className="flex items-start gap-2.5 pb-3 border-b border-line">
                  <MapPin className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-ink">Bengaluru HQ &amp; Innovation Lab:</strong>
                    <p>42 Industrial Agro Park, Whitefield, Bengaluru, Karnataka 560066</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pb-3 border-b border-line">
                  <MapPin className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-ink">North India Logistics Depot:</strong>
                    <p>Logistics Hub Sector 18, Gurugram, Haryana 122015</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-ink">Middle East &amp; Europe Distribution:</strong>
                    <p>JAFZA Freezone Dubai, UAE &amp; Park Royal Logistics Hub, London UK</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
