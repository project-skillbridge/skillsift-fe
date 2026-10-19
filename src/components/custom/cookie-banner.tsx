"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "skillbridge_cookie_consent";
const STORAGE_EVENT = "skillbridge_cookie_consent_change";

function subscribe(callback: () => void) {
  window.addEventListener(STORAGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(STORAGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot() {
  return null;
}

function setConsent(value: "accepted" | "dismissed") {
  localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function CookieBanner() {
  const consent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const handleAccept = useCallback(() => setConsent("accepted"), []);
  const handleManage = useCallback(() => setConsent("dismissed"), []);

  if (consent !== null) return null;

  return (
    <div className="border-t border-border/60 bg-background py-4 shadow-sm">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            We use cookies to improve your experience on SkillSift
          </p>
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={handleAccept}>
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={handleManage}>
              Manage Cookies
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
