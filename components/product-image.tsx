import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Renders the product's first Cloudinary image, or a branded fallback for
 * catalogue items that have no uploaded imagery yet (all seeded products).
 */
export function ProductImage({
  images,
  alt,
  className,
  sizes = "(max-width: 768px) 50vw, 320px",
  priority = false,
}: {
  images: string[];
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const src = images?.[0];

  if (!src) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-sand",
          className,
        )}
        aria-label={`${alt} — image coming soon`}
        role="img"
      >
        <div className="grain absolute inset-0" />
        <div className="relative flex flex-col items-center gap-2 text-terra-deep/70">
          <LeafMark className="h-9 w-9" />
          <span className="font-display text-sm tracking-wide">Viroeco</span>
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
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 19C9 15 13 11 17 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
