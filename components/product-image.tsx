"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { normalizeImageUrls } from "@/lib/images";

export { normalizeImageUrls };

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
          "relative flex items-center justify-center overflow-hidden bg-sand",
          className,
        )}
        aria-label={`${alt} — image coming soon`}
        role="img"
      >
        <div className="grain absolute inset-0 opacity-20" />
        <div className="relative flex flex-col items-center gap-1.5 text-forest/60 p-2 text-center select-none">
          <LeafMark className="h-7 w-7 text-forest/50" />
          <span className="font-display text-xs font-semibold tracking-wide text-forest/70">VIRO eco</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-sand", className)}>
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
