"use client";

import MiniAvatar from "@/components/ui/MiniAvatar";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { FRIENDS, GROUP } from "@/data/hero";
import { REVEAL, WAITLIST } from "@/data/story";
import { COLORS, FONTS, SPRINGS } from "@/data/theme";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import ConfettiPop from "./ConfettiPop";
import WaitlistForm from "./WaitlistForm";

const BY_ID = Object.fromEntries(FRIENDS.map((f) => [f.id, f]));
const NOTES = REVEAL.notes;
const LEFT_NOTES = [NOTES[0], NOTES[2], NOTES[4]];
const RIGHT_NOTES = [NOTES[1], NOTES[3]];

// sticky note from one of the friends
function Note({ note, variants, reduce }) {
  const f = BY_ID[note.from];
  return (
    <motion.li
      variants={variants}
      whileHover={reduce ? undefined : { rotate: note.tilt + 3, scale: 1.03 }}
      style={{ rotate: note.tilt, background: note.bg }}
      className="relative rounded-md border-2 border-ink p-4 pt-5 text-ink shadow-[5px_5px_0_#2B1A17]"
    >
      <span
        aria-hidden="true"
        className="absolute -top-2.5 left-1/2 h-5 w-14 -translate-x-1/2 -rotate-3 rounded-sm bg-ink/15"
      />
      <p className="font-scribble text-2xl leading-[1.1]">{note.text}</p>
      <div className="mt-3 flex items-center gap-2">
        <MiniAvatar id={note.from} size={26} />
        <span
          className="text-[11px] font-semibold uppercase tracking-wide"
          style={{ fontFamily: FONTS.mono }}
        >
          {f.name} · {f.city}
        </span>
      </div>
    </motion.li>
  );
}

// "+7 more people": the rest of the crowd
function MoreSticker({ variants, reduce }) {
  return (
    <motion.li
      variants={variants}
      whileHover={reduce ? undefined : { rotate: 4, scale: 1.05 }}
      style={{ rotate: -4 }}
      className="grid place-items-center rounded-full border-2 border-ink bg-ink px-6 py-7 text-center text-paper shadow-[5px_5px_0_#FFF6E8]"
    >
      <span className="font-display text-2xl font-extrabold leading-tight">
        {REVEAL.more}
      </span>
    </motion.li>
  );
}

// the page Theo sees when he opens the link
function RevealCard({ reduce }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const { card } = REVEAL;

  return (
    <motion.div
      ref={ref}
      className="relative mx-auto w-full max-w-sm"
      initial={reduce ? false : { opacity: 0, y: 48, scale: 0.92, rotate: 4 }}
      animate={
        inView ? { opacity: 1, y: 0, scale: 1, rotate: -1.5 } : undefined
      }
      transition={reduce ? { duration: 0 } : SPRINGS.pop}
    >
      <ConfettiPop fire={inView && !reduce} left="50%" top="18%" />

      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rotate-2 rounded-sm bg-gold shadow-[1px_1px_0_#2B1A17]"
      />

      <div className="overflow-hidden rounded-3xl border-2 border-ink bg-paper text-ink shadow-[8px_8px_0_#2B1A17]">
        <div className="flex items-center justify-between border-b-2 border-ink bg-white px-5 py-3">
          <span
            className="text-[11px] font-semibold uppercase tracking-wider text-ink/70"
            style={{ fontFamily: FONTS.mono }}
          >
            {card.label}
          </span>
          <span className="font-display text-base font-extrabold">
            haca<span className="text-coral">den</span>
          </span>
        </div>

        {/* the same photo from the hero: everyone who showed up */}
        <div className="bg-sky/40 px-6 pb-3 pt-6">
          <Image
            src={GROUP.src}
            alt={GROUP.alt}
            width={GROUP.width}
            height={GROUP.height}
            sizes="(min-width: 1024px) 280px, 70vw"
            className="mx-auto h-auto w-[80%] select-none"
            draggable={false}
          />
        </div>

        <div className="px-5 pb-5 pt-4">
          <h3 className="font-display text-3xl font-extrabold leading-tight tracking-[-0.02em]">
            {card.title}
          </h3>
          <p className="mt-1 text-[15px] text-ink/70">{card.sub}</p>

          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-display text-base font-extrabold">
              {card.count}
            </span>
            <span
              className="text-sm font-bold"
              style={{ fontFamily: FONTS.mono }}
            >
              {card.total}
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#E8E2D9]">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${COLORS.coral}, ${COLORS.gold})`,
              }}
              initial={reduce ? false : { width: "0%" }}
              animate={{ width: inView || reduce ? "100%" : "0%" }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 1.4, ease: "easeOut", delay: 0.4 }
              }
            />
          </div>
          <p className="mt-1 text-right text-[11px] text-ink/60">
            {card.totalLabel}
          </p>

          <div className="mt-4 grid min-h-12 place-items-center rounded-full border-2 border-ink bg-coral font-display font-bold shadow-[4px_4px_0_#2B1A17]">
            {card.button}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// short dotted trail that ends with a coin landing on the waitlist card
function DropTrail({ reduce }) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const d = "M48 0 C 18 26, 78 54, 48 92";
  const on = inView || reduce;

  return (
    <div ref={ref} aria-hidden="true" className="relative mx-auto h-24 w-24">
      <svg
        viewBox="0 0 96 96"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <mask
            id={`${uid}-m`}
            maskUnits="userSpaceOnUse"
            x="-20"
            y="-10"
            width="140"
            height="120"
          >
            <motion.path
              d={d}
              fill="none"
              stroke="white"
              strokeWidth={16}
              strokeLinecap="round"
              initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
              animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
              transition={{
                duration: 1.1,
                ease: "easeInOut",
                opacity: { duration: 0.01 },
              }}
            />
          </mask>
        </defs>
        <path
          d={d}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="0.1 13"
          mask={`url(#${uid}-m)`}
        />
      </svg>
      <motion.span
        className="absolute -bottom-2 left-1/2 z-20 grid h-[26px] w-[26px] place-items-center rounded-full border-[3px] border-ink bg-gold"
        style={{ x: "-50%" }}
        initial={reduce ? false : { scale: 0 }}
        animate={on ? { scale: [0, 1.4, 1] } : undefined}
        transition={reduce ? { duration: 0 } : { delay: 1.0, duration: 0.5 }}
      >
        <span className="h-2 w-2 rounded-full bg-ink" />
      </motion.span>
    </div>
  );
}

/**
 * Story beat 4: the payoff. Theo opens the link and sees everyone who showed
 * up. The trail then drops into the waitlist card: the last stop is the reader.
 */
export default function RevealSection() {
  const reduce = usePrefersReducedMotion();
  const [joined, setJoined] = useState(false);
  const { eyebrow, headline, body } = REVEAL;

  const head = { hide: {}, show: { transition: { staggerChildren: 0.14 } } };
  const rise = reduce
    ? { hide: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hide: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: SPRINGS.soft },
      };
  const list = (delay) => ({
    hide: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.18, delayChildren: delay },
    },
  });
  const pop = reduce
    ? { hide: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hide: { opacity: 0, y: 24, scale: 0.9 },
        show: { opacity: 1, y: 0, scale: 1, transition: SPRINGS.pop },
      };

  return (
    <section
      id="reveal"
      className="relative isolate overflow-hidden bg-coral text-ink"
    >
      {/* faint dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(rgba(43,26,23,0.10) 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="mx-auto max-w-7xl px-5 pb-36 pt-32 sm:px-8 lg:pt-40">
        <motion.header
          className="mx-auto max-w-2xl text-center"
          variants={head}
          initial="hide"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.p
            variants={rise}
            className="inline-block rotate-2 rounded-full border-2 border-ink bg-paper px-4 py-1 font-mono text-xs font-semibold uppercase tracking-wider shadow-[3px_3px_0_#2B1A17]"
          >
            {eyebrow}
          </motion.p>

          <motion.h2
            variants={rise}
            className="mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[1.03] tracking-[-0.03em]"
          >
            {headline.before}{" "}
            <span className="relative inline-block px-2">
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 -skew-x-6 rounded-md bg-paper"
              />
              {headline.highlight}
            </span>
          </motion.h2>

          <motion.p
            variants={rise}
            className="mt-6 text-lg leading-relaxed text-ink/85"
          >
            {body}
          </motion.p>
        </motion.header>

        {/* the reveal board: Theo's page in the middle, messages all around */}
        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-[1fr_minmax(0,22rem)_1fr] lg:items-center lg:gap-10">
          <div className="order-first lg:order-none lg:col-start-2 lg:row-start-1">
            <RevealCard reduce={reduce} />
          </div>

          <motion.ul
            className="grid gap-8 sm:grid-cols-2 lg:col-start-1 lg:row-start-1 lg:block lg:space-y-10"
            variants={list(0.2)}
            initial="hide"
            whileInView="show"
            viewport={{ once: true, margin: "-10%" }}
          >
            {LEFT_NOTES.map((n) => (
              <Note key={n.from} note={n} variants={pop} reduce={reduce} />
            ))}
          </motion.ul>

          <motion.ul
            className="grid gap-8 sm:grid-cols-2 lg:col-start-3 lg:row-start-1 lg:block lg:space-y-10"
            variants={list(0.5)}
            initial="hide"
            whileInView="show"
            viewport={{ once: true, margin: "-10%" }}
          >
            {RIGHT_NOTES.map((n) => (
              <Note key={n.from} note={n} variants={pop} reduce={reduce} />
            ))}
            <MoreSticker variants={pop} reduce={reduce} />
          </motion.ul>
        </div>

        {/* last stop: the reader */}
        <div id="waitlist" className="mx-auto mt-24 max-w-2xl scroll-mt-16">
          <DropTrail reduce={reduce} />

          <motion.div
            className="relative -mt-3 rounded-3xl border-2 border-ink bg-paper p-6 text-ink shadow-[8px_8px_0_#2B1A17] sm:p-8"
            initial={reduce ? false : { opacity: 0, y: 36, rotate: -3 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={reduce ? { duration: 0 } : SPRINGS.soft}
          >
            <ConfettiPop fire={joined} left="50%" top="0%" />

            <p className="inline-block -rotate-2 rounded-full border-2 border-ink bg-gold px-4 py-1 font-mono text-xs font-semibold uppercase tracking-wider shadow-[3px_3px_0_#2B1A17]">
              {WAITLIST.eyebrow}
            </p>
            <h3 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              {WAITLIST.title}
            </h3>
            <p className="mt-3 max-w-lg text-lg leading-relaxed text-ink/80">
              {WAITLIST.body}
            </p>

            <div className="mt-6">
              <WaitlistForm onJoined={() => setJoined(true)} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
