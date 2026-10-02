// Browser-side Cloudinary upload using a server-issued signature (app/api/cloudinary/sign).
export async function uploadToCloudinary(
  file: File,
  purpose: "product" | "avatar",
): Promise<string> {
  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ purpose }),
  });
  const sign = await signRes.json().catch(() => ({}));
  if (!signRes.ok) throw new Error(sign.error || "Could not authorize image upload.");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sign.apiKey);
  form.append("timestamp", String(sign.timestamp));
  form.append("folder", sign.folder);
  form.append("signature", sign.signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.secure_url) {
    throw new Error(data?.error?.message || `Failed to upload ${file.name} to Cloudinary.`);
  }
  return data.secure_url as string;
}

export async function uploadManyToCloudinary(
  files: File[],
  purpose: "product" | "avatar",
): Promise<string[]> {
  return Promise.all(files.map((f) => uploadToCloudinary(f, purpose)));
}
