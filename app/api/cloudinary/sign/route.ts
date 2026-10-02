import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Signs a direct browser → Cloudinary upload so the API secret never leaves the server.
// Product images are admin-only; avatars are allowed for any signed-in user.
export async function POST(req: Request) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary is not configured on the server." }, { status: 500 });
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const email = auth.user?.email?.toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Please log in to upload images." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const purpose = body?.purpose === "product" ? "product" : "avatar";

  let folder: string;
  if (purpose === "product") {
    const { data: profile } = await (supabase as any)
      .from("users")
      .select("role")
      .eq("gmail", email)
      .maybeSingle();
    if (profile?.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can upload product images." }, { status: 403 });
    }
    folder = "products";
  } else {
    folder = `avatars/${createHash("sha1").update(email).digest("hex").slice(0, 16)}`;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  // Cloudinary signature: alphabetically sorted params joined with &, then the secret appended.
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  return NextResponse.json({ cloudName, apiKey, folder, timestamp, signature });
}
