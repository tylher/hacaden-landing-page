"use client";

import { motion } from "framer-motion";
import { COLORS, FONTS, SPRINGS } from "@/data/theme";
import { STAGE, TRACKER } from "@/data/hero";

// Luggage-tag progress card: the one UI-like element in the hero.
export default function TrackerTag({ count, show, reduce }) {
  const pct = Math.min(100, (count / TRACKER.total) * 100);

  return (
    <motion.div
      className="absolute z-30"
      style={{
        left: `${(TRACKER.x / STAGE.width) * 100}%`,
        top: `${(TRACKER.y / STAGE.height) * 100}%`,
        width: `${(TRACKER.w / STAGE.width) * 100}%`,
        minWidth: "9.5rem",
        x: "-50%",
        y: "-50%",
      }}
      initial={reduce ? false : { y: "-250%", rotate: -12, opacity: 0 }}
      animate={show ? { y: "-50%", rotate: -3, opacity: 1 } : undefined}
      transition={reduce ? { duration: 0 } : { ...SPRINGS.pop, delay: 0.5 }}
    >
      <div
        className="relative rounded-2xl border-2 border-ink bg-paper py-2.5 pl-9 pr-3"
        style={{ boxShadow: `4px 4px 0 ${COLORS.ink}` }}
      >
        {/* string hole */}
        <span className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-ink bg-gold" />

        <p
          className="text-[10px] font-semibold uppercase leading-none tracking-wider text-ink/70"
          style={{ fontFamily: FONTS.mono }}
        >
          {TRACKER.title}
        </p>

        <p className="mt-1 flex items-baseline gap-1 font-display text-lg font-extrabold leading-none text-ink sm:text-xl">
          <motion.span
            key={count}
            initial={reduce ? false : { y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={SPRINGS.stamp}
            style={{ fontFamily: FONTS.mono }}
            className="inline-block"
          >
            {count}
          </motion.span>
          <span className="text-sm font-bold">of {TRACKER.total} are in</span>
        </p>

        {/* progress bar: coral to gold, same as the app design system */}
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8E2D9]">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${COLORS.coral}, ${COLORS.gold})`,
            }}
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
