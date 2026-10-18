"use client";

import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { HOW, MOCKS } from "@/data/story";
import { COLORS, SPRINGS } from "@/data/theme";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FormMock, ShareMock, TrackMock } from "./StepMocks";

const MOCK_BY_NAME = { form: FormMock, share: ShareMock, track: TrackMock };
const STAMP_TILTS = [-6, 5, -4];

// Winding trail through the three stops (at 1/6, 1/2 and 5/6 of the height).
// Built in real pixels, so dots stay round at any size.
function buildTrail(w, h) {
  const cx = w / 2;
  const a = Math.min(34, w * 0.32);
  const y1 = h / 6;
  const y2 = h / 2;
  const y3 = (5 * h) / 6;
  const s1 = y2 - y1;
  const s2 = y3 - y2;
  const s3 = h - y3;
  return [
    `M${cx} 0`,
    `C${cx} ${y1 * 0.4} ${cx} ${y1 * 0.6} ${cx} ${y1}`,
    `C${cx + a} ${y1 + s1 * 0.3} ${cx - a} ${y1 + s1 * 0.7} ${cx} ${y2}`,
    `C${cx - a} ${y2 + s2 * 0.3} ${cx + a} ${y2 + s2 * 0.7} ${cx} ${y3}`,
    `C${cx} ${y3 + s3 * 0.4} ${cx} ${y3 + s3 * 0.6} ${cx} ${h}`,
  ].join(" ");
}

/**
 * The trail that runs behind the steps. It is drawn as you scroll, and a coin
 * rides along the end of it. The previous bridge's trail arrives at the top
 * center of this section, and the next bridge picks up from the bottom.
 */
function TrailRail({ reduce }) {
  const uid = useId().replace(/:/g, "");
  const boxRef = useRef(null);
  const pathRef = useRef(null);
  const coinRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setSize({
        w: Math.round(entry.contentRect.width),
        h: Math.round(entry.contentRect.height),
      }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: boxRef,
    offset: ["start 75%", "end 55%"],
  });
  const drawn = useTransform(scrollYProgress, [0, 1], [0.04, 1]);

  const placeCoin = (v) => {
    const path = pathRef.current;
    const coin = coinRef.current;
    if (!path || !coin) return;
    const p = path.getPointAtLength(v * path.getTotalLength());
    coin.style.transform = `translate(${p.x - 13}px, ${p.y - 13}px)`;
  };
  useMotionValueEvent(drawn, "change", placeCoin);
  useEffect(() => placeCoin(drawn.get()), [size, drawn]);

  const d = size.w > 0 ? buildTrail(size.w, size.h) : "";

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-28 -translate-x-1/2"
    >
      {size.w > 0 && (
        <svg
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          className="absolute inset-0"
        >
          <defs>
            <mask
              id={`${uid}-draw`}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={size.w}
              height={size.h}
            >
              <motion.path
                d={d}
                fill="none"
                stroke="white"
                strokeWidth={16}
                strokeLinecap="round"
                style={{ pathLength: reduce ? 1 : drawn }}
              />
            </mask>
          </defs>
          <path
            ref={pathRef}
            d={d}
            fill="none"
            stroke={COLORS.ink}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="0.1 13"
            mask={`url(#${uid}-draw)`}
          />
        </svg>
      )}

      {!reduce && size.w > 0 && (
        <div
          ref={coinRef}
          className="absolute left-0 top-0 grid h-[26px] w-[26px] place-items-center rounded-full border-[3px] border-ink bg-gold"
        >
          <FaPlus size={9} className="text-ink" />
        </div>
      )}
    </div>
  );
}

// numbered stop on the trail; pops once it is well inside the screen
function Stop({ n, color, numeralColor, tilt, reduce }) {
  return (
    <div className="absolute left-1/2 z-20 -translate-x-1/2 max-lg:-top-11 lg:top-1/2 lg:-translate-y-1/2">
      <motion.div
        className="grid h-[4.25rem] w-[4.25rem] place-items-center rounded-full border-2 border-ink font-display text-3xl font-extrabold shadow-[4px_4px_0_#2B1A17]"
        style={{ background: color, color: numeralColor }}
        initial={reduce ? false : { scale: 0, rotate: -40 }}
        whileInView={{ scale: 1, rotate: tilt }}
        viewport={{ once: true, margin: "0px 0px -25% 0px" }}
        transition={reduce ? { duration: 0 } : SPRINGS.stamp}
      >
        {n}
      </motion.div>
    </div>
  );
}

/**
 * Story beat 3: "there's a better way." The torn seam above has just brought
 * us back to Paper, and the trail from the seam now runs through the steps.
 */
export default function HowItWorksSection() {
  const reduce = usePrefersReducedMotion();
  const { eyebrow, headline, body, steps } = HOW;

  const list = { hide: {}, show: { transition: { staggerChildren: 0.14 } } };
  const rise = reduce
    ? { hide: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hide: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: SPRINGS.soft },
      };

  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden bg-paper text-ink"
    >
      {/* faint dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(rgba(43,26,23,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="mx-auto max-w-7xl px-5 pb-28 pt-32 sm:px-8 lg:pt-40">
        {/* the trail from the seam arrives right at this chip */}
        <motion.header
          className="mx-auto max-w-2xl text-center"
          variants={list}
          initial="hide"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.p
            variants={rise}
            className="inline-block -rotate-2 rounded-full border-2 border-ink bg-gold px-4 py-1 font-mono text-xs font-semibold uppercase tracking-wider shadow-[3px_3px_0_#2B1A17]"
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
                className="absolute inset-0 -z-10 -skew-x-6 rounded-md bg-coral"
              />
              {headline.highlight}
            </span>
          </motion.h2>

          <motion.p
            variants={rise}
            className="mt-6 text-lg leading-relaxed text-ink/80"
          >
            {body}
          </motion.p>
        </motion.header>

        {/* steps, with the trail running behind them */}
        <div className="relative mt-10 lg:mt-16">
          <TrailRail reduce={reduce} />

          <ol className="relative z-10 grid lg:auto-rows-fr">
            {steps.map((step, i) => {
              const Mock = MOCK_BY_NAME[step.mock];
              const mirrored = i % 2 === 1;
              return (
                <li
                  key={step.title}
                  className="relative grid items-center gap-8 py-0 max-lg:mt-16 max-lg:rounded-3xl max-lg:border-2 max-lg:border-ink max-lg:bg-white max-lg:p-5 max-lg:shadow-[6px_6px_0_#2B1A17] lg:grid-cols-[1fr_7rem_1fr] lg:py-20"
                >
                  <Stop
                    n={i + 1}
                    color={step.color}
                    numeralColor={step.numeralColor}
                    tilt={STAMP_TILTS[i]}
                    reduce={reduce}
                  />

                  {/* copy */}
                  <motion.div
                    className={`lg:row-start-1 ${
                      mirrored
                        ? "lg:col-start-3 lg:justify-self-start lg:pl-4"
                        : "lg:col-start-1 lg:justify-self-end lg:pr-4"
                    } max-w-md`}
                    initial={reduce ? false : { opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={reduce ? { duration: 0 } : SPRINGS.soft}
                  >
                    <p className="font-mono text-xs font-semibold uppercase tracking-wider text-ink/60">
                      Step {i + 1}
                    </p>
                    <h3 className="mt-2 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-lg leading-relaxed text-ink/80">
                      {step.text}
                    </p>
                    <p className="mt-4 -rotate-2 font-scribble text-2xl leading-none text-berry">
                      {step.note}
                    </p>
                  </motion.div>

                  {/* illustration */}
                  <div
                    className={`lg:row-start-1 ${mirrored ? "lg:col-start-1" : "lg:col-start-3"}`}
                  >
                    <Mock data={MOCKS[step.mock]} />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
