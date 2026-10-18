// Single source for the business details shown in the footer, contact page and invoices.
// Override any value in .env (NEXT_PUBLIC_BUSINESS_*). Legal identifiers (GSTIN, address)
// have no defaults on purpose: they are only printed once real values are configured.

export const BUSINESS = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME || "VIRO eco",
  tagline: "From nature, for a cleaner tomorrow",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "info@viroeco.com",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+91 (800) 456-7890",
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "",
  gstin: process.env.NEXT_PUBLIC_BUSINESS_GSTIN || "",
} as const;

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
