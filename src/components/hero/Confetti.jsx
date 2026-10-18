"use client";

import { CONFETTI, GIFT, STAGE } from "@/data/hero";
import { motion } from "framer-motion";
import { useRef } from "react";

const SHAPES = {
  square: {},
  circle: { borderRadius: "50%" },
  triangle: { clipPath: "polygon(50% 0, 0 100%, 100% 100%)" },
};

// One-shot confetti burst from the gift when the last coin lands.
// Distances scale with the stage width, so phones don't get a huge spill.
export default function Confetti({ fire }) {
  const ref = useRef(null);
  const scale = ref.current ? ref.current.offsetWidth / STAGE.width : 1;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-40"
      aria-hidden="true"
    >
      {CONFETTI.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            left: `${(GIFT.x / STAGE.width) * 100}%`,
            top: `${(GIFT.y / STAGE.height) * 100}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            ...SHAPES[p.shape],
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
          animate={
            fire
              ? {
                  x: [0, p.x * scale, p.x * scale * 1.06],
                  y: [0, p.y * scale, (p.y + 60) * scale], // burst out, then drift down
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.8],
                  rotate: p.rot,
                }
              : undefined
          }
          transition={{
            duration: 1.5,
            ease: "easeOut",
            times: [0, 0.55, 1],
            delay: i * 0.012,
          }}
        />
      ))}
    </div>
  );
}
