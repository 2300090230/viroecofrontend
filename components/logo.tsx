"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light";
  className?: string;
  imageClassName?: string;
  showTagline?: boolean;
  tagline?: string;
  asLink?: boolean;
  href?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({
  variant = "default",
  className,
  imageClassName,
  showTagline = false,
  tagline = "Sustainable Living",
  asLink = true,
  href = "/",
  size = "md",
}: LogoProps) {
  const isLight = variant === "light";

  const sizeClasses = {
    sm: "h-7 w-auto",
    md: "h-9 w-auto",
    lg: "h-11 w-auto",
    xl: "h-14 w-auto",
  };

  const imageSrc = isLight ? "/logo-light.png" : "/logo.png";

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      <div className="relative flex items-center">
        {/* Crisp logo graphic */}
        <Image
          src={imageSrc}
          alt="VIRO eco"
          width={180}
          height={64}
          priority
          className={cn(
            "object-contain transition-transform duration-300 group-hover:scale-[1.02]",
            sizeClasses[size],
            imageClassName
          )}
        />
      </div>
      {showTagline && (
        <div className="flex flex-col justify-center border-l pl-2.5 ml-1 border-current/20">
          <span
            className={cn(
              "text-[10px] uppercase font-bold tracking-widest leading-none",
              isLight ? "text-emerald-200/80" : "text-[#50644C]"
            )}
          >
            {tagline}
          </span>
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href={href} className="cursor-pointer inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
