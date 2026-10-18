"use client";

import { FONTS, SPRINGS } from "@/data/theme";
import { STAGE, STAMP_SIZE } from "@/data/hero";
import { motion } from "framer-motion";

// Passport-style stamp that thunks onto the page when a coin lands.
// Text and rings are sized in cqw (a share of the stage width), so they
// shrink together with the stamp instead of overflowing it on phones.
export default function Stamp({ stamp, amount, city, show, reduce }) {
  const { x, y, rot, color } = stamp;

  return (
    <motion.div
      className="pointer-events-none absolute z-30 flex aspect-square flex-col items-center justify-center rounded-full bg-paper text-center text-ink"
      style={{
        left: `${(x / STAGE.width) * 100}%`,
        top: `${(y / STAGE.height) * 100}%`,
        width: `${(STAMP_SIZE / STAGE.width) * 100}%`,
        x: "-50%",
        y: "-50%",
        border: `max(1.5px, 0.5cqw) dashed ${color}`,
        boxShadow: `inset 0 0 0 max(1.5px, 0.5cqw) #FFF6E8, inset 0 0 0 max(2.5px, 0.8cqw) ${color}`,
        fontFamily: FONTS.mono,
      }}
      initial={reduce ? false : { scale: 1.9, rotate: rot - 30, opacity: 0 }}
      animate={
        show
          ? {
              scale: 1,
              rotate: rot,
              opacity: 1,
              transition: reduce ? { duration: 0 } : SPRINGS.stamp,
            }
          : { scale: 1.9, rotate: rot - 30, opacity: 0 }
      }
    >
      <span
        className="font-bold leading-none"
        style={{ fontSize: "2.1cqw", letterSpacing: "-0.03em" }}
      >
        {amount}
      </span>
      <span
        className="mt-0.5 hidden font-semibold uppercase leading-none tracking-wider sm:block"
        style={{ color, fontSize: "max(6px, 1.1cqw)" }}
      >
        {city}
      </span>
    </motion.div>
  );
}
