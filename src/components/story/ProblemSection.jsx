"use client";

import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { PROBLEM } from "@/data/story";
import { SPRINGS } from "@/data/theme";
import { motion } from "framer-motion";
import ChatCard from "./ChatCard";

const TILTS = [-1.2, 0.8, -0.6];

/**
 * Story beat 2: "wait, rewind." The hero showed the happy ending; this shows
 * how group gifts usually go. Sits on Lagoon Teal, so the page changes mood
 * through the torn seam instead of an abrupt cut.
 */
export default function ProblemSection() {
  const reduce = usePrefersReducedMotion();
  const { eyebrow, headline, body, points } = PROBLEM;

  const list = { hide: {}, show: { transition: { staggerChildren: 0.14 } } };
  const rise = reduce
    ? { hide: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hide: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: SPRINGS.soft },
      };

  return (
    <section
      id="problem"
      className="relative isolate overflow-hidden bg-teal text-paper"
    >
      {/* faint dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,246,232,0.12) 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="mx-auto grid max-w-7xl gap-16 px-5 pb-32 pt-32 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-10 lg:pt-40">
        <motion.div
          variants={list}
          initial="hide"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.p
            variants={rise}
            className="inline-block rotate-2 rounded-full border-2 border-ink bg-gold px-4 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-ink shadow-[3px_3px_0_#2B1A17]"
          >
            {eyebrow}
          </motion.p>

          <motion.h2
            variants={rise}
            className="mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[1.03] tracking-[-0.03em]"
          >
            {headline.before}{" "}
            <span className="relative inline-block px-2 text-ink">
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 -skew-x-6 rounded-md bg-gold"
              />
              {headline.highlight}
            </span>
          </motion.h2>

          <motion.p
            variants={rise}
            className="mt-6 max-w-md text-lg leading-relaxed text-paper/90"
          >
            {body}
          </motion.p>

          <ul className="mt-9 space-y-4">
            {points.map((p, i) => (
              <motion.li
                key={p.title}
                variants={rise}
                style={{ rotate: TILTS[i] }}
                className="flex max-w-md items-start gap-4 rounded-2xl border-2 border-ink bg-paper p-4 text-ink shadow-[4px_4px_0_#2B1A17]"
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink font-mono text-base font-bold"
                  style={{ background: p.color, color: p.numeralColor }}
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-extrabold leading-tight">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-[15px] leading-snug text-ink/75">
                    {p.text}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <ChatCard />
      </div>
    </section>
  );
}
