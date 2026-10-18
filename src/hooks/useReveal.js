"use client";

import { createContext, useContext, useEffect, useState } from "react";

/**
 * HacadenLoader wraps the app in this provider and sets the value to true
 * the moment the curtain starts lifting. Anything below it can read that
 * through useReveal(). Value is null when there is no loader provider.
 */
export const LoaderRevealContext = createContext(null);

const LOADER_SELECTOR = '[aria-label="Loading Hacaden"]';
const SAFETY_MS = 12000;

/**
 * Returns true once the page is uncovered.
 *  - With the updated HacadenLoader: true exactly when the curtain starts lifting.
 *  - Without it (older loader, or none): falls back to watching for the loader
 *    overlay to disappear, with a safety timeout so content never stays hidden.
 */
export default function useReveal() {
  const fromLoader = useContext(LoaderRevealContext);
  const [fallbackRevealed, setFallbackRevealed] = useState(false);

  useEffect(() => {
    if (fromLoader !== null) return; // the loader provider is in charge

    const reveal = () => setFallbackRevealed(true);

    if (!document.querySelector(LOADER_SELECTOR)) {
      reveal();
      return;
    }

    const observer = new MutationObserver(() => {
      if (!document.querySelector(LOADER_SELECTOR)) reveal();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const safety = setTimeout(reveal, SAFETY_MS);

    return () => {
      observer.disconnect();
      clearTimeout(safety);
    };
  }, [fromLoader]);

  return fromLoader === null ? fallbackRevealed : fromLoader;
}
