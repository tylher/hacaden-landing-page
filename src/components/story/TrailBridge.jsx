"use client";

import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { COLORS } from "@/data/theme";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useId, useRef } from "react";

// Dotted trail, 300 x 210. The seam between two sections is at y = 90:
// the first part of the trail lies in the section above, the rest below it.
const PATH = "M150 0 C 90 25, 215 60, 150 90 S 85 165, 150 210";
const SEAM_Y = 90;
const VB_W = 300;
const VB_H = 210;
const START = 0.12; // a small stub is already drawn, as a hint to keep scrolling

// ragged torn-paper edge (deterministic, so server and client match)
const EDGE = Array.from({ length: 51 }, (_, i) => [
  i * 24,
  30 +
    Math.round(
      Math.sin(i * 1.7) * 7 + Math.sin(i * 4.1) * 5 + ((i * 37) % 9) - 4,
    ),
]);
const EDGE_LINE = EDGE.map(
  ([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`,
).join(" ");
const EDGE_FILL = `${EDGE_LINE} L1200 0 L0 0 Z`;

/**
 * Sits on the seam between two sections (render it between them).
 * - a torn sheet in `fromColor` hangs over the next section
 * - a dotted trail is drawn as you scroll, and a coin rides along it
 * - the trail is `topColor` above the seam and `bottomColor` below it
 */
export default function TrailBridge({
  fromColor,
  topColor,
  bottomColor,
  note,
  noteTone = "light",
}) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef(null);
  const pathRef = useRef(null);
  const coinRef = useRef(null);
  const reduce = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "start 40%"],
  });
  const drawn = useTransform(scrollYProgress, [0, 1], [START, 1]);

  const placeCoin = (v) => {
    const path = pathRef.current;
    const coin = coinRef.current;
    if (!path || !coin) return;
    const p = path.getPointAtLength(v * path.getTotalLength());
    coin.setAttribute("transform", `translate(${p.x} ${p.y})`);
  };

  useMotionValueEvent(drawn, "change", placeCoin);
  useEffect(() => placeCoin(drawn.get()), [drawn]);

  const pathLength = reduce ? 1 : drawn;
  const dots = {
    fill: "none",
    strokeWidth: 4,
    strokeLinecap: "round",
    strokeDasharray: "0.1 13",
  };

  return (
    <div
      ref={ref}
      className="pointer-events-none relative z-20 h-0"
      aria-hidden="true"
    >
      {/* torn sheet of the previous section */}
      <svg
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        className="absolute left-0 w-full"
        style={{ top: -1, height: 40 }}
      >
        <path d={EDGE_FILL} fill={fromColor} />
        <path
          d={EDGE_LINE}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth="2.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* the trail */}
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="absolute left-1/2 -translate-x-1/2 overflow-visible"
        style={{ top: -SEAM_Y, width: VB_W, height: VB_H }}
      >
        <defs>
          <mask
            id={`${uid}-draw`}
            maskUnits="userSpaceOnUse"
            x="-50"
            y="-20"
            width="400"
            height="260"
          >
            <motion.path
              d={PATH}
              fill="none"
              stroke="white"
              strokeWidth={16}
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </mask>
          <clipPath id={`${uid}-top`}>
            <rect x="-50" y="-20" width="400" height={SEAM_Y + 20} />
          </clipPath>
          <clipPath id={`${uid}-bottom`}>
            <rect x="-50" y={SEAM_Y} width="400" height={VB_H} />
          </clipPath>
        </defs>

        <g mask={`url(#${uid}-draw)`}>
          <path
            ref={pathRef}
            d={PATH}
            stroke={topColor}
            clipPath={`url(#${uid}-top)`}
            {...dots}
          />
          <path
            d={PATH}
            stroke={bottomColor}
            clipPath={`url(#${uid}-bottom)`}
            {...dots}
          />
        </g>

        {!reduce && (
          <g ref={coinRef}>
            <circle
              r="13"
              fill={COLORS.gold}
              stroke={COLORS.ink}
              strokeWidth="3"
            />
            <path
              d="M-5 0 H5 M0 -5 V5"
              stroke={COLORS.ink}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>

      {note && (
        <p
          className={`absolute w-36 -rotate-3 font-scribble text-2xl leading-tight ${
            noteTone === "light" ? "text-paper" : "text-ink"
          }`}
          style={{ top: 44, left: "calc(50% + 44px)" }}
        >
          {note}
        </p>
      )}
    </div>
  );
}
