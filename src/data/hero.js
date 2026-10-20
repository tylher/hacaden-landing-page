import { COLORS } from "./theme";

/* ------------------------------------------------------------------
   COPY
------------------------------------------------------------------ */
export const HERO_COPY = {
  eyebrow: "Group gifting, made simple",
  headline: {
    first: "One gift.",
    before: "Every",
    circled: "hand",
    after: "in it.",
  },
  subhead:
    "Start a group gift in under a minute. Share one link, everyone chips in, and nobody fronts the money or chases friends.",
  primaryCta: { label: "Start a gift", href: "#waitlist" },
  secondaryCta: { label: "See how it works", href: "#how-it-works" },
  notes: {
    cta: "takes 60 seconds",
    extra: "no app needed to chip in",
  },
};

/* ------------------------------------------------------------------
   STAGE GEOMETRY
   Everything on the art stage is positioned in this 640 x 640 space
   and converted to percentages, so it scales with the container.
------------------------------------------------------------------ */
export const STAGE = { width: 640, height: 640 };

export const AVATAR_SIZE = 76;
export const STAMP_SIZE = 70;

// the die-cut group photo (sticker outline and shadow are baked into the PNG)
export const GROUP = {
  src: "/images/hacaden-hero-sticker.png",
  alt: "Four friends in party hats gathered around a wrapped gift",
  width: 1084,
  height: 1233,
  x: 320, // center
  y: 350,
  w: 316, // display width in stage units
  rotate: -2,
};

// where the gift box sits on the stage (coins fly here, confetti bursts from here)
export const GIFT = { x: 299, y: 343 };

/* ------------------------------------------------------------------
   FRIENDS
   Each friend: an illustrated avatar, a dotted route into the gift, a
   coin that travels the route, and a stamp that lands on arrival.
   Mixed currencies on purpose: Hacaden is for anyone, anywhere.
   `delay` is when the route starts drawing (seconds after reveal).
------------------------------------------------------------------ */
export const FRIENDS = [
  {
    id: "ada",
    name: "Ada",
    city: "Lagos",
    x: 86,
    y: 96,
    tilt: -4,
    look: { skin: "#8D5524", hair: "#1B1210", style: "curly", bg: COLORS.gold, shirt: COLORS.coral },
    route: "M86 96 C150 230 220 320 300 345",
    amount: "₦5,000",
    stamp: { x: 178, y: 255, rot: -9, color: COLORS.coral },
    delay: 0.6,
  },
  {
    id: "sam",
    name: "Sam",
    city: "London",
    x: 556,
    y: 112,
    tilt: 5,
    look: { skin: "#F2C9A5", hair: "#6B4423", style: "short", bg: COLORS.sky, shirt: COLORS.teal },
    route: "M556 112 C480 235 400 320 300 345",
    amount: "£15",
    stamp: { x: 462, y: 250, rot: 7, color: COLORS.teal },
    delay: 1.0,
  },
  {
    id: "leo",
    name: "Leo",
    city: "Toronto",
    x: 62,
    y: 330,
    tilt: -6,
    look: { skin: "#C68642", hair: "#1B1210", style: "cap", bg: COLORS.coral, shirt: COLORS.ink, cap: COLORS.berry },
    route: "M62 330 C140 400 230 395 300 345",
    amount: "$20",
    stamp: { x: 172, y: 435, rot: -6, color: COLORS.berry },
    delay: 1.4,
  },
  {
    id: "mei",
    name: "Mei",
    city: "Tokyo",
    x: 96,
    y: 560,
    tilt: 4,
    look: { skin: "#F5D0B0", hair: "#1B1210", style: "long", bg: COLORS.berry, shirt: COLORS.gold },
    route: "M96 560 C150 470 230 410 300 345",
    amount: "¥2,000",
    stamp: { x: 305, y: 522, rot: 5, color: COLORS.ink },
    delay: 1.8,
  },
  {
    id: "noa",
    name: "Noa",
    city: "Paris",
    x: 548,
    y: 548,
    tilt: -5,
    look: { skin: "#E0AC69", hair: "#A5522B", style: "bun", bg: COLORS.teal, shirt: COLORS.sky },
    route: "M548 548 C490 470 400 410 300 345",
    amount: "€10",
    stamp: { x: 466, y: 432, rot: 8, color: COLORS.teal },
    delay: 2.2,
  },
];

/* ------------------------------------------------------------------
   TRACKER (the luggage tag at the top of the stage)
------------------------------------------------------------------ */
export const TRACKER = {
  title: "Maya's 30th",
  total: 12,
  startAt: 3, // people already in before the animation; each landed coin adds one
  x: 320,
  y: 62,
  w: 210,
};

/* ------------------------------------------------------------------
   CONFETTI (deterministic, so server and client always match)
------------------------------------------------------------------ */
const CONFETTI_COLORS = [COLORS.coral, COLORS.gold, COLORS.teal, COLORS.berry, COLORS.sky];
const CONFETTI_SHAPES = ["square", "circle", "triangle"];

export const CONFETTI = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2 + (i % 3) * 0.18;
  const dist = 90 + ((i * 37) % 120);
  return {
    x: Math.round(Math.cos(angle) * dist),
    y: Math.round(Math.sin(angle) * dist) - 40,
    size: 8 + ((i * 5) % 9),
    rot: ((i * 47) % 360) - 180,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    shape: CONFETTI_SHAPES[i % CONFETTI_SHAPES.length],
  };
});
