import { COLORS } from "./theme";

/* ------------------------------------------------------------------
   STORY BRIDGES
   A bridge sits on the seam between two sections: a torn sheet of the
   previous section's color, plus a dotted trail (and a coin) that is drawn
   as you scroll. The trail changes color as it crosses from one section
   into the next, so the page reads as one continuous journey.
------------------------------------------------------------------ */
export const BRIDGES = {
  heroToProblem: {
    fromColor: COLORS.paper,
    topColor: COLORS.ink,
    bottomColor: COLORS.gold,
    note: "wait, rewind.",
    noteTone: "light",
  },
  problemToNext: {
    fromColor: COLORS.teal,
    topColor: COLORS.gold,
    bottomColor: COLORS.ink,
    note: "there's a better way.",
    noteTone: "dark",
  },
  howToNext: {
    fromColor: COLORS.paper,
    topColor: COLORS.ink,
    bottomColor: COLORS.ink,
    note: "and now, the best part.",
    noteTone: "dark",
  },
};

/* ------------------------------------------------------------------
   SECTION 2: THE PROBLEM ("how it usually goes")
------------------------------------------------------------------ */
export const PROBLEM = {
  eyebrow: "Sound familiar?",
  headline: { before: "Getting everyone in is the", highlight: "hard part." },
  body: "Someone starts the group chat, someone fronts the money, someone sends the third reminder. By the time the gift arrives, the organizer is worn out and nobody can say who paid.",
  points: [
    {
      title: "One person carries it all",
      text: "The organizer fronts the money and tracks every transfer by hand.",
      color: COLORS.coral,
      numeralColor: COLORS.ink,
    },
    {
      title: "Chasing friends is awkward",
      text: "Reminders feel like nagging, so they get skipped.",
      color: COLORS.gold,
      numeralColor: COLORS.ink,
    },
    {
      title: "Nobody knows who paid",
      text: "Screenshots, bank alerts and a lot of guessing.",
      color: COLORS.berry,
      numeralColor: COLORS.paper,
    },
  ],
};

// The same five friends from the hero, now stuck in the group chat.
// `from` matches an id in FRIENDS (data/hero.js); `mine` is the organizer.
export const CHAT = {
  title: "Theo's surprise",
  members: "5 members",
  unread: "47 unread",
  typingFrom: "leo",
  aside: "scroll. screenshot. repeat.",
  messages: [
    { from: "ada", text: "ok so what are we getting Theo??" },
    { from: "sam", text: "cash is easier tbh" },
    {
      from: "leo",
      text: "send it to Mei's account, she'll sort it",
      note: "who's holding the money?",
    },
    {
      from: "mei",
      mine: true,
      text: "sent! proof of payment attached",
      attachment: "proof-of-payment.jpg",
    },
    { from: "noa", text: "who hasn't paid yet??" },
    { from: "sam", text: "I'll send tomorrow!!", note: "...tomorrow?" },
    { from: "mei", mine: true, text: "reminder: 4 people still haven't sent" },
  ],
};



/* ------------------------------------------------------------------
   SECTION 3: HOW IT WORKS ("there's a better way")
   `mock` picks which illustration appears next to each step.
------------------------------------------------------------------ */
export const HOW = {
  eyebrow: "Here's how it works",
  headline: { before: "One link. Three steps.", highlight: "Everyone's in." },
  body: "No group chat archaeology, no screenshots of transfers. Just a trail from \"let's get Theo something\" to a gift that's on its way.",
  steps: [
    {
      title: "Start a pool",
      text: "Name the gift, set a goal and a deadline. No guest list, and nobody else needs an account.",
      note: "60 seconds, tops",
      color: COLORS.coral,
      numeralColor: COLORS.ink,
      mock: "form",
    },
    {
      title: "Share one link",
      text: "Drop it into the chat everyone's already in. One link replaces the screenshots and the spreadsheet.",
      note: "no new app for them",
      color: COLORS.gold,
      numeralColor: COLORS.ink,
      mock: "share",
    },
    {
      title: "Everyone chips in",
      text: "Friends pay by card or transfer in a few taps, even from another country. You watch the pool fill up, and nobody chases anyone.",
      note: "yes, even the one abroad",
      color: COLORS.teal,
      numeralColor: COLORS.paper,
      mock: "track",
    },
  ],
};

// Content of the three small illustrations. `from` ids match FRIENDS (data/hero.js).
export const MOCKS = {
  form: {
    title: "New pool",
    fields: [
      { label: "What's the gift for?", value: "Theo's 30th" },
      { label: "Goal", value: "₦250,000", mono: true },
      { label: "Deadline", value: "Fri, 20 Nov" },
    ],
    button: "Create pool",
  },
  share: {
    chatTitle: "Theo's surprise",
    from: "mei",
    text: "Everyone chip in here:",
    link: {
      title: "Theo's 30th",
      url: "hacaden.app/theo-30th", // placeholder domain
      caption: "8 of 12 are in",
    },
    replies: [
      { from: "ada", text: "paid!" },
      { from: "sam", text: "done" },
      { from: "noa", text: "paid from Paris!" },
    ],
  },
  track: {
    title: "Theo's 30th",
    from: 3, // people in when the animation starts
    count: 8,
    total: 12,
    feed: [
      { who: "ada", amount: "₦5,000", city: "Lagos" },
      { who: "sam", amount: "£15", city: "London" },
      { who: "noa", amount: "€10", city: "Paris" },
    ],
    cta: "Chip in",
    foot: "Card or transfer. No account needed.",
  },
};