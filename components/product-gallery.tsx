"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/components/product-image";
import { normalizeImageUrls } from "@/lib/images";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, alt }: { images: string[] | string | undefined | null; alt: string }) {
  const [active, setActive] = useState(0);
  const [errored, setErrored] = useState<Record<number, boolean>>({});
  const valid = normalizeImageUrls(images);

  if (valid.length === 0 || errored[active]) {
    return <ProductImage images={[]} alt={alt} className="aspect-square w-full rounded-xl border border-line" priority />;
  }

  const go = (dir: 1 | -1) => setActive((i) => (i + dir + valid.length) % valid.length);

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {valid.length > 1 && (
        <div className="scrollbar-none flex gap-2.5 overflow-x-auto sm:max-h-[560px] sm:w-20 sm:flex-col sm:overflow-y-auto">
          {valid.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-sand transition-all sm:w-20",
                i === active ? "border-forest" : "border-transparent opacity-80 hover:opacity-100 hover:border-line-strong",
              )}
            >
              {!errored[i] && (
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="80px"
                  unoptimized
                  className="object-cover"
                  onError={() => setErrored((p) => ({ ...p, [i]: true }))}
                />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="group relative aspect-square w-full flex-1 overflow-hidden rounded-xl border border-line bg-sand">
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
              src={valid[active]}
              alt={alt}
              fill
              sizes="(max-width:1024px) 100vw, 560px"
              priority
              unoptimized
              className="object-cover"
              onError={() => setErrored((p) => ({ ...p, [active]: true }))}
            />
          </motion.div>
        </AnimatePresence>
        {valid.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-md transition-opacity group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-md transition-opacity group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
