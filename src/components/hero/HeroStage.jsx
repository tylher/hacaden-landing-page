"use client";

import { AVATAR_SIZE, FRIENDS, GROUP, STAGE, TRACKER } from "@/data/hero";
import { COLORS, SPRINGS } from "@/data/theme";
import { motion } from "framer-motion";
import Image from "next/image";
import Avatar from "./Avatar";
import Confetti from "./Confetti";
import RouteMap from "./RouteMap";
import Stamp from "./Stamp";
import TrackerTag from "./TrackerTag";

const pctX = (v) => `${(v / STAGE.width) * 100}%`;
const pctY = (v) => `${(v / STAGE.height) * 100}%`;

// The scene is purely visual, so screen readers get one sentence instead.
const SUMMARY = `Illustration: friends in ${FRIENDS.map((f) => f.city).join(", ")} each send a contribution to one shared gift for ${TRACKER.title}.`;

/**
 * The art stage: friends around the edges, dotted routes into the group
 * sticker, stamps landing on arrival, a tracker tag, and a confetti burst.
 * All layout values come from data/hero.js.
 */
export default function HeroStage({
  revealed,
  landed,
  onLand,
  celebrate,
  reduce,
}) {
  const count = TRACKER.startAt + landed.filter(Boolean).length;

  // reduced motion: no springs, even on the very first render
  const spring = (preset, extra) =>
    reduce ? { duration: 0 } : { ...preset, ...extra };

  return (
    <div
      role="img"
      aria-label={SUMMARY}
      className="relative mx-auto w-full max-w-[640px]"
      style={{
        aspectRatio: `${STAGE.width} / ${STAGE.height}`,
        // lets children size text and rings in cqw, so they scale with the stage
        containerType: "inline-size",
      }}
    >
      {/* routes + traveling coins (sit under everything else) */}
      <RouteMap
        friends={FRIENDS}
        active={revealed}
        reduce={reduce}
        onLand={onLand}
      />

      {/* group sticker and its stamps float together, so stamps stay "stuck on" */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10"
        animate={revealed && !reduce ? { y: [0, -8, 0] } : undefined}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      >
        <motion.div
          className="absolute"
          style={{
            left: pctX(GROUP.x),
            top: pctY(GROUP.y),
            width: pctX(GROUP.w),
            x: "-50%",
            y: "-50%",
          }}
          initial={reduce ? false : { scale: 0, rotate: -14, opacity: 0 }}
          animate={
            revealed
              ? { scale: 1, rotate: GROUP.rotate, opacity: 1 }
              : undefined
          }
          transition={spring(SPRINGS.pop)}
        >
          <Image
            src={GROUP.src}
            alt={GROUP.alt}
            width={GROUP.width}
            height={GROUP.height}
            priority
            draggable={false}
            sizes="(min-width: 1024px) 320px, 55vw"
            className="h-auto w-full select-none"
          />
        </motion.div>

        {/* stamps land when each coin arrives */}
        {FRIENDS.map((f, i) => (
          <Stamp
            key={f.id}
            stamp={f.stamp}
            amount={f.amount}
            city={f.city}
            show={landed[i]}
            reduce={reduce}
          />
        ))}
      </motion.div>

      {/* friends: illustrated avatar stickers */}
      {FRIENDS.map((f, i) => (
        <motion.div
          key={f.id}
          className="absolute z-20"
          style={{
            left: pctX(f.x),
            top: pctY(f.y),
            width: pctX(AVATAR_SIZE),
            x: "-50%",
            y: "-50%",
          }}
          initial={reduce ? false : { scale: 0, rotate: -24, opacity: 0 }}
          animate={
            revealed ? { scale: 1, rotate: f.tilt, opacity: 1 } : undefined
          }
          transition={spring(SPRINGS.pop, { delay: 0.25 + i * 0.08 })}
          whileHover={reduce ? undefined : { rotate: f.tilt + 7, scale: 1.08 }}
        >
          <div
            className="aspect-square rounded-full border-2 border-ink bg-white p-[3px] sm:p-1"
            style={{ boxShadow: `3px 3px 0 ${COLORS.ink}` }}
          >
            <div className="h-full w-full overflow-hidden rounded-full">
              <Avatar look={f.look} />
            </div>
          </div>
          <span className="absolute left-1/2 top-full mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-full border-[1.5px] border-ink bg-paper px-2 py-0.5 text-[10px] font-semibold leading-none text-ink sm:block">
            {f.name} · {f.city}
          </span>
        </motion.div>
      ))}

      <TrackerTag count={count} show={revealed} reduce={reduce} />
      <Confetti fire={celebrate} />
    </div>
  );
}