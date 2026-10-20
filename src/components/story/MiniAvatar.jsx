import Avatar from "@/components/hero/Avatar";
import { FRIENDS } from "@/data/hero";

const BY_ID = Object.fromEntries(FRIENDS.map((f) => [f.id, f]));

// Round avatar sticker for one of the five friends (ids from data/hero.js).
export default function MiniAvatar({ id, size = 28 }) {
  return (
    <div
      className="shrink-0 overflow-hidden rounded-full border-2 border-ink bg-white"
      style={{ width: size, height: size }}
    >
      <Avatar look={BY_ID[id].look} />
    </div>
  );
}
