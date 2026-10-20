import { FOOTER } from "@/data/story";

// Closing note of the page: the party is over, the trail ends here.
export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-ink text-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,246,232,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 pb-12 pt-40 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-5xl font-extrabold tracking-[-0.03em] sm:text-6xl">
            haca<span className="text-coral">den</span>
          </p>
          <p className="mt-3 font-scribble text-2xl text-gold">
            {FOOTER.tagline}
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-8 gap-y-3 text-base font-semibold"
        >
          {FOOTER.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="underline decoration-gold decoration-2 underline-offset-4 hover:text-gold"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="mx-auto max-w-7xl px-5 pb-8 text-sm text-paper/60 sm:px-8">
        {FOOTER.legal}
      </p>
    </footer>
  );
}
