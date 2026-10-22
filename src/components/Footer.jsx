"use client";

import StickerButton from "@/components/ui/StickerButton";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { FOOTER } from "@/data/story";
import { COLORS, FONTS, LOGO, SPRINGS } from "@/data/theme";
import {
  FULL_FILL,
  LOGO_H,
  LOGO_W,
  buildFillPath,
  buildWavePoints,
} from "@/components/ui/waves";
import { motion, useInView } from "framer-motion";
import { useEffect, useId, useRef } from "react";
import { FaArrowUp, FaHeart } from "react-icons/fa";

const LETTERS = ["h", "a", "c", "a", "d", "e", "n"];
const HEART_INDEX = 3;
const FILL_MS = 2200;

/**
 * The logo as a die-cut sticker, ringed by turning text. When the footer
 * scrolls into view the logo fills up like water, the same way it did in
 * the loader at the very start, so the page ends where it began.
 */
function LogoBadge({ reduce }) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef(null);
  const waveRef = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    const wave = waveRef.current;
    if (!wave) return;
    if (reduce) {
      wave.setAttribute("d", FULL_FILL);
      return;
    }
    if (!inView) return;

    let raf;
    let last = performance.now();
    const start = last;
    let phase = 0;

    const frame = (now) => {
      const t = Math.min(1, (now - start) / FILL_MS);
      const level = 1 - Math.pow(1 - t, 3);
      phase += ((now - last) / 1000) * 3.6;
      last = now;
      if (t >= 1) {
        wave.setAttribute("d", FULL_FILL);
        return;
      }
      wave.setAttribute(
        "d",
        buildFillPath(buildWavePoints(level, 10 * (1 - level) + 2, phase)),
      );
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce]);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-72 w-72 shrink-0 sm:h-80 sm:w-80"
      aria-hidden="true"
    >
      {/* turning ring of text */}
      <motion.svg
        viewBox="0 0 320 320"
        className="absolute inset-0 h-full w-full"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 36, ease: "linear", repeat: Infinity }}
      >
        <defs>
          <path
            id={`${uid}-ring`}
            d="M160 160 m-138 0 a138 138 0 1 1 276 0 a138 138 0 1 1 -276 0"
          />
        </defs>
        <text
          fill={COLORS.gold}
          fontSize="25"
          style={{ fontFamily: FONTS.scribble }}
        >
          <textPath
            href={`#${uid}-ring`}
            textLength="866"
            lengthAdjust="spacing"
          >
            {FOOTER.ring.repeat(2)}
          </textPath>
        </text>
      </motion.svg>

      {/* sticker disc */}
      <motion.div
        className="absolute inset-[14%] grid place-items-center rounded-full border-[7px] border-paper bg-paper shadow-[9px_9px_0_#FFC233]"
        initial={reduce ? false : { scale: 0.6, rotate: -20, opacity: 0 }}
        animate={
          inView || reduce ? { scale: 1, rotate: -4, opacity: 1 } : undefined
        }
        transition={reduce ? { duration: 0 } : SPRINGS.pop}
      >
        <svg viewBox={`0 0 ${LOGO_W} ${LOGO_H}`} className="w-[82%]">
          <defs>
            <mask id={`${uid}-fill`}>
              <rect width={LOGO_W} height={LOGO_H} fill="black" />
              <path ref={waveRef} fill="white" d="" />
            </mask>
          </defs>
          <image
            href={LOGO.outline}
            width={LOGO_W}
            height={LOGO_H}
            opacity={0.3}
          />
          <image
            href={LOGO.src}
            x="-3"
            y="-11"
            width={1165}
            height={1175}
            mask={`url(#${uid}-fill)`}
          />
        </svg>
      </motion.div>
    </div>
  );
}

// the company name, as loud as it gets: letters rise one by one
function Wordmark({ reduce }) {
  const list = {
    hide: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.07 } },
  };
  const letter = reduce
    ? { hide: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hide: { y: "105%", rotate: 8 },
        show: {
          y: "0%",
          rotate: 0,
          transition: { type: "spring", stiffness: 240, damping: 18 },
        },
      };

  return (
    <motion.div
      role="img"
      aria-label="Hacaden"
      className="flex select-none justify-center font-display font-extrabold leading-[0.82] tracking-[-0.05em]"
      style={{ fontSize: "clamp(4.75rem, 22vw, 19.5rem)" }}
      variants={list}
      initial="hide"
      whileInView="show"
      viewport={{ once: true, margin: "-10%" }}
    >
      {LETTERS.map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="overflow-hidden px-[0.01em] pb-[0.14em] pt-[0.06em]"
        >
          <motion.span
            variants={letter}
            className="relative inline-block"
            style={{ color: i >= 4 ? COLORS.coral : COLORS.paper }}
          >
            {ch}
            {i === HEART_INDEX && (
              <motion.span
                className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2"
                style={{ fontSize: "0.15em", lineHeight: 0 }}
                animate={reduce ? undefined : { scale: [1, 1.25, 1, 1.12, 1] }}
                transition={{ duration: 1.3, repeat: Infinity, delay: 1.2 }}
              >
                <FaHeart aria-hidden="true" className="text-coral" />
              </motion.span>
            )}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}

// Closing note of the page: the trail ends here.
export default function Footer() {
  const reduce = usePrefersReducedMotion();

  return (
    <footer className="relative isolate overflow-hidden bg-ink text-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,246,232,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="mx-auto max-w-7xl px-5 pb-6 pt-40 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[auto_1fr] lg:gap-20">
          <LogoBadge reduce={reduce} />

          <div className="text-center lg:text-left">
            <p className="font-scribble text-[clamp(2.2rem,4.6vw,3.5rem)] leading-[1.05] text-gold">
              {FOOTER.tagline}
            </p>
            <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-paper/80 lg:mx-0">
              {FOOTER.blurb}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 lg:justify-start">
              <StickerButton href="#waitlist" variant="onDark">
                {FOOTER.cta}
              </StickerButton>
              <nav
                aria-label="Footer"
                className="flex flex-wrap gap-x-6 gap-y-2 text-base font-semibold"
              >
                {FOOTER.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="underline decoration-gold decoration-2 underline-offset-4 hover:text-gold"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <Wordmark reduce={reduce} />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-paper/15 pt-5 text-sm text-paper/60">
          <p>{FOOTER.legal}</p>
          <a
            href="#"
            className="inline-flex items-center gap-2 font-semibold hover:text-gold"
          >
            <FaArrowUp aria-hidden="true" size={12} />
            {FOOTER.top}
          </a>
        </div>
      </div>
    </footer>
  );
}
