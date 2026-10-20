"use client";

import { CONFETTI } from "@/data/hero";
import { motion } from "framer-motion";

const SHAPES = {
  square: {},
  circle: { borderRadius: "50%" },
  triangle: { clipPath: "polygon(50% 0, 0 100%, 100% 100%)" },
};

// One-shot confetti burst from any point inside a `relative` parent.
// `left` / `top` are CSS values (e.g. "50%"); reuses the hero's confetti pieces.
export default function ConfettiPop({
  fire,
  left = "50%",
  top = "50%",
  spread = 1.25,
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-40 overflow-visible"
      aria-hidden="true"
    >
      {CONFETTI.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            left,
            top,
            width: p.size,
            height: p.size,
            background: p.color,
            ...SHAPES[p.shape],
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
          animate={
            fire
              ? {
                  x: [0, p.x * spread, p.x * spread * 1.06],
                  y: [0, p.y * spread, (p.y + 60) * spread],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.8],
                  rotate: p.rot,
                }
              : undefined
          }
          transition={{
            duration: 1.6,
            ease: "easeOut",
            times: [0, 0.55, 1],
            delay: i * 0.012,
          }}
        />
      ))}
    </div>
  );
}
