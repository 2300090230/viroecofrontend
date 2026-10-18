import Image from "next/image";
import { BUSINESS } from "@/lib/business";
import { formatINR } from "@/lib/format";
import type { Address, Order } from "@/lib/types";

/** Same numbering as the backend invoice email: INV-000123. */
export const invoiceNumber = (orderId: number) => `INV-${String(orderId).padStart(6, "0")}`;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

/**
 * Print-ready invoice. Each line has the original unit price, the bulk discount applied, and
 * discountedPrice — the unit price actually charged (same figures as the invoice email).
 */
export function Invoice({
  order,
  customer,
  address,
}: {
  order: Order;
  customer: { name: string; email: string; phone?: string };
  address?: Address;
}) {
  const charged = (i: Order["items"][number]) => i.discountedPrice ?? i.price;
  const gross = order.items.reduce((n, i) => n + i.price * i.quantity, 0);
  const savings = order.items.reduce((n, i) => n + (i.price - charged(i)) * i.quantity, 0);
  const units = order.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <article
      id="invoice"
      className="mx-auto w-full max-w-[820px] overflow-hidden rounded-xl border border-line bg-white text-ink shadow-card print:max-w-none print:rounded-none print:border-0 print:shadow-none"
    >
      <header className="flex flex-wrap items-start justify-between gap-6 border-b-4 border-forest bg-cream px-6 py-6 sm:px-10 print:bg-white">
        <div>
          <Image src="/logo.png" alt={BUSINESS.name} width={180} height={66} className="h-14 w-auto" priority />
          <div className="mt-3 space-y-0.5 text-xs text-muted-foreground">
            {BUSINESS.address && <p className="max-w-xs whitespace-pre-line">{BUSINESS.address}</p>}
            <p>{BUSINESS.email} · {BUSINESS.phone}</p>
            {BUSINESS.gstin && <p>GSTIN: {BUSINESS.gstin}</p>}
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-semibold tracking-tight text-forest-dark">Invoice</p>
          <dl className="mt-3 grid grid-cols-[auto_auto] justify-end gap-x-4 gap-y-1 text-xs">
            <dt className="text-muted-foreground">Invoice no.</dt>
            <dd className="font-semibold">{invoiceNumber(order.id)}</dd>
            <dt className="text-muted-foreground">Order no.</dt>
            <dd className="font-medium">#{order.id}</dd>
            <dt className="text-muted-foreground">Date</dt>
            <dd className="font-medium">{fmtDate(order.createdAt)}</dd>
          </dl>
        </div>
      </header>

      <section className="grid gap-6 px-6 py-6 sm:grid-cols-3 sm:px-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-forest">Billed to</p>
          <p className="mt-2 text-sm font-semibold">{customer.name || customer.email}</p>
          <p className="text-xs text-muted-foreground">{customer.email}</p>
          {customer.phone && <p className="text-xs text-muted-foreground">{customer.phone}</p>}
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-forest">Ship to</p>
          {address ? (
            <p className="mt-2 text-xs leading-relaxed text-ink/85">
              {address.doorNumber}, {address.street}
              <br />
              {address.city}, {address.state} {address.zipCode}
              <br />
              {address.country}
            </p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">Address on file</p>
          )}
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-forest">Payment</p>
          <p className="mt-2 text-sm font-semibold">Razorpay</p>
          <p className="text-xs text-muted-foreground">Status: {order.status.replace(/_/g, " ").toLowerCase()}</p>
        </div>
      </section>

      <div className="px-6 sm:px-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-forest text-left text-xs uppercase tracking-wider text-white print:bg-forest">
              <th className="rounded-l-md px-3 py-2.5 font-medium">Item</th>
              <th className="px-3 py-2.5 text-right font-medium">Qty</th>
              <th className="px-3 py-2.5 text-right font-medium">Unit price</th>
              <th className="hidden px-3 py-2.5 text-right font-medium sm:table-cell print:table-cell">Bulk discount</th>
              <th className="rounded-r-md px-3 py-2.5 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {order.items.map((i) => (
              <tr key={`${i.productId}-${i.pname}`}>
                <td className="px-3 py-3">
                  <p className="font-medium">{i.pname}</p>
                  <p className="text-xs text-muted-foreground">SKU #{i.productId}</p>
                </td>
                <td className="px-3 py-3 text-right tabular-nums">{i.quantity}</td>
                <td className="px-3 py-3 text-right tabular-nums">{formatINR(i.price)}</td>
                <td className="hidden px-3 py-3 text-right text-forest sm:table-cell print:table-cell">
                  {i.discountPercent > 0 ? `${i.discountPercent}%` : "—"}
                </td>
                <td className="px-3 py-3 text-right font-medium tabular-nums">{formatINR(charged(i) * i.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="flex flex-col gap-6 px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-10">
        <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
          Prices are inclusive of all applicable taxes. Amounts include any bulk discounts.
        </p>
        <dl className="w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal ({units} {units === 1 ? "item" : "items"})</dt>
            <dd className="tabular-nums">{formatINR(gross)}</dd>
          </div>
          {savings > 0.005 && (
            <div className="flex justify-between text-forest">
              <dt>Bulk savings</dt>
              <dd className="tabular-nums">−{formatINR(savings)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t-2 border-forest pt-2 text-base font-bold">
            <dt>Total paid</dt>
            <dd className="tabular-nums">{formatINR(order.totalAmount)}</dd>
          </div>
        </dl>
      </section>

      <footer className="border-t border-line bg-sage-wash px-6 py-4 text-center text-xs text-forest sm:px-10 print:bg-white">
        Thank you for choosing {BUSINESS.name} — {BUSINESS.tagline.toLowerCase()}.
      </footer>
    </article>
  );
}
