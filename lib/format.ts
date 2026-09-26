export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function discountPct(price: number, original: number): number {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

/** Named color swatches from the comma-separated `color` field → CSS colors. */
export function parseColors(color: string): string[] {
  return color
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean)
    .slice(0, 8);
}

/** Features stored comma- or pipe-delimited depending on the seed source. */
export function parseFeatures(features: string): string[] {
  return features
    .split(/[|,]/)
    .map((f) => f.trim())
    .filter(Boolean);
}

export function primaryImage(images: string[]): string | null {
  return images && images.length > 0 ? images[0] : null;
}
