"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { cn } from "@/lib/cn";

type Direction = "up" | "down" | "left" | "right" | "none" | "scale" | "blur";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  duration?: number;
  once?: boolean;
  distance?: number;
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.75,
  once = true,
  distance = 40,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  const directionMap: Record<Direction, { x?: number; y?: number; scale?: number; filter?: string }> = {
    up:    { y: distance, x: 0 },
    down:  { y: -distance, x: 0 },
    left:  { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none:  { x: 0, y: 0 },
    scale: { scale: 0.9, y: 0, x: 0 },
    blur:  { filter: "blur(12px)", y: distance * 0.5, x: 0 },
  };

  const hidden = { opacity: 0, ...directionMap[direction] };
  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  };

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={hidden}
      animate={isInView ? visible : hidden}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
