import { LOGO } from "@/data/theme";
import Image from "next/image";

/**
 * The Hacaden mark. With `sticker`, it gets a white die-cut border and a hard
 * offset shadow in `shadow` (a CSS color), like the stickers across the page.
 * Size it from the parent (e.g. a width on the wrapper); it fills the width.
 */
export default function Logo({
  sticker = false,
  shadow = "#FF6B4A",
  priority = false,
  className = "",
}) {
  const white =
    "drop-shadow(3px 0 0 #fff) drop-shadow(-3px 0 0 #fff) drop-shadow(0 3px 0 #fff) drop-shadow(0 -3px 0 #fff)";
  return (
    <Image
      src={LOGO.src}
      alt={LOGO.alt}
      width={LOGO.width}
      height={LOGO.height}
      priority={priority}
      draggable={false}
      sizes="(min-width: 768px) 240px, 120px"
      className={`h-auto w-full select-none ${className}`}
      style={
        sticker
          ? { filter: `${white} drop-shadow(7px 8px 0 ${shadow})` }
          : undefined
      }
    />
  );
}
