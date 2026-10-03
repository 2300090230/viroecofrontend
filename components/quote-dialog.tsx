"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle2, Leaf, Send, ShieldCheck } from "lucide-react";

export function QuoteDialog({
  open,
  onOpenChange,
  initialProduct,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProduct?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    category: initialProduct || "Areca Palm Wares",
    monthlyVolume: "50,000 units/mo",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) {
      toast.warning("Please enter all required fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Bulk enquiry submitted successfully.", {
        description: "Our enterprise sales team will send custom pricing within 24 hours.",
      });
    }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] bg-[#FAF9F5] border-[#50644C]/20 text-[#17231C] p-6 rounded-none">
        <DialogHeader className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-[#EDF2EB] text-[#50644C] text-xs font-semibold w-fit">
            <Leaf className="w-3.5 h-3.5" />
            Enterprise Sample Kit &amp; Volume Pricing
          </div>
          <DialogTitle className="font-display text-2xl tracking-tight text-[#50644C]">
            {submitted ? "Inquiry Received" : "Request Custom B2B Quote"}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#5A6659]">
            {submitted
              ? "Thank you for reaching out. A dedicated packaging consultant will be in touch shortly."
              : "Direct wholesale pricing, proprietary mold specifications, and physical sample kits delivered worldwide."}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-6 space-y-4 text-center">
            <div className="w-16 h-16 rounded-none bg-[#EDF2EB] text-[#50644C] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display text-lg text-[#50644C]">Sample Kit Dispatched</h4>
              <p className="text-sm text-[#5A6659]">
                We have emailed a formal receipt to <span className="font-semibold text-[#17231C]">{form.email}</span>.
              </p>
            </div>
            <div className="p-4 rounded-none bg-white border border-[#DFD5C6] text-xs text-[#5A6659] flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Guaranteed SLA response time under 24 business hours.
            </div>
            <Button
              onClick={handleReset}
              className="w-full bg-[#50644C] hover:bg-[#243021] text-white rounded-none cursor-pointer"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="q-name" className="text-xs font-medium">
                  Contact Name *
                </Label>
                <Input
                  id="q-name"
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="bg-white border-[#DFD5C6] rounded-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="q-company" className="text-xs font-medium">
                  Company / Organization *
                </Label>
                <Input
                  id="q-company"
                  placeholder="e.g. Taj Hotels / Blue Tokai"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  required
                  className="bg-white border-[#DFD5C6] rounded-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="q-email" className="text-xs font-medium">
                  Work Email *
                </Label>
                <Input
                  id="q-email"
                  type="email"
                  placeholder="procurement@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="bg-white border-[#DFD5C6] rounded-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="q-phone" className="text-xs font-medium">
                  Phone / WhatsApp
                </Label>
                <Input
                  id="q-phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="bg-white border-[#DFD5C6] rounded-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="q-cat" className="text-xs font-medium">
                  Primary Material / Line
                </Label>
                <select
                  id="q-cat"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full h-9 rounded-none border border-[#DFD5C6] bg-white px-3 text-sm text-[#17231C] focus:outline-none focus:ring-1 focus:ring-[#50644C]"
                >
                  <option value="Areca Palm Wares">Areca Palm Wares</option>
                  <option value="Sugarcane Bagasse Range">Sugarcane Bagasse Range</option>
                  <option value="Birchwood Cutlery">Birchwood Cutlery</option>
                  <option value="Insulated Ripple Cups">Insulated Ripple Cups</option>
                  <option value="Clamshell Meal Boxes">Clamshell Meal Boxes</option>
                  <option value="Custom Embossed Molds">Custom Embossed Molds</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="q-vol" className="text-xs font-medium">
                  Estimated Monthly Volume
                </Label>
                <select
                  id="q-vol"
                  value={form.monthlyVolume}
                  onChange={(e) => setForm({ ...form, monthlyVolume: e.target.value })}
                  className="w-full h-9 rounded-none border border-[#DFD5C6] bg-white px-3 text-sm text-[#17231C] focus:outline-none focus:ring-1 focus:ring-[#50644C]"
                >
                  <option value="1,000 - 10,000 units/mo">1,000 - 10,000 units/mo</option>
                  <option value="10,000 - 50,000 units/mo">10,000 - 50,000 units/mo</option>
                  <option value="50,000 - 200,000 units/mo">50,000 - 200,000 units/mo</option>
                  <option value="200,000+ units/mo">200,000+ units/mo (Enterprise Tier)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="q-notes" className="text-xs font-medium">
                Custom Specifications &amp; Delivery Requirements
              </Label>
              <Textarea
                id="q-notes"
                placeholder="Include details like custom debossing, dimensions, delivery destinations, or target delivery date..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="bg-white border-[#DFD5C6] rounded-none text-sm resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#50644C] hover:bg-[#243021] text-white rounded-none py-5 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Enterprise Inquiry &amp; Request Sample Kit
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
