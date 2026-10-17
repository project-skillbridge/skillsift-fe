"use client";

import { useCallback, useEffect, useRef } from "react";

import type { IntegrityEvents } from "@/types/api/assessment-taker";

/**
 * Counts browser signals while a test is running: tab switches, time spent
 * away, and copy/paste attempts (which are also blocked). The server treats
 * these as hints for a human reviewer, never as proof.
 */
export function useIntegrityTracker(enabled: boolean) {
  const events = useRef<IntegrityEvents>({
    tabSwitches: 0,
    awaySeconds: 0,
    pasteAttempts: 0,
    copyAttempts: 0,
  });
  const hiddenAt = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const closeAwayWindow = () => {
      if (hiddenAt.current == null) return;
      events.current.awaySeconds += Math.round(
        (Date.now() - hiddenAt.current) / 1000,
      );
      hiddenAt.current = null;
    };
    const onVisibility = () => {
      if (document.hidden) {
        events.current.tabSwitches += 1;
        hiddenAt.current = Date.now();
      } else {
        closeAwayWindow();
      }
    };
    const block = (event: Event) => {
      if (event.type === "paste") events.current.pasteAttempts += 1;
      else if (event.type === "copy" || event.type === "cut") {
        events.current.copyAttempts += 1;
      }
      event.preventDefault();
    };

    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("paste", block);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("paste", block);
    };
  }, [enabled]);

  /** Snapshot for submission; includes any away time still in progress. */
  return useCallback((): IntegrityEvents => {
    const pending =
      hiddenAt.current == null
        ? 0
        : Math.round((Date.now() - hiddenAt.current) / 1000);
    return {
      ...events.current,
      awaySeconds: events.current.awaySeconds + pending,
    };
  }, []);
}
