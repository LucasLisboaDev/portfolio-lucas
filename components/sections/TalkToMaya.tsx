"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Conversation as AgentConversation } from "@elevenlabs/client";
import MayaOrb, { OrbState } from "@/components/MayaOrb";
import Reveal from "@/components/motion/Reveal";
import PillButton from "@/components/ui/PillButton";
import { Mic } from "@/components/ui/icons";
import { ELEVENLABS_AGENT_ID } from "@/data/site";

/** Volume readers exist on voice sessions; checked by shape, not by class. */
type VolumeReader = { getOutputVolume: () => number; getInputVolume: () => number };
const hasVolume = (c: unknown): c is VolumeReader =>
  typeof (c as VolumeReader)?.getOutputVolume === "function" &&
  typeof (c as VolumeReader)?.getInputVolume === "function";

const statusLabel: Record<OrbState, string> = {
  [OrbState.THINKING]: "Connecting to Maya…",
  [OrbState.LISTENING]: "Maya is listening",
  [OrbState.SPEAKING]: "Maya is speaking",
  [OrbState.ERROR]: "Something went wrong",
};

/**
 * Talk to Maya: the ElevenLabs voice agent section.
 *
 * The session logic is carried over unchanged from the original hero
 * (websocket first, WebRTC fallback, 30s timeouts, live volume driving the
 * orb). What changed:
 *
 * - The @elevenlabs/client library (and the LiveKit audio stack it brings,
 *   about 121 KB compressed) now loads only when someone presses "Start voice
 *   conversation". The old hero imported it at the top of the file for an
 *   instanceof check, which made every visitor download it on page load.
 *   The volume check now looks at the object's shape instead.
 * - Restyled in the redesign, with an idle orb in the brand palette and a
 *   live status line for screen readers.
 */
export default function TalkToMaya() {
  const [sessionActive, setSessionActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [orbPhase, setOrbPhase] = useState<OrbState | null>(null);
  const [orbOutputLevel, setOrbOutputLevel] = useState(0);
  const [orbInputLevel, setOrbInputLevel] = useState(0);

  const conversationRef = useRef<AgentConversation | null>(null);

  const endConversation = useCallback(async () => {
    setEnding(true);
    setSessionError(null);
    setOrbPhase(null);
    setOrbOutputLevel(0);
    setOrbInputLevel(0);
    try {
      await conversationRef.current?.endSession();
    } finally {
      conversationRef.current = null;
      setSessionActive(false);
      setEnding(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      void conversationRef.current?.endSession();
      conversationRef.current = null;
    };
  }, []);

  useEffect(() => {
    const conv = conversationRef.current;
    if (!sessionActive || !conv) {
      setOrbOutputLevel(0);
      setOrbInputLevel(0);
      return;
    }
    if (!hasVolume(conv)) return;

    let frame = 0;
    const tick = () => {
      try {
        setOrbOutputLevel(Math.min(1, Math.max(0, conv.getOutputVolume())));
        setOrbInputLevel(Math.min(1, Math.max(0, conv.getInputVolume())));
      } catch {
        // ignore transient read errors
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [sessionActive]);

  const startConversation = async () => {
    if (sessionActive || connecting) return;

    setSessionError(null);
    setConnecting(true);
    setOrbPhase(OrbState.THINKING);

    // Do not call getUserMedia here: @elevenlabs/client requests the mic again inside
    // startSession. A second open stream often breaks the session on Chrome/Safari.

    if (!navigator.mediaDevices?.getUserMedia) {
      setSessionError(
        "Your browser can't reach a microphone here. Try again on a secure (https) page.",
      );
      setConnecting(false);
      setOrbPhase(OrbState.ERROR);
      window.setTimeout(() => setOrbPhase(null), 4000);
      return;
    }

    const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
      new Promise((resolve, reject) => {
        const id = window.setTimeout(() => {
          reject(new Error(`${label} timed out after ${ms / 1000}s. Check your network or try again.`));
        }, ms);
        promise.then(
          (v) => {
            window.clearTimeout(id);
            resolve(v);
          },
          (e) => {
            window.clearTimeout(id);
            reject(e);
          },
        );
      });

    const voiceCallbacks = {
      onDisconnect: () => {
        conversationRef.current = null;
        setSessionActive(false);
        setOrbPhase(null);
        setOrbOutputLevel(0);
        setOrbInputLevel(0);
      },
      onStatusChange: ({ status }: { status: string }) => {
        if (status === "connecting") setOrbPhase(OrbState.THINKING);
        if (status === "connected") {
          setOrbPhase((prev) => (prev === OrbState.THINKING ? OrbState.LISTENING : prev));
        }
      },
      onModeChange: ({ mode }: { mode: "speaking" | "listening" }) => {
        setOrbPhase(mode === "speaking" ? OrbState.SPEAKING : OrbState.LISTENING);
      },
      onError: () => {
        setOrbPhase(OrbState.ERROR);
        window.setTimeout(() => setOrbPhase(null), 4500);
      },
    };

    try {
      // Loaded on demand: this is the only place the voice library is imported.
      const { Conversation } = await import("@elevenlabs/client");

      let conversation: AgentConversation;
      try {
        conversation = await withTimeout(
          Conversation.startSession({
            agentId: ELEVENLABS_AGENT_ID,
            useWakeLock: false,
            ...voiceCallbacks,
            connectionType: "websocket" as const,
          }),
          30000,
          "WebSocket",
        );
      } catch {
        conversation = await withTimeout(
          Conversation.startSession({
            agentId: ELEVENLABS_AGENT_ID,
            useWakeLock: false,
            ...voiceCallbacks,
            connectionType: "webrtc" as const,
          }),
          30000,
          "WebRTC",
        );
      }

      conversationRef.current = conversation;
      setSessionActive(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : "Could not start the voice session.";
      setSessionError(message);
      setOrbPhase(OrbState.ERROR);
      window.setTimeout(() => setOrbPhase(null), 4500);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <section id="maya" aria-labelledby="maya-h" className="py-10 md:py-28">
      <div className="mx-auto max-w-content px-gutter-sm md:px-gutter">
        <Reveal className="grid items-center gap-8 rounded-card bg-surface p-7 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-12 md:p-16">
          <div className="order-2 flex flex-col gap-5 md:order-1">
            <span className="text-display stretch-normal text-meta tracking-[0.08em] text-accent">/Talk to Maya</span>
            <h2 id="maya-h" className="font-display text-[28px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[44px]">
              Ask my AI voice agent about my work, in real time.
            </h2>
            <p className="max-w-[520px] text-sm leading-[1.65] text-muted md:text-base">
              I built Maya on ElevenLabs so visitors can ask about my background, projects, and experience out
              loud. Your browser will ask for microphone access. Nothing is recorded by this site, and audio is
              handled by ElevenLabs under their terms.
            </p>

            {sessionError && (
              <p role="alert" className="rounded-card bg-red-50 px-4 py-3 text-sm text-red-800">
                {sessionError}
              </p>
            )}

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              {!sessionActive ? (
                <PillButton
                  onClick={startConversation}
                  disabled={connecting}
                  icon={<Mic size={16} />}
                  className="w-full sm:w-auto"
                >
                  {connecting ? "Connecting…" : "Start voice conversation"}
                </PillButton>
              ) : (
                <PillButton
                  variant="secondary"
                  onClick={endConversation}
                  disabled={ending}
                  className="w-full sm:w-auto"
                >
                  {ending ? "Ending…" : "End conversation"}
                </PillButton>
              )}
              <p aria-live="polite" className="text-sm font-medium text-ink">
                {orbPhase !== null ? statusLabel[orbPhase] : ""}
              </p>
            </div>
          </div>

          <div className="order-1 flex h-[200px] items-center justify-center md:order-2 md:h-[300px]" aria-hidden="true">
            {orbPhase !== null ? (
              <MayaOrb state={orbPhase} size={180} outputLevel={orbOutputLevel} inputLevel={orbInputLevel} />
            ) : (
              <div className="relative flex items-center justify-center">
                <span className="orb-ring absolute h-[160px] w-[160px] rounded-full border border-accent-soft md:h-[230px] md:w-[230px]" />
                <span
                  className="orb-ring absolute h-[160px] w-[160px] rounded-full border border-accent-soft md:h-[230px] md:w-[230px]"
                  style={{ animationDelay: "1.5s" }}
                />
                <span
                  className="orb-breathe block h-[140px] w-[140px] rounded-full shadow-[0_30px_80px_rgb(94_58_48/0.35)] md:h-[210px] md:w-[210px]"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 30%, #F4E9E3 0%, #CEB3A6 30%, #9C6455 65%, #5E3A30 100%)",
                  }}
                />
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
