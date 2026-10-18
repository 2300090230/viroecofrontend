"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/container";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  cta: { label: string; href: string };
  /** Real catalogue photos (first is the hero shot). Empty → decorative brand panel. */
  images: string[];
}

const INTERVAL_MS = 6000;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => clearInterval(t);
  }, [paused, count]);

  if (count === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative overflow-hidden bg-gradient-to-br from-sand via-cream to-sage-wash"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(index - 1);
        if (e.key === "ArrowRight") go(index + 1);
      }}
      onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
        touchStart.current = null;
      }}
    >
      <LeafPattern />

      <div className="relative grid min-h-[520px] sm:min-h-[480px] lg:min-h-[460px]">
        {slides.map((s, i) => (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            className={cn(
              "col-start-1 row-start-1 transition-[opacity,transform] ease-out",
              // Sequential fade: the outgoing slide clears before the incoming one appears, so text never overlaps.
              i === index
                ? "translate-x-0 opacity-100 duration-500 delay-300"
                : "pointer-events-none translate-x-4 opacity-0 duration-300",
            )}
          >
            <Container className="grid h-full items-center gap-8 py-10 lg:grid-cols-2 lg:gap-12 lg:py-12">
              <div className="max-w-xl">
                <span className="inline-flex rounded-md bg-forest px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  {s.eyebrow}
                </span>
                {i === 0 ? (
                  <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.05] text-forest-dark sm:text-5xl lg:text-6xl">
                    {s.title}
                  </h1>
                ) : (
                  <h2 className="font-display mt-5 text-4xl font-semibold leading-[1.05] text-forest-dark sm:text-5xl lg:text-6xl">
                    {s.title}
                  </h2>
                )}
                <p className="mt-4 text-base leading-relaxed text-ink/80 sm:text-lg">{s.text}</p>
                <Link
                  href={s.cta.href}
                  tabIndex={i === index ? 0 : -1}
                  className="mt-7 inline-flex h-12 items-center gap-2 rounded-md bg-forest px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
                >
                  {s.cta.label} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>

              <SlideVisual images={s.images} priority={i === 0} title={s.title} />
            </Container>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-md transition hover:bg-white sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-md transition hover:bg-white sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === index ? "w-7 bg-forest" : "w-2 bg-forest/25 hover:bg-forest/45",
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function SlideVisual({ images, priority, title }: { images: string[]; priority: boolean; title: string }) {
  if (images.length === 0) {
    return (
      <div className="relative hidden aspect-[4/3] items-center justify-center lg:flex">
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-sage-light to-camel-light" />
        <Image src="/logo.png" alt="" width={360} height={140} className="relative h-auto w-3/5 object-contain" />
      </div>
    );
  }

  const [main, ...rest] = images;
  return (
    <div className="relative mx-auto grid w-full max-w-xl grid-cols-3 grid-rows-2 gap-3 sm:gap-4">
      <Photo src={main} alt={title} priority={priority} className={rest.length ? "col-span-2 row-span-2" : "col-span-3 row-span-2"} />
      {rest.slice(0, 2).map((src) => (
        <Photo key={src} src={src} alt="" className="col-span-1 row-span-1" />
      ))}
    </div>
  );
}

function Photo({ src, alt, className, priority }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return (
    <div className={cn("relative aspect-square overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5", className)}>
      <Image src={src} alt={alt} fill unoptimized priority={priority} sizes="(max-width: 1024px) 60vw, 420px" className="object-cover" />
    </div>
  );
}

function LeafPattern() {
  return (
    <svg aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] text-forest/[0.05]" viewBox="0 0 200 200">
      <path fill="currentColor" d="M100 10c40 20 70 60 70 100 0 30-20 60-70 80C50 170 30 140 30 110 30 70 60 30 100 10Zm0 20C70 50 50 80 50 110c0 20 15 45 50 60 35-15 50-40 50-60 0-30-20-60-50-80Z" />
      <path fill="currentColor" d="M98 40h4v130h-4z" />
    </svg>
  );
}
