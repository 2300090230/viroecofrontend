"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

/**
 * Staggered entrance per the spec: y:20 / opacity:0 → settled, ease-out.
 * Micro-interaction layer (Framer Motion), kept off any element that also
 * carries a GSAP scroll animation.
 */
export function Reveal({
  delay = 0,
  children,
  ...props
}: { delay?: number } & HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
