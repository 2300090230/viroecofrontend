"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ProductImage, normalizeImageUrls } from "@/components/product-image";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, alt }: { images: string[] | string | undefined | null; alt: string }) {
  const [active, setActive] = useState(0);
  const [erroredIndices, setErroredIndices] = useState<Record<number, boolean>>({});

  const validImages = normalizeImageUrls(images);

  if (validImages.length === 0 || erroredIndices[active]) {
    return <ProductImage images={[]} alt={alt} className="aspect-square w-full border border-[#DFD5C6] rounded-none" priority />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden border border-[#DFD5C6] rounded-none bg-[#F5EFE6]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={validImages[active]}
              alt={alt}
              fill
              sizes="(max-width:768px) 100vw, 560px"
              priority
              unoptimized
              className="object-cover"
              onError={() => setErroredIndices((prev) => ({ ...prev, [active]: true }))}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {validImages.length > 1 && (
        <div className="flex flex-wrap gap-2.5">
          {validImages.map((src, i) => (
            <button
              key={`${src}-${i}`}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative h-16 w-16 cursor-pointer overflow-hidden rounded-none border transition-all bg-[#F5EFE6]",
                i === active ? "border-[#50644C] ring-2 ring-[#50644C]/20" : "border-[#DFD5C6] hover:border-[#50644C]/50",
              )}
            >
              {!erroredIndices[i] ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="64px"
                  unoptimized
                  className="object-cover"
                  onError={() => setErroredIndices((prev) => ({ ...prev, [i]: true }))}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-[#50644C]/60">
                  Viroeco
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
