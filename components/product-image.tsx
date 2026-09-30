"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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

  if (Array.isArray(images)) {
    return images
      .flatMap((item) => (typeof item === "string" ? item.split(/[;,]/) : []))
      .map(cleanUrl)
      .filter((url) => url.length > 0 && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")));
  }
  if (typeof images === "string") {
    return images
      .split(/[;,]/)
      .map(cleanUrl)
      .filter((url) => url.length > 0 && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")));
  }
  return [];
}

/**
 * Renders the product's primary image immediately with smooth fallback
 * if image is loading, broken, or unavailable.
 */
export function ProductImage({
  images,
  alt,
  className,
  sizes = "(max-width: 768px) 50vw, 320px",
  priority = false,
}: {
  images: string[] | string | undefined | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [hasError, setHasError] = useState(false);
  const normalized = normalizeImageUrls(images);
  const src = normalized[0];

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-[#F5EFE6]",
          className,
        )}
        aria-label={`${alt} — image coming soon`}
        role="img"
      >
        <div className="grain absolute inset-0 opacity-20" />
        <div className="relative flex flex-col items-center gap-1.5 text-[#50644C]/60 p-2 text-center select-none">
          <LeafMark className="h-7 w-7 text-[#50644C]/50" />
          <span className="font-display text-xs font-semibold tracking-wide text-[#50644C]/70">Viroeco</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-[#F5EFE6]", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized
        onError={() => setHasError(true)}
        className="object-cover"
      />
    </div>
  );
}

function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 20C4 12 10 5 20 4C19 14 13 20 5 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 19C9 15 13 11 17 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
