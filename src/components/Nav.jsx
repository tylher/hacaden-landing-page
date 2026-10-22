"use client";

import Logo from "@/components/ui/Logo";
import useReveal from "@/hooks/useReveal";
import { NAV } from "@/data/story";
import { SPRINGS } from "@/data/theme";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Floating pill at the top of the page. It slides in once the loader curtain
 * lifts, works on every section color (it is always Paper with an ink edge),
 * and highlights the section you are reading.
 */
export default function Nav() {
  const revealed = useReveal();
  const [active, setActive] = useState("");

  useEffect(() => {
    const targets = NAV.links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-3 z-50 flex justify-center px-3"
      initial={{ y: -90, opacity: 0 }}
      animate={revealed ? { y: 0, opacity: 1 } : undefined}
      transition={SPRINGS.soft}
    >
      <nav
        aria-label="Primary"
        className="flex w-full max-w-4xl items-center justify-between gap-3 rounded-full border-2 border-ink bg-paper py-2 pl-5 pr-2 shadow-[4px_4px_0_#2B1A17]"
      >
        <a
          href="#"
          aria-label="Hacaden, back to the top"
          className="flex items-center gap-2 font-display text-xl font-extrabold tracking-[-0.03em] text-ink"
        >
          <span className="w-7 shrink-0">
            <Logo />
          </span>
          <span>
            haca<span className="text-coral">den</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={active === l.href ? "location" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-gold/60 ${
                  active === l.href ? "bg-gold" : ""
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={NAV.cta.href}
          className="rounded-full border-2 border-ink bg-coral px-4 py-2 font-display text-sm font-bold text-ink shadow-[3px_3px_0_#2B1A17] transition-all hover:-translate-x-px hover:-translate-y-px hover:bg-gold hover:shadow-[4px_4px_0_#2B1A17] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
        >
          {NAV.cta.label}
        </a>
      </nav>
    </motion.header>
  );
}
