"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.65, 0, 0.35, 1] as const;

/* Fade + rise on scroll into view */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* Line-mask title reveal */
export function MaskLines({
  lines,
  className = "",
  delay = 0,
  stagger = 0.12,
  as: Tag = "h2",
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}) {
  const reduced = useReducedMotion();
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="block will-change-transform"
            initial={reduced ? false : { y: "112%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.05, delay: delay + i * stagger, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* Image reveal with subtle scale */
export function RevealImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  fill = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fill?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={reduced ? false : { opacity: 0, scale: 1.07 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      {fill ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={`h-full w-full object-cover ${imgClassName}`} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={`w-full ${imgClassName}`} />
      )}
    </motion.div>
  );
}

/* Parallax drift (subtle) */
export function Drift({
  children,
  amount = 30,
  className = "",
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="top"
      whileInView="in"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: EASE }}
      variants={{ top: { y: amount }, in: { y: 0 } }}
    >
      {children}
    </motion.div>
  );
}
