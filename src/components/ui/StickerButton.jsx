// Chunky sticker-style button: hard shadow, presses down on click.
// Renders a link when `href` is given, otherwise a button.
// Variants: primary (coral), secondary (paper), onDark (coral, for ink backgrounds).

const BASE =
  "inline-flex min-h-12 items-center justify-center rounded-full border-2 px-7 py-3 font-display text-base font-bold text-ink transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[5px] active:translate-y-[5px] disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/40";

const TONES = {
  primary:
    "border-ink bg-coral shadow-[5px_5px_0_#2B1A17] hover:bg-gold hover:shadow-[7px_7px_0_#2B1A17] active:shadow-[0_0_0_#2B1A17]",
  secondary:
    "border-ink bg-paper shadow-[5px_5px_0_#2B1A17] hover:bg-white hover:shadow-[7px_7px_0_#2B1A17] active:shadow-[0_0_0_#2B1A17]",
  onDark:
    "border-paper bg-coral shadow-[5px_5px_0_#FFF6E8] hover:bg-gold hover:shadow-[7px_7px_0_#FFF6E8] active:shadow-[0_0_0_#FFF6E8] focus-visible:ring-gold/60",
};

export default function StickerButton({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const classes = `${BASE} ${TONES[variant]} ${className}`;
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
