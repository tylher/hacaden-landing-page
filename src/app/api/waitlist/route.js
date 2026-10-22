import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * POST /api/waitlist   { "email": "ada@example.com" }
 *
 * Validates the email, then forwards it to WAITLIST_WEBHOOK_URL (any URL that
 * accepts a JSON POST: a Google Apps Script, Zapier/Make, or your own Spring
 * Boot endpoint later). Set these in .env.local (and in your host's settings):
 *   WAITLIST_WEBHOOK_URL=https://...
 *   WAITLIST_WEBHOOK_SECRET=optional-token   (sent as "Authorization: Bearer ...")
 *
 * Payload sent to the webhook: { email, source: "landing", at: ISO timestamp }
 * Without a webhook URL it only logs in development, and fails in production
 * so signups are never silently lost.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// best-effort rate limit: 5 attempts per minute per IP (per server instance)
const WINDOW_MS = 60_000;
const MAX_HITS = 5;
const hits = new Map();

function tooMany(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return recent.length > MAX_HITS;
}

const reply = (body, status = 200) => NextResponse.json(body, { status });

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return reply({ ok: false, error: "bad_request" }, 400);
  }

  // honeypot: real people never fill this hidden field, bots usually do
  if (body?.website) return reply({ ok: true });

  const email = String(body?.email ?? "")
    .trim()
    .toLowerCase();
  if (!email || email.length > 254 || !EMAIL.test(email)) {
    return reply({ ok: false, error: "invalid_email" }, 400);
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooMany(ip)) return reply({ ok: false, error: "rate_limited" }, 429);

  const url = process.env.WAITLIST_WEBHOOK_URL;
  if (!url) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[waitlist] no WAITLIST_WEBHOOK_URL set, would save:", email);
      return reply({ ok: true });
    }
    console.error("[waitlist] WAITLIST_WEBHOOK_URL is not set");
    return reply({ ok: false, error: "not_configured" }, 500);
  }

  try {
    const secret = process.env.WAITLIST_WEBHOOK_SECRET;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
      },
      body: JSON.stringify({
        email,
        source: "landing",
        at: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webhook responded ${res.status}`);
    return reply({ ok: true });
  } catch (err) {
    console.error("[waitlist] could not save signup:", err.message);
    return reply({ ok: false, error: "upstream_failed" }, 502);
  }
}
