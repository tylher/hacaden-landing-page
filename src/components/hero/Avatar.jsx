// Simple illustrated avatar (pure SVG, no image assets needed).
// `look` comes from data/hero.js: { skin, hair, style, bg, shirt, cap? }

const INK = "#2B1A17";

const BACK_HAIR = {
  long: (c) => (
    <path
      d="M28 48 C24 22 38 14 50 14 C62 14 76 22 72 48 L75 84 L25 84 Z"
      fill={c}
    />
  ),
  curly: (c) => (
    <g fill={c}>
      <circle cx="50" cy="32" r="25" />
      <circle cx="29" cy="43" r="10" />
      <circle cx="71" cy="43" r="10" />
    </g>
  ),
  bun: (c) => <circle cx="50" cy="15" r="9" fill={c} />,
};

const FRONT_HAIR = (c) => (
  <path
    d="M31 44 C29 24 40 17 50 17 C60 17 71 24 69 44 C65 35 58 31 50 31 C42 31 35 35 31 44 Z"
    fill={c}
  />
);

export default function Avatar({ look }) {
  const { skin, hair, style, bg, shirt, cap } = look;
  return (
    <svg
      viewBox="0 0 100 100"
      className="block h-full w-full"
      aria-hidden="true"
    >
      <rect width="100" height="100" fill={bg} />
      {BACK_HAIR[style]?.(hair)}
      {/* shoulders and neck */}
      <path d="M10 100 C12 76 30 68 50 68 C70 68 88 76 90 100 Z" fill={shirt} />
      <rect x="43" y="58" width="14" height="14" rx="6" fill={skin} />
      {/* head */}
      <ellipse cx="50" cy="45" rx="19" ry="21" fill={skin} />
      {FRONT_HAIR(hair)}
      {style === "cap" && (
        <g fill={cap}>
          <path d="M30 37 C32 19 68 19 70 37 Z" />
          <rect x="27" y="35" width="46" height="5" rx="2.5" />
        </g>
      )}
      {/* face */}
      <circle cx="43" cy="47" r="2.2" fill={INK} />
      <circle cx="57" cy="47" r="2.2" fill={INK} />
      <path
        d="M42 55 Q50 62 58 55"
        fill="none"
        stroke={INK}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="37" cy="53" r="3" fill="#FF6B4A" opacity="0.25" />
      <circle cx="63" cy="53" r="3" fill="#FF6B4A" opacity="0.25" />
    </svg>
  );
}
