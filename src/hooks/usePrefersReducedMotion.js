"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Like framer-motion's useReducedMotion, but safe for server rendering.
 * The server can't know the user's setting, so the first client render must
 * also say "false" or React reports a hydration mismatch. The real value is
 * applied right after mount.
 */
export default function usePrefersReducedMotion() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted ? !!reduce : false;
}
