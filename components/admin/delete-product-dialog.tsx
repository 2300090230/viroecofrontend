"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, ShieldAlert, Loader2, FileText, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProductImage } from "@/components/product-image";
import { formatINR } from "@/lib/format";
import type { Product } from "@/lib/types";

const PRESET_REASONS = [
  "Discontinued SKU",
  "Quality / Defective Batch",
  "Duplicate Listing",
  "Supplier Termination",
  "Inventory Purge / Zero Stock",
  "Custom Reason",
];

interface DeleteProductDialogProps {
  product: Product;
  trigger?: React.ReactNode;
  onConfirm: (productId: number, reason: string) => Promise<unknown> | void;
  isDeleting?: boolean;
}

export function DeleteProductDialog({
  product,
  trigger,
  onConfirm,
  isDeleting = false,
}: DeleteProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("Discontinued SKU");
  const [customReason, setCustomReason] = useState("");

  const getFinalReason = () => {
    if (selectedPreset === "Custom Reason") {
      return customReason.trim() || "Administrative Purge (Custom Reason)";
    }
    if (customReason.trim()) {
      return `${selectedPreset} - ${customReason.trim()}`;
    }
    return selectedPreset;
  };

  const handleDelete = async () => {
    try {
      const reason = getFinalReason();
      await onConfirm(product.productId, reason);
      setOpen(false);
      setCustomReason("");
      setSelectedPreset("Discontinued SKU");
    } catch {
      // Error handled by parent mutation/toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button
            className="cursor-pointer p-2 text-muted-foreground hover:text-destructive transition-colors rounded-none hover:bg-destructive/10"
            aria-label={`Delete ${product.pname}`}
            title="Delete Product"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg border-destructive/20 bg-white p-0 overflow-hidden shadow-2xl rounded-none">
        {/* Official Warning Header Banner */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-5 text-white flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-none bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30 text-white shadow-inner">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-2 py-0.5 rounded-none">
                ADMIN AUDIT REQUIRED
              </span>
            </div>
            <DialogTitle className="text-lg font-bold text-white tracking-tight mt-0.5">
              Confirm Product Deletion
            </DialogTitle>
          </div>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <DialogDescription className="text-xs text-[#5A6659] leading-relaxed">
            You are about to permanently purge this SKU from the active Viroeco catalog. An official audit event will record your administrator email, timestamp, and the justification reason specified below.
          </DialogDescription>

          {/* Product Identification Card */}
          <div className="rounded-none border border-[#DFD5C6] bg-[#FAF9F5] p-3.5 flex items-center gap-3">
            <ProductImage
              images={product.productImages}
              alt={product.pname}
              className="h-14 w-14 shrink-0 border border-[#DFD5C6] object-cover rounded-none bg-white"
              sizes="56px"
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs text-[#17231C] truncate">{product.pname}</p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-[#5A6659]">
                <span className="font-mono font-medium text-emerald-800">SKU #{product.productId}</span>
                <span>•</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-normal bg-white">
                  {product.category}
                </Badge>
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                <span className="font-semibold text-emerald-900">{formatINR(product.price)}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{product.quantity} units remaining</span>
              </div>
            </div>
          </div>

          {/* Audit Reason Justification Selector */}
          <div className="rounded-none border border-[#DFD5C6] bg-white p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#17231C]">
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>Audit Log Justification (Required)</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PRESET_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSelectedPreset(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-none border font-medium transition-all cursor-pointer ${
                    selectedPreset === preset
                      ? "bg-[#50644C] text-white border-[#50644C] shadow-xs"
                      : "bg-[#FAF9F5] text-[#5A6659] border-[#DFD5C6] hover:bg-gray-100"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div>
              <label className="text-[11px] text-[#5A6659] block mb-1">
                {selectedPreset === "Custom Reason"
                  ? "Describe the specific reason for deleting this SKU:"
                  : "Additional details / note for the audit log (Optional):"}
              </label>
              <textarea
                rows={2}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder={
                  selectedPreset === "Custom Reason"
                    ? "Explain why this item is being permanently removed..."
                    : "Add any context, authorization notes, or replacement details..."
                }
                className="w-full rounded-none border border-[#DFD5C6] bg-[#FAF9F5] p-2.5 text-xs text-[#17231C] placeholder:text-[#5A6659]/60 focus:outline-hidden focus:ring-2 focus:ring-[#50644C] resize-none"
              />
            </div>
          </div>

          {/* Warning Impact Checklist */}
          <div className="rounded-none bg-red-50/80 border border-red-200/80 p-3 text-[11px] text-red-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-950">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>Important Deletion Consequences:</span>
            </div>
            <ul className="list-disc pl-5 space-y-0.5 text-red-800">
              <li>SKU unlisted immediately from search, categories &amp; storefront.</li>
              <li>Associated bulk discount tiers and image associations will be cleared.</li>
              <li>An official audit record will permanently log your reason into the security register.</li>
            </ul>
          </div>
        </div>

        {/* Action Footer */}
        <DialogFooter className="px-6 py-4 bg-[#FAF9F5] border-t border-[#DFD5C6] flex flex-row items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
            className="cursor-pointer border-[#DFD5C6] text-xs font-semibold rounded-none"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-none shadow-xs gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting SKU...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm &amp; Record Audit Log</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
