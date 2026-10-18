"use client";

import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { LoaderRevealContext } from "@/hooks/useReveal";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";

/**
 * HacadenLoader
 * ----------------------------------------------------------------
 * 1. The logo fills with a layered wave. The fill follows real asset
 *    loading but never finishes faster than `minDuration`.
 * 2. When the fill completes, the wordmark letters drop in like
 *    stickers, the heart pops with a confetti burst, a scribble
 *    underline draws, and the tagline rises word by word.
 * 3. After a short hold, four colored paper layers lift in sequence
 *    (Paper, Coral, Gold, Teal) to reveal the page.
 *
 * Needs: npm install framer-motion react-icons
 * Fonts come from next/font in app/layout.js (CSS variables).
 */

const LOGO_W = 1152;
const LOGO_H = 1150;

const COLORS = {
  paper: "#FFF6E8",
  ink: "#2B1A17",
  coral: "#FF6B4A",
  gold: "#FFC233",
  teal: "#1A6B6B",
  berry: "#D6336C",
};

const FONTS = {
  display: "var(--font-bricolage), system-ui, sans-serif",
  body: "var(--font-dm-sans), system-ui, sans-serif",
  scribble: "var(--font-caveat-brush), cursive",
};

// timing
const TEXT_HOLD_MS = 2300; // fill done -> curtain starts lifting
const CURTAIN_MS = 1300; // curtain start -> loader unmounted
const CURTAIN_EASE = [0.76, 0, 0.24, 1];

// wordmark: H a c a d e n (heart sits on the second "a")
const LETTERS = ["H", "a", "c", "a", "d", "e", "n"];
const HEART_INDEX = 3;
const DROP_ROTATE = [-14, 10, -8, 12, -10, 8, -12];
const REST_ROTATE = [-2, 1.5, -1, 2, -1.5, 1, -2];

const TAGLINE_WORDS = ["every", "gift", "tells", "a", "story."];

const BURST_COLORS = [COLORS.gold, COLORS.coral, COLORS.teal, COLORS.berry];
const BURST = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2;
  return {
    x: Math.round(Math.cos(angle) * 54),
    y: Math.round(Math.sin(angle) * 54),
    color: BURST_COLORS[i % BURST_COLORS.length],
  };
});

// back to front. The front layer holds the loader scene and leaves first.
const CURTAIN_LAYERS = [
  { color: COLORS.teal, delay: 0.24 },
  { color: COLORS.gold, delay: 0.16 },
  { color: COLORS.coral, delay: 0.08 },
  { color: COLORS.paper, delay: 0, front: true },
];

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // never block loading on a bad asset
    img.src = src;
  });
}

// slow primary swell plus a faster ripple so it reads as water
function buildWavePoints(levelFrac, amplitude, phase) {
  const levelY = LOGO_H - levelFrac * LOGO_H;
  const step = 18;
  const points = [];
  for (let x = 0; x <= LOGO_W; x += step) {
    const primary = Math.sin((x / LOGO_W) * Math.PI * 4 + phase) * amplitude;
    const ripple =
      Math.sin((x / LOGO_W) * Math.PI * 9 + phase * 1.7) * (amplitude * 0.28);
    points.push([x, levelY + primary + ripple]);
  }
  return points;
}

function buildFillPath(points) {
  let d = `M0,${LOGO_H} L${points[0][0]},${points[0][1].toFixed(1)} `;
  for (const [x, y] of points) d += `L${x},${y.toFixed(1)} `;
  d += `L${LOGO_W},${LOGO_H} Z`;
  return d;
}

function buildCrestPath(points) {
  return points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y.toFixed(1)}`)
    .join(" ");
}

function buildVariants(reduce) {
  if (reduce) {
    const fade = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.3 } },
    };
    return {
      container: { hidden: {}, visible: {} },
      letter: fade,
      heart: fade,
      burst: { hidden: { opacity: 0 }, visible: { opacity: 0 } },
      underline: fade,
      together: fade,
      word: fade,
    };
  }

  return {
    container: { hidden: {}, visible: {} },

    // letters drop in like stickers: overshoot, then settle with a tilt
    letter: {
      hidden: (i) => ({
        y: -120,
        rotate: DROP_ROTATE[i],
        scale: 0.5,
        opacity: 0,
      }),
      visible: (i) => ({
        y: 0,
        rotate: REST_ROTATE[i],
        scale: 1,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 380,
          damping: 13,
          mass: 0.8,
          delay: i * 0.07,
        },
      }),
    },

    heart: {
      hidden: { scale: 0, rotate: -30, opacity: 0 },
      visible: {
        scale: [0, 1.5, 1],
        rotate: 0,
        opacity: 1,
        transition: { delay: 0.6, duration: 0.6, times: [0, 0.6, 1] },
      },
    },

    burst: {
      hidden: { x: 0, y: 0, scale: 0, opacity: 0 },
      visible: (p) => ({
        x: p.x,
        y: p.y,
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
        transition: { delay: 0.65, duration: 0.8, ease: "easeOut" },
      }),
    },

    underline: {
      hidden: { pathLength: 0, opacity: 0 },
      visible: {
        pathLength: 1,
        opacity: 1,
        transition: { delay: 0.8, duration: 0.6, ease: "easeInOut" },
      },
    },

    together: {
      hidden: { scale: 0.6, rotate: -12, opacity: 0 },
      visible: {
        scale: 1,
        rotate: -3,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 14, delay: 1.0 },
      },
    },

    // words rise out of a mask
    word: {
      hidden: { y: "115%", rotate: 6, opacity: 0 },
      visible: (i) => ({
        y: "0%",
        rotate: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 260,
          damping: 22,
          delay: 1.15 + i * 0.08,
        },
      }),
    },
  };
}

// scalloped edge hanging off the bottom of each curtain layer
function Scallop({ color }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "calc(100% - 1px)",
        height: 21,
        backgroundImage: `radial-gradient(circle at 50% 0, ${color} 19.5px, transparent 20.5px)`,
        backgroundSize: "40px 21px",
        backgroundRepeat: "repeat-x",
      }}
    />
  );
}

export default function HacadenLoader({
  children,
  assets = [],
  minDuration = 2000,
}) {
  const reduce = usePrefersReducedMotion();
  const v = useMemo(() => buildVariants(reduce), [reduce]);

  const [fillDone, setFillDone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [mounted, setMounted] = useState(true);

  const wavePathRef = useRef(null);
  const crestPathRef = useRef(null);
  const realRef = useRef(0); // real loading progress, 0-100
  const startRef = useRef(0);
  const displayedRef = useRef(0);
  const phaseRef = useRef(0);

  // stable dependency, so an inline `assets={[...]}` doesn't restart loading
  const assetKey = assets.join("|");

  // --- real loading work (window load + preloaded assets) ---
  useEffect(() => {
    let cancelled = false;
    const targets = assetKey ? assetKey.split("|") : [];
    const totalSteps = targets.length + 1; // +1 for window load
    let done = 0;

    const bump = () => {
      done += 1;
      if (!cancelled) realRef.current = (done / totalSteps) * 100;
    };

    const windowLoaded = new Promise((resolve) => {
      if (document.readyState === "complete") return resolve();
      window.addEventListener("load", () => resolve(), { once: true });
    });

    windowLoaded.then(bump);
    targets.forEach((src) => preloadImage(src).then(bump));

    return () => {
      cancelled = true;
    };
  }, [assetKey]);

  // --- wave / fill loop: one rAF loop, frame-rate independent ---
  useEffect(() => {
    let raf;
    let last = performance.now();
    startRef.current = last;

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // the fill is the slower of real progress and the minimum-time ramp
      const timeTarget =
        Math.min(1, (now - startRef.current) / minDuration) * 100;
      const target = Math.min(realRef.current, timeTarget);

      displayedRef.current +=
        (target - displayedRef.current) * (1 - Math.exp(-dt * 8));
      phaseRef.current += dt * 3.6;

      const levelFrac = Math.min(displayedRef.current, 100) / 100;
      const amplitude = 10 * (1 - levelFrac) + 2;
      const points = buildWavePoints(levelFrac, amplitude, phaseRef.current);

      wavePathRef.current?.setAttribute("d", buildFillPath(points));
      crestPathRef.current?.setAttribute("d", buildCrestPath(points));

      if (target >= 100 && displayedRef.current > 99.3) {
        // snap to a completely full logo, no gaps at the top
        wavePathRef.current?.setAttribute(
          "d",
          `M0,0 H${LOGO_W} V${LOGO_H} H0 Z`,
        );
        crestPathRef.current?.setAttribute("d", "");
        setFillDone(true);
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [minDuration]);

  // --- text choreography plays, then the curtain lifts ---
  useEffect(() => {
    if (!fillDone) return;
    const lift = setTimeout(() => setLeaving(true), TEXT_HOLD_MS);
    const remove = setTimeout(
      () => setMounted(false),
      TEXT_HOLD_MS + CURTAIN_MS,
    );
    return () => {
      clearTimeout(lift);
      clearTimeout(remove);
    };
  }, [fillDone]);

  useEffect(() => {
    if (!leaving) return;
    document.documentElement.dataset.revealed = "true";
    window.dispatchEvent(new Event("hacaden:reveal"));
  }, [leaving]);

  // --- lock page scroll until the curtain starts lifting ---
  const locked = mounted && !leaving;
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);

  const scene = (
    <LoaderRevealContext.Provider value={leaving || !mounted}>
      <div style={{ position: "relative", width: "min(46vw, 340px)" }}>
        <svg
          viewBox={`0 0 ${LOGO_W} ${LOGO_H}`}
          style={{ width: "100%", height: "auto" }}
          aria-hidden="true"
        >
          <defs>
            <mask id="liquidMask">
              <rect x="0" y="0" width={LOGO_W} height={LOGO_H} fill="black" />
              <path ref={wavePathRef} fill="white" d="" />
            </mask>
          </defs>
          {/* outline / empty state */}
          <image
            href="/images/hacaden-logo-outline.png"
            x="0"
            y="0"
            width={LOGO_W}
            height={LOGO_H}
            opacity={0.2}
          />
          {/* colored state, revealed by the rising mask */}
          <image
            href="/images/hacaden-logo.png"
            x="-3"
            y="-11"
            width={1165}
            height={1175}
            mask="url(#liquidMask)"
          />
          {/* crest line riding the wave surface */}
          <path
            ref={crestPathRef}
            d=""
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity={0.6}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </svg>
      </div>

      <motion.div
        variants={v.container}
        initial="hidden"
        animate={fillDone ? "visible" : "hidden"}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        {/* wordmark */}
        <div
          role="img"
          aria-label="Hacaden"
          style={{
            display: "flex",
            fontFamily: FONTS.display,
            fontWeight: 800,
            fontSize: "clamp(64px, 15vw, 120px)",
            letterSpacing: "-0.03em",
            color: COLORS.ink,
            lineHeight: 1,
          }}
        >
          {LETTERS.map((ch, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={v.letter}
              aria-hidden="true"
              style={{
                display: "inline-block",
                position: "relative",
                transformOrigin: "50% 80%",
              }}
            >
              {ch}

              {i === HEART_INDEX && (
                <>
                  {BURST.map((p, k) => (
                    <motion.span
                      key={k}
                      custom={p}
                      variants={v.burst}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "58%",
                        width: 7,
                        height: 7,
                        marginLeft: -3.5,
                        marginTop: -3.5,
                        borderRadius: "50%",
                        background: p.color,
                        pointerEvents: "none",
                      }}
                    />
                  ))}
                  <motion.span
                    variants={v.heart}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "58%",
                      x: "-50%",
                      y: "-50%",
                      lineHeight: 0,
                    }}
                  >
                    {/* heartbeat after the pop */}
                    <motion.span
                      animate={
                        reduce ? undefined : { scale: [1, 1.22, 1, 1.12, 1] }
                      }
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        delay: 2.2,
                        ease: "easeInOut",
                      }}
                      style={{ display: "block", lineHeight: 0 }}
                    >
                      <FaHeart
                        aria-hidden="true"
                        style={{ fontSize: "0.15em", color: COLORS.coral }}
                      />
                    </motion.span>
                  </motion.span>
                </>
              )}
            </motion.span>
          ))}
        </div>

        {/* hand-drawn underline */}
        <svg
          viewBox="0 0 240 24"
          aria-hidden="true"
          style={{
            width: "clamp(160px, 38vw, 300px)",
            height: "auto",
            marginTop: -6,
            overflow: "visible",
          }}
        >
          <motion.path
            d="M4 16 C30 4 52 24 80 12 S130 4 156 14 S206 20 236 8"
            fill="none"
            stroke={COLORS.gold}
            strokeWidth={7}
            strokeLinecap="round"
            variants={v.underline}
          />
        </svg>

        {/* tagline */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "baseline",
            gap: "0 0.35em",
            marginTop: 16,
            fontFamily: FONTS.body,
            fontWeight: 500,
            fontSize: "clamp(15px, 2.6vw, 18px)",
            letterSpacing: "-0.01em",
            color: COLORS.teal,
          }}
        >
          <motion.span
            variants={v.together}
            style={{
              display: "inline-block",
              fontFamily: FONTS.scribble,
              fontWeight: 400,
              fontSize: "1.7em",
              lineHeight: 1,
              color: COLORS.coral,
            }}
          >
            Together,
          </motion.span>
          {TAGLINE_WORDS.map((w, i) => (
            <span
              key={`${w}-${i}`}
              style={{
                display: "inline-block",
                overflow: "hidden",
                paddingBottom: "0.2em",
                marginBottom: "-0.2em",
              }}
            >
              <motion.span
                custom={i}
                variants={v.word}
                style={{ display: "inline-block" }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </div>
      </motion.div>
    </LoaderRevealContext.Provider>
  );

  return (
    <>
      {children}

      {mounted &&
        CURTAIN_LAYERS.map((layer, i) => (
          <motion.div
            key={layer.color}
            role={layer.front ? "status" : undefined}
            aria-label={layer.front ? "Loading Hacaden" : undefined}
            aria-hidden={layer.front ? undefined : true}
            initial={false}
            animate={
              reduce
                ? { opacity: leaving ? 0 : 1 }
                : { y: leaving ? "-110%" : "0%" }
            }
            transition={
              reduce
                ? { duration: 0.3 }
                : { duration: 0.95, ease: CURTAIN_EASE, delay: layer.delay }
            }
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 990 + i,
              background: layer.color,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              pointerEvents: leaving ? "none" : "auto",
            }}
          >
            {!reduce && <Scallop color={layer.color} />}
            {layer.front && scene}
          </motion.div>
        ))}
    </>
  );
}
