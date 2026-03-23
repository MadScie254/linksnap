"use client";
// app/[username]/TrackView.tsx
import { useEffect } from "react";

export default function TrackView({ userId }: { userId: string }) {
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }).catch(() => {});
  }, [userId]);

  return null;
}
