"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import type { Conversation as AgentConversation } from "@elevenlabs/client";
import { VoiceConversation } from "@elevenlabs/client";
import MayaOrb, { OrbState } from "@/components/MayaOrb";
import { ELEVENLABS_AGENT_ID } from "@/data/site";

export default function Hero() {
  const profileImages = [
    "/lucas-profile.jpeg",
    "/lucas-mdcworks.jpeg",
    "/luccas-thinkbig.jpeg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [orbPhase, setOrbPhase] = useState<OrbState | null>(null);
  const [orbOutputLevel, setOrbOutputLevel] = useState(0);
  const [orbInputLevel, setOrbInputLevel] = useState(0);

  const conversationRef = useRef<AgentConversation | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % profileImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [profileImages.length]);

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
    if (!sessionActive || !conversationRef.current) {
      setOrbOutputLevel(0);
      setOrbInputLevel(0);
      return;
    }
    const conv = conversationRef.current;
    if (!(conv instanceof VoiceConversation)) return;

    let frame = 0;
    const tick = () => {
      try {
        const out = conv.getOutputVolume();
        const inn = conv.getInputVolume();
        setOrbOutputLevel(Math.min(1, Math.max(0, out)));
        setOrbInputLevel(Math.min(1, Math.max(0, inn)));
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
    // VoiceConversation.startSession. A second open stream often breaks the session on Chrome/Safari.

    if (!navigator.mediaDevices?.getUserMedia) {
      setSessionError(
        "Microphone is not available in this context. Use https:// or http://localhost (not a raw LAN IP), then try again."
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
          }
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
          "WebSocket"
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
          "WebRTC"
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
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-gray-600 text-lg">Hey, I am</p>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Lucas Lisboa Alves
            </h1>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              AI Product Lead & <span className="text-purple-primary">Software Engineer</span>
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
              Building intelligent products at the intersection of AI, ML, and human-centered design.
              Specializing in voice-first AI systems, NLP, and computer vision to deliver transformative
              user experiences.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://linkedin.com/in/lucaslisboadev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-purple-primary transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://github.com/LucasLisboaDev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-purple-primary transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>

            <a
              href="#contact"
              className="inline-block bg-purple-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-dark transition-colors shadow-lg hover:shadow-xl"
            >
              Get In Touch
            </a>
          </div>

          <div className="relative flex items-center justify-center py-12">
            <div className="absolute top-0 left-0 w-10 h-10 text-teal-primary opacity-80 animate-pulse">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="absolute top-8 left-4 w-6 h-6 text-teal-primary opacity-70">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>

            <div className="absolute top-4 right-12 w-8 h-8 text-purple-primary opacity-80">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>

            <div className="absolute bottom-20 right-8 w-6 h-6 text-purple-primary opacity-70">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>

            <div className="absolute bottom-12 left-0 w-8 h-8 text-teal-primary opacity-75">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="absolute bottom-4 left-12 w-6 h-6 text-teal-primary opacity-70">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>

            <div className="relative w-full max-w-md z-10">
              <div className="relative bg-blue-200 rounded-2xl p-4 shadow-2xl">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
                  {profileImages.map((imageSrc, index) => (
                    <Image
                      key={imageSrc}
                      src={imageSrc}
                      alt="Lucas Lisboa"
                      fill
                      className={`object-cover absolute inset-0 transition-opacity duration-1000 ${
                        index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                      }`}
                      priority={index === 0}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-[100] mt-14 max-w-5xl mx-auto bg-gradient-to-r from-purple-50 to-teal-50 border border-purple-100 rounded-2xl p-6 md:p-8 shadow-sm">
          <div
            className={`flex flex-col gap-6 ${orbPhase !== null ? "lg:flex-row lg:items-center lg:justify-between lg:text-left" : "text-center"}`}
          >
            <div className={orbPhase !== null ? "min-w-0 flex-1 lg:pr-4" : "max-w-3xl mx-auto"}>
              <p className="text-sm font-semibold uppercase tracking-wide text-purple-primary mb-2">
                AI Assistant
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Talk to my autonomous AI agent
              </h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                I built this ElevenLabs voice agent so visitors can ask questions about my background,
                projects, and experience in real time. When you start a session, your browser will prompt
                for microphone access so the agent can hear you—nothing is recorded by this portfolio site;
                audio is handled by ElevenLabs per their terms.
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Use a secure connection (HTTPS) for voice to work reliably, especially in production.
              </p>

              {sessionError && (
                <div
                  className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-800"
                  role="alert"
                >
                  {sessionError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                {!sessionActive ? (
                  <button
                    type="button"
                    onClick={startConversation}
                    disabled={connecting}
                    className="inline-flex items-center justify-center rounded-xl bg-purple-primary px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-purple-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {connecting ? "Connecting…" : "Start voice conversation"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={endConversation}
                    disabled={ending}
                    className="inline-flex items-center justify-center rounded-xl border-2 border-gray-300 bg-white px-8 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {ending ? "Ending…" : "End conversation"}
                  </button>
                )}
              </div>
            </div>

            {orbPhase !== null && (
              <div className="flex shrink-0 justify-center lg:justify-end" aria-live="polite">
                <MayaOrb
                  state={orbPhase}
                  size={168}
                  outputLevel={orbOutputLevel}
                  inputLevel={orbInputLevel}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
