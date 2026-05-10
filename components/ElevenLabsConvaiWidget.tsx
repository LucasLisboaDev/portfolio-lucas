"use client";

import { useEffect, createElement } from "react";
import { ELEVENLABS_AGENT_ID } from "@/data/site";

const SCRIPT_ID = "elevenlabs-convai-widget-embed";
const SCRIPT_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed";

/**
 * Floating Convai widget (ElevenLabs embed) — available on every page while the user browses.
 * Hero also offers SDK “Start voice conversation”; both use the same public agent ID.
 */
export default function ElevenLabsConvaiWidget() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
  }, []);

  // Outer layer must not steal clicks: the embed can expand an invisible hit-area over the page,
  // which makes Hero buttons feel "dead" on localhost. Only the widget subtree receives pointer events.
  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-end justify-end p-4 sm:p-6">
      <div className="pointer-events-auto max-w-full">
        {createElement("elevenlabs-convai", { "agent-id": ELEVENLABS_AGENT_ID })}
      </div>
    </div>
  );
}
