"use client";

import StickerButton from "@/components/ui/StickerButton";
import { FRIENDS, HERO_COPY } from "@/data/hero";
import { COLORS, SPRINGS } from "@/data/theme";
import useReveal from "@/hooks/useReveal";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import HeroStage from "./HeroStage";

// faint topographic contour lines: the "map" feel behind the hero
function Topo() {
  const rings = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <svg
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-[0.09]"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke={COLORS.ink} strokeWidth="1.5">
        {rings.map((i) => (
          <ellipse
            key={`a${i}`}
            cx="860"
            cy="360"
            rx={110 + i * 62}
            ry={80 + i * 48}
            transform={`rotate(${-14 + i * 2.2} 860 360)`}
          />
        ))}
        {rings.map((i) => (
          <ellipse
            key={`b${i}`}
            cx="140"
            cy="700"
            rx={60 + i * 50}
            ry={40 + i * 34}
            transform={`rotate(${20 - i * 3} 140 700)`}
          />
        ))}
      </g>
    </svg>
  );
}

// hand-drawn coral loop around a word; draws itself with the page reveal
function Circled({ children }) {
  return (
    <span className="relative inline-block">
      {children}
      <svg
        viewBox="0 0 180 70"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-[-0.4em] top-[-0.15em] h-[calc(100%+0.3em)] w-[calc(100%+0.8em)] overflow-visible"
        aria-hidden="true"
      >
        <motion.path
          d="M14 36 C10 14 70 4 110 8 C165 13 176 50 118 60 C60 68 8 56 12 32"
          fill="none"
          stroke={COLORS.coral}
          strokeWidth="4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          variants={{
            hide: { pathLength: 0, opacity: 0 },
            show: {
              pathLength: 1,
              opacity: 1,
              transition: { delay: 0.9, duration: 0.7, ease: "easeInOut" },
            },
          }}
        />
      </svg>
    </span>
  );
}

// "takes 60 seconds" note with a scribbled arrow pointing at the button
function CtaNote({ children }) {
  return (
    <span className="pointer-events-none absolute left-[72%] top-[-3.1rem] hidden -rotate-3 flex-col items-start sm:flex">
      <span className="whitespace-nowrap font-scribble text-xl leading-none text-berry">
        {children}
      </span>
      <svg
        width="46"
        height="30"
        viewBox="0 0 46 30"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M40 3 C28 4 14 10 7 24 M7 24 L6 13 M7 24 L18 21"
          stroke={COLORS.berry}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function Hero() {
  const reduce = usePrefersReducedMotion();
  const loaderRevealed = useReveal();
  const revealed = loaderRevealed || !!reduce;

  const [landed, setLanded] = useState(() => FRIENDS.map(() => false));
  const onLand = useCallback(
    (i) =>
      setLanded((prev) =>
        prev[i] ? prev : prev.map((v, k) => (k === i ? true : v)),
      ),
    [],
  );

  // reduced motion: show the finished composition, no movement
  const shownLanded = reduce ? FRIENDS.map(() => true) : landed;
  const celebrate = !reduce && landed.every(Boolean);

  const container = {
    hide: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
  };
  const rise = reduce
    ? { hide: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hide: { y: 28, opacity: 0 },
        show: { y: 0, opacity: 1, transition: SPRINGS.soft },
      };

  const { eyebrow, headline, subhead, primaryCta, secondaryCta, notes } =
    HERO_COPY;

  return (
    <section className="relative isolate overflow-hidden bg-paper text-ink">
      <Topo />

      <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-12 px-5 pt-14 pb-28 sm:px-8 lg:grid-cols-[1.02fr_1fr] lg:gap-6 lg:py-20">
        {/* copy */}
        <motion.div
          className="relative z-10"
          variants={container}
          initial="hide"
          animate={revealed ? "show" : "hide"}
        >
          <motion.p
            variants={rise}
            className="inline-block -rotate-2 rounded-full border-2 border-ink bg-gold px-4 py-1 font-mono text-xs font-semibold uppercase tracking-wider shadow-[3px_3px_0_#2B1A17]"
          >
            {eyebrow}
          </motion.p>

          <h1 className="mt-6 font-display text-[clamp(2.7rem,6.4vw,5.2rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
            <motion.span variants={rise} className="block">
              {headline.first}
            </motion.span>
            <motion.span variants={rise} className="mt-1 block">
              {headline.before} <Circled>{headline.circled}</Circled>{" "}
              {headline.after}
            </motion.span>
          </h1>

          <motion.p
            variants={rise}
            className="mt-6 max-w-md text-lg leading-relaxed text-ink/80"
          >
            {subhead}
          </motion.p>

          <motion.div
            variants={rise}
            className="mt-10 flex flex-wrap items-center gap-4 sm:mt-16"
          >
            <div className="relative">
              <StickerButton href={primaryCta.href}>
                {primaryCta.label}
              </StickerButton>
              <CtaNote>{notes.cta}</CtaNote>
            </div>
            <StickerButton variant="secondary" href={secondaryCta.href}>
              {secondaryCta.label}
            </StickerButton>
          </motion.div>

          <motion.p
            variants={rise}
            className="mt-6 -rotate-1 font-scribble text-xl text-teal"
          >
            + {notes.extra}
          </motion.p>
        </motion.div>

        {/* art stage */}
        <HeroStage
          revealed={revealed}
          landed={shownLanded}
          onLand={onLand}
          celebrate={celebrate}
          reduce={!!reduce}
        />
      </div>
    </section>
  );
}
