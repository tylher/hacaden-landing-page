"use client";

import Avatar from "@/components/hero/Avatar";
import { FRIENDS } from "@/data/hero";
import { COLORS, FONTS, SPRINGS } from "@/data/theme";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaCheckDouble, FaHeart } from "react-icons/fa";

const BY_ID = Object.fromEntries(FRIENDS.map((f) => [f.id, f]));

function MiniAvatar({ id, size = 28 }) {
  return (
    <div
      className="shrink-0 overflow-hidden rounded-full border-2 border-ink bg-white"
      style={{ width: size, height: size }}
    >
      <Avatar look={BY_ID[id].look} />
    </div>
  );
}

// taped-on card that holds each illustration
function MockShell({ children, tilt = -1.5, tape = COLORS.gold }) {
  return (
    <div
      className="relative mx-auto w-full max-w-md"
      style={{ rotate: `${tilt}deg` }}
    >
      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-2 rounded-sm shadow-[1px_1px_0_#2B1A17]"
        style={{ background: tape, opacity: 0.92 }}
      />
      <div className="overflow-hidden rounded-3xl border-2 border-ink bg-paper text-ink shadow-[8px_8px_0_#2B1A17]">
        {children}
      </div>
    </div>
  );
}

/* ---------------- step 1: start a pool ---------------- */
export function FormMock({ data }) {
  const reduce = usePrefersReducedMotion();
  const last = data.fields.length - 1;

  return (
    <MockShell tilt={-1.5} tape={COLORS.coral}>
      <div className="border-b-2 border-ink bg-white px-5 py-3 font-display text-lg font-extrabold">
        {data.title}
      </div>
      <div className="space-y-4 px-5 py-5">
        {data.fields.map((f, i) => (
          <div key={f.label}>
            <p className="text-xs font-bold uppercase tracking-wide text-ink/60">
              {f.label}
            </p>
            <div className="mt-1 flex items-center rounded-xl border-2 border-ink bg-white px-3 py-2.5 text-[15px] font-semibold">
              {/* the value "types" itself in when the card scrolls into view */}
              <motion.span
                className={`inline-block overflow-hidden whitespace-nowrap ${f.mono ? "font-mono" : ""}`}
                initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{
                  duration: 0.8,
                  delay: 0.3 + i * 0.5,
                  ease: "easeOut",
                }}
              >
                {f.value}
              </motion.span>
              {i === last && (
                <motion.span
                  aria-hidden="true"
                  className="ml-0.5 inline-block h-4 w-0.5 bg-ink"
                  animate={reduce ? undefined : { opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
          </div>
        ))}
        <div className="grid min-h-12 place-items-center rounded-full border-2 border-ink bg-coral font-display font-bold shadow-[4px_4px_0_#2B1A17]">
          {data.button}
        </div>
      </div>
    </MockShell>
  );
}

/* ---------------- step 2: share one link ---------------- */
export function ShareMock({ data }) {
  const reduce = usePrefersReducedMotion();

  const list = {
    hide: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.35, delayChildren: 0.3 },
    },
  };
  const pop = reduce
    ? { hide: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hide: { opacity: 0, y: 14, scale: 0.92 },
        show: { opacity: 1, y: 0, scale: 1, transition: SPRINGS.pop },
      };

  return (
    <MockShell tilt={1.2} tape={COLORS.gold}>
      <div className="border-b-2 border-ink bg-white px-5 py-3 font-display text-lg font-extrabold">
        {data.chatTitle}
      </div>

      <motion.ul
        className="space-y-3 px-4 py-5"
        variants={list}
        initial="hide"
        whileInView="show"
        viewport={{ once: true, margin: "-15%" }}
      >
        {/* the organizer shares the link */}
        <motion.li
          variants={pop}
          className="flex flex-row-reverse items-start gap-2"
        >
          <MiniAvatar id={data.from} />
          <div className="min-w-0 max-w-[85%] text-right">
            <div className="inline-block rounded-2xl border-2 border-ink bg-gold px-3 py-2 text-left text-[15px] leading-snug">
              {data.text}
              <span className="mt-2 flex items-center gap-3 rounded-xl border-2 border-ink bg-white p-2.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border-2 border-ink bg-coral">
                  <FaHeart aria-hidden="true" className="text-paper" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-sm font-extrabold leading-tight">
                    {data.link.title}
                  </span>
                  <span
                    className="block truncate text-[11px] leading-tight text-ink/60"
                    style={{ fontFamily: FONTS.mono }}
                  >
                    {data.link.url}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-bold leading-tight text-teal">
                    {data.link.caption}
                  </span>
                </span>
              </span>
            </div>
          </div>
        </motion.li>

        {/* and the replies are one word each */}
        {data.replies.map((r, i) => (
          <motion.li key={i} variants={pop} className="flex items-center gap-2">
            <MiniAvatar id={r.from} />
            <span className="flex items-center gap-2 rounded-2xl border-2 border-ink bg-white px-3 py-2 text-[15px] leading-snug">
              {r.text}
              <FaCheckDouble
                aria-hidden="true"
                className="text-teal"
                size={12}
              />
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </MockShell>
  );
}

/* ---------------- step 3: everyone chips in ---------------- */
export function TrackMock({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduce = usePrefersReducedMotion();
  const [count, setCount] = useState(data.from);

  // count up from where the pool started to where it is now
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setCount(data.count);
      return;
    }
    const controls = animate(data.from, data.count, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, data.from, data.count]);

  const pct = Math.min(100, (count / data.total) * 100);

  return (
    <MockShell tilt={-1} tape={COLORS.teal}>
      <div ref={ref}>
        <div className="border-b-2 border-ink bg-white px-5 py-3">
          <p
            className="text-[10px] font-semibold uppercase leading-none tracking-wider text-ink/60"
            style={{ fontFamily: FONTS.mono }}
          >
            {data.title}
          </p>
          <p className="mt-1.5 flex items-baseline gap-1.5 font-display text-2xl font-extrabold leading-none">
            <span style={{ fontFamily: FONTS.mono }}>{count}</span>
            <span className="text-base font-bold">of {data.total} are in</span>
          </p>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#E8E2D9]">
            <div
              className="h-full rounded-full transition-[width] duration-150 ease-out"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${COLORS.coral}, ${COLORS.gold})`,
              }}
            />
          </div>
        </div>

        <ul className="space-y-2.5 px-4 py-4">
          {data.feed.map((row, i) => (
            <motion.li
              key={row.who}
              className="flex items-center gap-2.5 rounded-xl border-2 border-ink bg-white px-3 py-2"
              initial={reduce ? false : { opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={
                reduce
                  ? { duration: 0 }
                  : { ...SPRINGS.soft, delay: 0.5 + i * 0.3 }
              }
            >
              <MiniAvatar id={row.who} size={30} />
              <span className="text-sm font-bold">{BY_ID[row.who].name}</span>
              <span className="rounded-full border-[1.5px] border-ink bg-paper px-2 py-0.5 text-[10px] font-semibold leading-none">
                {row.city}
              </span>
              <span
                className="ml-auto text-sm font-bold"
                style={{ fontFamily: FONTS.mono }}
              >
                {row.amount}
              </span>
            </motion.li>
          ))}
        </ul>

        <div className="border-t-2 border-ink bg-white px-4 py-3">
          <div className="grid min-h-11 place-items-center rounded-full border-2 border-ink bg-coral font-display font-bold shadow-[3px_3px_0_#2B1A17]">
            {data.cta}
          </div>
          <p className="mt-2 text-center text-[11px] text-ink/60">
            {data.foot}
          </p>
        </div>
      </div>
    </MockShell>
  );
}
