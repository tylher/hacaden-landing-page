// Shared design tokens for the Hacaden landing page ("Gift Atlas" style).
// Fonts are CSS variables set by next/font in app/layout.js.

export const COLORS = {
  paper: "#FFF6E8",
  ink: "#2B1A17",
  coral: "#FF6B4A",
  gold: "#FFC233",
  teal: "#1A6B6B",
  berry: "#D6336C",
  sky: "#8FD3F4",
};

export const FONTS = {
  display: "var(--font-bricolage), system-ui, sans-serif",
  body: "var(--font-dm-sans), system-ui, sans-serif",
  scribble: "var(--font-caveat-brush), cursive",
  mono: "var(--font-jetbrains-mono), ui-monospace, monospace",
};

// chunky offset shadow used on stickers, cards and buttons
export const hardShadow = (px = 4) => `${px}px ${px}px 0 ${COLORS.ink}`;

// shared Framer Motion spring presets
export const SPRINGS = {
  pop: { type: "spring", stiffness: 380, damping: 15 },
  stamp: { type: "spring", stiffness: 520, damping: 17 },
  soft: { type: "spring", stiffness: 220, damping: 24 },
};
