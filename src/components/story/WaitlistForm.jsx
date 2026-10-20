"use client";

import StickerButton from "@/components/ui/StickerButton";
import { WAITLIST } from "@/data/story";
import { useId, useState } from "react";
import { FaCheck } from "react-icons/fa";

const EMAIL = /^\S+@\S+\.\S+$/;

/**
 * Email capture for the waitlist.
 * TODO: replace the fake delay below with your real endpoint, for example
 *   await fetch("/api/waitlist", { method: "POST", body: JSON.stringify({ email }) })
 * `onJoined` fires after a successful signup (used for the confetti).
 */
export default function WaitlistForm({ onJoined }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | busy | done | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setStatus("error");
      return;
    }
    setStatus("busy");
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // TODO: real request
      setStatus("done");
      onJoined?.();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        role="status"
        className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-white p-4"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-teal text-paper">
          <FaCheck aria-hidden="true" />
        </span>
        <p className="font-display text-lg font-extrabold leading-tight">
          {WAITLIST.success}
        </p>
      </div>
    );
  }

  const hasError = status === "error";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor={id} className="block text-sm font-bold">
        {WAITLIST.label}
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (hasError) setStatus("idle");
          }}
          placeholder={WAITLIST.placeholder}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className="min-h-12 w-full flex-1 rounded-xl border-2 border-ink bg-white px-4 text-base font-medium text-ink placeholder:text-ink/40 focus:border-coral focus:outline-none"
        />
        <StickerButton
          type="submit"
          disabled={status === "busy"}
          className="shrink-0"
        >
          {status === "busy" ? WAITLIST.busy : WAITLIST.button}
        </StickerButton>
      </div>
      <p
        id={`${id}-error`}
        role="alert"
        className="mt-2 min-h-5 text-sm font-semibold text-berry"
      >
        {hasError ? WAITLIST.error : ""}
      </p>
      <p className="mt-1 text-xs text-ink/60">{WAITLIST.fine}</p>
    </form>
  );
}
