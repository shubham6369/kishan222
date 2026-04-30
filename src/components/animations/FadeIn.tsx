"use client";

import { m, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  staggerChildren?: number;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.8,
  direction = "up",
  distance = 30,
  staggerChildren,
  className,
  ...props
}: FadeInProps) {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  const initial = directions[direction];

  return (
    <m.div
      initial={{ opacity: 0, ...initial }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren,
      }}
      className={className}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function StaggerContainer({
  children,
  staggerChildren = 0.1,
  className,
  ...props
}: {
  children: ReactNode;
  staggerChildren?: number;
  className?: string;
} & HTMLMotionProps<"div">) {
  return (
    <m.div
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true }}
      variants={{
        initial: {},
        whileInView: {
          transition: {
            staggerChildren,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </m.div>
  );
}
