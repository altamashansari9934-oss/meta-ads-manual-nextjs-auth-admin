"use client";

import { useEffect } from "react";

export default function AccessHeartbeat() {
  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const response = await fetch("/api/access-check", {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin",
        });

        if (cancelled) return;

        if (response.redirected) {
          window.location.href = response.url;
          return;
        }

        const data = await response.json();
        if (!data.allowed && data.redirectTo) {
          window.location.href = data.redirectTo;
        }
      } catch {
        // Ignore transient network errors; server-side protection remains authoritative.
      }
    }

    const timer = window.setInterval(check, 30000);
    check();

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return null;
}
