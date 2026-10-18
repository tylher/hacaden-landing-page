"use client";

import { STAGE } from "@/data/hero";
import { COLORS } from "@/data/theme";
import { animate, motion } from "framer-motion";
import { useEffect, useId, useRef } from "react";

/**
 * Dotted routes from each friend to the gift, with a coin that travels
 * along each route. When a coin arrives it calls onLand(index), which
 * the parent uses to drop the stamp and tick the tracker.
 *
 * The SVG shares the stage's viewBox, so it scales with the container.
 */
export default function RouteMap({ friends, active, reduce, onLand }) {
  const uid = useId().replace(/:/g, "");
  const pathRefs = useRef([]);
  const coinRefs = useRef([]);

  useEffect(() => {
    if (!active || reduce) return;

    const controls = friends.map((f, i) => {
      const path = pathRefs.current[i];
      const coin = coinRefs.current[i];
      if (!path || !coin) return null;
      const length = path.getTotalLength();

      return animate(0, 1, {
        delay: f.delay + 0.5, // coin leaves once the route has started drawing
        duration: 1.1,
        ease: [0.45, 0, 0.25, 1],
        onUpdate: (t) => {
          const p = path.getPointAtLength(t * length);
          coin.setAttribute(
            "transform",
            `translate(${p.x} ${p.y}) scale(${1 - t * 0.2})`,
          );
          coin.setAttribute("opacity", t > 0.001 ? "1" : "0");
        },
        onComplete: () => {
          coin.setAttribute("opacity", "0");
          onLand(i);
        },
      });
    });

    return () => controls.forEach((c) => c && c.stop());
  }, [active, reduce, friends, onLand]);

  return (
    <svg
      viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        {friends.map((f, i) => (
          <mask
            key={f.id}
            id={`${uid}-m${i}`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={STAGE.width}
            height={STAGE.height}
          >
            <motion.path
              d={f.route}
              fill="none"
              stroke="white"
              strokeWidth={16}
              strokeLinecap="round"
              initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
              animate={{
                pathLength: active || reduce ? 1 : 0,
                opacity: active || reduce ? 1 : 0,
              }}
              transition={{
                delay: f.delay,
                duration: 0.7,
                ease: "easeInOut",
                opacity: { delay: f.delay, duration: 0.01 },
              }}
            />
          </mask>
        ))}
      </defs>

      {friends.map((f, i) => (
        <g key={f.id}>
          {/* dotted route, revealed by the mask above */}
          <path
            ref={(el) => (pathRefs.current[i] = el)}
            d={f.route}
            fill="none"
            stroke={COLORS.ink}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="0.1 13"
            mask={`url(#${uid}-m${i})`}
          />
          {/* traveling coin */}
          <g ref={(el) => (coinRefs.current[i] = el)} opacity="0">
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
        </g>
      ))}
    </svg>
  );
}
