import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const amount = Number(body.amount) || 0;
    const currency = body.currency || "INR";
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_jVej2lE9ffasi1";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "7MrYfpK5LmPzhg1jsM31kVlJ";

    if (amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Attempt to create real Razorpay order on Razorpay servers
    try {
      const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          amount: Math.round(amount),
          currency,
          receipt: `rcpt_${Date.now()}`,
          payment_capture: 1,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          keyId,
          amount: data.amount,
          currency: data.currency,
          razorpayOrderId: data.id,
        });
      } else {
        const errText = await res.text();
        console.warn("Razorpay API order creation non-200 response:", errText);
      }
    } catch (apiErr) {
      console.warn("Direct Razorpay API order creation failed:", apiErr);
    }

    // Fallback for test mode: return keyId & amount without an invalid order ID
    // so Razorpay Checkout JS operates in standard client checkout mode without breaking.
    return NextResponse.json({
      keyId,
      amount: Math.round(amount),
      currency,
      razorpayOrderId: null,
    });
  } catch (err: any) {
    console.error("Order creation route error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
