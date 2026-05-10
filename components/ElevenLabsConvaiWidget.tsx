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

  // Keep the launcher in a corner so it is less likely to cover primary page controls.
  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      {createElement("elevenlabs-convai", { "agent-id": ELEVENLABS_AGENT_ID })}
    </div>
  );
}
