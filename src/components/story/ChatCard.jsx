"use client";

import Avatar from "@/components/hero/Avatar";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { FRIENDS } from "@/data/hero";
import { CHAT } from "@/data/story";
import { COLORS, FONTS, SPRINGS } from "@/data/theme";
import { motion } from "framer-motion";
import { FaPaperclip } from "react-icons/fa";

const BY_ID = Object.fromEntries(FRIENDS.map((f) => [f.id, f]));

function MiniAvatar({ id, size = 30 }) {
  return (
    <div
      className="shrink-0 overflow-hidden rounded-full border-2 border-ink bg-white"
      style={{ width: size, height: size }}
    >
      <Avatar look={BY_ID[id].look} />
    </div>
  );
}

// small hand-drawn arrow that points up at the bubble above a note
function NoteArrow() {
  return (
    <svg
      width="26"
      height="20"
      viewBox="0 0 26 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M24 16 C14 16 8 11 4 4 M4 4 L3 11 M4 4 L11 6"
        stroke={COLORS.berry}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TypingDots({ reduce }) {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-ink/60"
          animate={reduce ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

/**
 * A taped-on "group chat" card showing how gifting usually goes. Reuses the
 * same five friends as the hero, so the story keeps its characters.
 */
export default function ChatCard() {
  const reduce = usePrefersReducedMotion();

  const list = {
    hide: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.22, delayChildren: 0.35 },
    },
  };
  const bubble = reduce
    ? { hide: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hide: { opacity: 0, y: 16, scale: 0.92 },
        show: { opacity: 1, y: 0, scale: 1, transition: SPRINGS.pop },
      };

  return (
    <motion.div
      className="relative mx-auto w-full max-w-md lg:ml-auto"
      initial={reduce ? false : { opacity: 0, y: 48, rotate: -6 }}
      whileInView={{ opacity: 1, y: 0, rotate: -2 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={reduce ? { duration: 0 } : SPRINGS.soft}
    >
      {/* washi tape */}
      <span className="absolute -top-3 left-8 z-10 h-6 w-20 -rotate-6 rounded-sm bg-gold/90 shadow-[1px_1px_0_#2B1A17]" />
      <span className="absolute -top-3 right-8 z-10 h-6 w-20 rotate-6 rounded-sm bg-coral/90 shadow-[1px_1px_0_#2B1A17]" />

      <div className="overflow-hidden rounded-3xl border-2 border-ink bg-paper text-ink shadow-[8px_8px_0_#2B1A17]">
        {/* header */}
        <div className="flex items-center gap-3 border-b-2 border-ink bg-white px-4 py-3">
          <div className="flex -space-x-2">
            {FRIENDS.slice(0, 4).map((f) => (
              <MiniAvatar key={f.id} id={f.id} size={28} />
            ))}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-extrabold leading-none">
              {CHAT.title}
            </p>
            <p className="mt-1 text-xs leading-none text-ink/60">
              {CHAT.members}
            </p>
          </div>
          <motion.span
            className="ml-auto rounded-full bg-berry px-2.5 py-1 text-[11px] font-bold leading-none text-paper"
            style={{ fontFamily: FONTS.mono }}
            animate={reduce ? undefined : { rotate: [0, -6, 6, -4, 4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.4 }}
          >
            {CHAT.unread}
          </motion.span>
        </div>

        {/* messages */}
        <motion.ul
          className="space-y-3 px-4 py-5"
          variants={list}
          initial="hide"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {CHAT.messages.map((m, i) => (
            <motion.li
              key={i}
              variants={bubble}
              className={`flex items-start gap-2 ${m.mine ? "flex-row-reverse" : ""}`}
            >
              <MiniAvatar id={m.from} />
              <div
                className={`min-w-0 max-w-[80%] ${m.mine ? "text-right" : ""}`}
              >
                <p className="mb-0.5 text-[11px] font-bold leading-none text-ink/60">
                  {BY_ID[m.from].name}
                </p>
                <div
                  className={`inline-block rounded-2xl border-2 border-ink px-3 py-2 text-left text-[15px] leading-snug ${
                    m.mine ? "bg-gold" : "bg-white"
                  }`}
                >
                  {m.text}
                  {m.attachment && (
                    <span
                      className="mt-2 flex items-center gap-1.5 rounded-lg border-[1.5px] border-ink bg-paper px-2 py-1 text-xs"
                      style={{ fontFamily: FONTS.mono }}
                    >
                      <FaPaperclip aria-hidden="true" />
                      {m.attachment}
                    </span>
                  )}
                </div>
                {m.note && (
                  <p className="mt-1 flex -rotate-1 items-start gap-1 font-scribble text-xl leading-none text-berry">
                    <NoteArrow />
                    {m.note}
                  </p>
                )}
              </div>
            </motion.li>
          ))}

          {/* someone is typing, forever */}
          <motion.li variants={bubble} className="flex items-center gap-2">
            <MiniAvatar id={CHAT.typingFrom} />
            <span className="rounded-2xl border-2 border-ink bg-white px-3 py-3">
              <TypingDots reduce={reduce} />
            </span>
            <span
              className="text-[11px] text-ink/50"
              style={{ fontFamily: FONTS.mono }}
            >
              {BY_ID[CHAT.typingFrom].name} is typing…
            </span>
          </motion.li>
        </motion.ul>

        {/* input bar */}
        <div
          className="flex items-center gap-2 border-t-2 border-ink bg-white px-4 py-3"
          aria-hidden="true"
        >
          <span className="flex-1 rounded-full border-2 border-ink/25 px-4 py-2 text-sm text-ink/45">
            Type a message
          </span>
          <span className="h-9 w-9 rounded-full border-2 border-ink bg-coral" />
        </div>
      </div>

      <p className="absolute -bottom-9 -left-1 -rotate-3 font-scribble text-2xl leading-none text-gold">
        {CHAT.aside}
      </p>
    </motion.div>
  );
}
