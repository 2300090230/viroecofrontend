"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

const HEADLINE = ["Everyday", "objects,", "kinder", "to", "the", "earth."];

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-eyebrow", { opacity: 0, y: 16, duration: 0.6 })
        .from(
          ".hero-word",
          { opacity: 0, yPercent: 120, duration: 0.9, stagger: 0.08 },
          "-=0.2",
        )
        .from(".hero-sub", { opacity: 0, y: 16, duration: 0.6 }, "-=0.5")
        .from(".hero-cta", { opacity: 0, y: 16, duration: 0.5, stagger: 0.1 }, "-=0.3")
        .from(".hero-card", { opacity: 0, y: 30, duration: 0.8 }, "-=0.6");
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="grain relative overflow-hidden pt-28 pb-16 sm:pt-36">
      {/* organic warm wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-24 h-[38rem] w-[38rem] rounded-full bg-terra/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-40 h-[28rem] w-[28rem] rounded-full bg-moss/20 blur-3xl"
      />

      <Container className="relative grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="hero-eyebrow text-xs uppercase tracking-[0.25em] text-terra-deep">
            Home &amp; Kitchen · Rice husk &amp; bamboo
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            {HEADLINE.map((w, i) => (
              <span key={i} className="mr-[0.28em] inline-block overflow-hidden align-bottom">
                <span className="hero-word inline-block">{w}</span>
              </span>
            ))}
          </h1>
          <p className="hero-sub mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Drinkware and kitchen essentials pressed from rice husk and bamboo composite —
            unbreakable, microwave-safe, and quietly beautiful.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="hero-cta cursor-pointer">
              <Link href="/products">Shop the collection</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="hero-cta cursor-pointer border-foreground/20"
            >
              <Link href="#sustainability">Our materials</Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="hero-card relative ml-auto max-w-sm border border-border bg-card p-8">
            <div className="grain absolute inset-0" />
            <div className="relative">
              <p className="font-display text-2xl leading-snug">Low CO₂, by design.</p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Every piece replaces single-use plastic with a plant-based composite that
                composts back into the soil it came from.
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5">
                <div>
                  <dt className="text-xs uppercase tracking-widest text-muted-foreground">Material</dt>
                  <dd className="mt-1 font-display text-lg">Rice husk</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-muted-foreground">Finish</dt>
                  <dd className="mt-1 font-display text-lg">BPA-free</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
