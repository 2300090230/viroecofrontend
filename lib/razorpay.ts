export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (r: RazorpayResult) => void;
  modal?: { ondismiss?: () => void };
}

export interface RazorpayResult {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayCtor {
  new (options: RazorpayOptions): { open: () => void };
}

declare global {
  interface Window {
    Razorpay?: RazorpayCtor;
  }
}

const SRC = "https://checkout.razorpay.com/v1/checkout.js";

/** Loads the Razorpay checkout script once and resolves its constructor. */
export function loadRazorpay(): Promise<RazorpayCtor> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(window.Razorpay);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
    const onload = () =>
      window.Razorpay ? resolve(window.Razorpay) : reject(new Error("Razorpay failed to load"));
    if (existing) {
      existing.addEventListener("load", onload, { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = SRC;
    s.onload = onload;
    s.onerror = () => reject(new Error("Could not reach Razorpay"));
    document.body.appendChild(s);
  });
}
