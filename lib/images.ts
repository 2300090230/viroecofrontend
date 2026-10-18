// Pure helper shared by server and client components.

/**
 * Normalizes input image data into an array of clean URL strings.
 * Handles arrays, single strings, and semicolon/comma-separated strings.
 */
export function normalizeImageUrls(images: unknown): string[] {
  if (!images) return [];
  const cleanUrl = (url: unknown) => {
    if (typeof url !== "string") return "";
    let trimmed = url.trim();
    if (trimmed.includes("viroeco.eco") || trimmed.includes("Viroeco.eco")) {
      trimmed = trimmed.replace(/https?:\/\/(www\.)?viroeco\.eco/gi, "https://eha.eco");
    }
    return trimmed;
  };

  const isValidUrl = (url: string) =>
    url.length > 0 &&
    (url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("/") ||
      url.startsWith("data:image/"));

  if (Array.isArray(images)) {
    return images
      .flatMap((item) => (typeof item === "string" ? item.split(/[;,]/) : []))
      .map(cleanUrl)
      .filter(isValidUrl);
  }
  if (typeof images === "string") {
    return images
      .split(/[;,]/)
      .map(cleanUrl)
      .filter(isValidUrl);
  }
  return [];
}
