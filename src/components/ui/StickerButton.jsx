// Chunky sticker-style button: hard shadow, presses down on click.
// Renders a link when `href` is given, otherwise a button.

const BASE =
  "inline-flex min-h-12 items-center justify-center rounded-full border-2 border-ink px-7 py-3 font-display text-base font-bold text-ink shadow-[5px_5px_0_#2B1A17] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#2B1A17] active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0_0_0_#2B1A17] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/40";

const TONES = {
  primary: "bg-coral hover:bg-gold",
  secondary: "bg-paper hover:bg-white",
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
