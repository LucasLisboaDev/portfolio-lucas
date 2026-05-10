"use client";

import { useEffect, useState } from "react";

export enum OrbState {
  LISTENING = "LISTENING",
  THINKING = "THINKING",
  SPEAKING = "SPEAKING",
  ERROR = "ERROR",
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
}

/** Matches site tokens: purple primary #8B5CF6, teal primary #14B8A6, etc. */
const portfolioColors: Record<OrbState, ColorScheme> = {
  LISTENING: {
    primary: "#14B8A6",
    secondary: "#8B5CF6",
    accent: "#5EEAD4",
    glow: "#14B8A6",
  },
  THINKING: {
    primary: "#7C3AED",
    secondary: "#8B5CF6",
    accent: "#A78BFA",
    glow: "#8B5CF6",
  },
  SPEAKING: {
    primary: "#A78BFA",
    secondary: "#8B5CF6",
    accent: "#14B8A6",
    glow: "#5EEAD4",
  },
  ERROR: {
    primary: "#dc2626",
    secondary: "#ea580c",
    accent: "#b91c1c",
    glow: "#dc2626",
  },
};

interface MayaOrbProps {
  state: OrbState;
  size?: number;
  /** 0–1 agent output level (drives subtle scale while speaking). */
  outputLevel?: number;
  /** 0–1 mic input level (drives subtle scale while listening). */
  inputLevel?: number;
}

export default function MayaOrb({
  state,
  size = 200,
  outputLevel = 0,
  inputLevel = 0,
}: MayaOrbProps) {
  const [stars, setStars] = useState<
    Array<{ id: number; x: number; y: number; size: number; delay: number }>
  >([]);
  const [currentState, setCurrentState] = useState<OrbState>(state);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentColors = portfolioColors[currentState];

  useEffect(() => {
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.3,
      delay: Math.random() * 4,
    }));
    setStars(newStars);
  }, []);

  useEffect(() => {
    if (state !== currentState) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setCurrentState(state);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [state, currentState]);

  const getOrbClasses = () => {
    const baseClasses =
      "relative rounded-full transition-all duration-500 ease-in-out";

    switch (currentState) {
      case OrbState.LISTENING:
        return `${baseClasses} animate-pulse`;
      case OrbState.THINKING:
        return `${baseClasses}`;
      case OrbState.SPEAKING:
        return `${baseClasses} animate-breathe`;
      case OrbState.ERROR:
        return `${baseClasses} animate-pulse`;
      default:
        return baseClasses;
    }
  };

  const getAnimationSpeed = () => {
    const listenBoost = 1 - Math.min(1, Math.max(0, inputLevel)) * 0.35;
    switch (currentState) {
      case OrbState.LISTENING:
        return `${10 * listenBoost}s`;
      case OrbState.THINKING:
        return "5s";
      case OrbState.SPEAKING: {
        const boost = 1 - Math.min(1, Math.max(0, outputLevel)) * 0.4;
        return `${5 * boost}s`;
      }
      case OrbState.ERROR:
        return "2s";
      default:
        return "20s";
    }
  };

  const energyScale = () => {
    const out = Math.min(1, Math.max(0, outputLevel));
    const inn = Math.min(1, Math.max(0, inputLevel));
    if (currentState === OrbState.SPEAKING) return 1 + 0.14 * out;
    if (currentState === OrbState.LISTENING) return 1 + 0.06 * inn;
    return 1;
  };

  const SoundWaves = () => {
    if (currentState !== OrbState.SPEAKING) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center">
        {[1, 2, 3, 4].map((wave) => (
          <div
            key={wave}
            className="absolute rounded-full border-2 animate-ping"
            style={{
              width: size + wave * 40,
              height: size + wave * 40,
              borderColor: `${currentColors.primary}${Math.max(100 - wave * 15, 10)}`,
              animationDelay: `${wave * 0.3}s`,
              animationDuration: `${2.2 - outputLevel * 0.8}s`,
              animationIterationCount: "infinite",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center p-4 sm:p-6">
      <div className="relative">
        <SoundWaves />

        <div
          className={getOrbClasses()}
          style={{
            width: size,
            height: size,
            transform: `scale(${energyScale()})`,
            transition: "transform 90ms ease-out, opacity 500ms ease-in-out",
            filter: `drop-shadow(0 8px ${size * 0.3}px ${currentColors.glow}40) drop-shadow(0 0 ${size * 0.15}px ${currentColors.glow}60)`,
            opacity: isTransitioning ? 0.7 : 1,
          }}
        >
          <div
            className="absolute inset-0 rounded-full transition-all duration-500 ease-in-out"
            style={{
              background: `
                radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.8), transparent 40%),
                radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.3), transparent 50%),
                linear-gradient(180deg, 
                  ${currentColors.accent}95 0%, 
                  ${currentColors.secondary}85 30%, 
                  ${currentColors.secondary}75 50%, 
                  ${currentColors.primary}70 70%, 
                  ${currentColors.primary}60 100%
                )
              `,
              backdropFilter: "blur(0.5px)",
              border: `2px solid rgba(255, 255, 255, 0.4)`,
              boxShadow: `
                inset 0 0 ${size * 0.1}px rgba(255, 255, 255, 0.3),
                inset 0 ${size * 0.05}px ${size * 0.1}px rgba(255, 255, 255, 0.2),
                0 0 ${size * 0.05}px ${currentColors.glow}30
              `,
            }}
          />

          <div
            className="absolute inset-2 rounded-full overflow-hidden transition-all duration-500 ease-in-out"
            style={{
              animation: `spin ${getAnimationSpeed()} linear infinite reverse`,
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(ellipse 70% 50% at 20% 80%, ${currentColors.primary}80, transparent 80%),
                  radial-gradient(ellipse 50% 70% at 80% 20%, ${currentColors.secondary}70, transparent 70%),
                  radial-gradient(ellipse 60% 40% at 60% 60%, ${currentColors.accent}60, transparent 60%)
                `,
                filter: "blur(1px)",
              }}
            />
          </div>

          <div
            className="absolute inset-4 rounded-full overflow-hidden transition-all duration-500 ease-in-out"
            style={{
              animation: `spin ${Number.parseFloat(getAnimationSpeed()) * 0.6}s linear infinite reverse`,
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(ellipse 80% 30% at 30% 70%, ${currentColors.secondary}60, transparent 70%),
                  radial-gradient(ellipse 40% 80% at 70% 30%, ${currentColors.primary}55, transparent 80%),
                  conic-gradient(from 180deg, transparent 30%, ${currentColors.accent}45, transparent 70%)
                `,
                filter: "blur(0.5px)",
              }}
            />
          </div>

          <div
            className="absolute inset-6 rounded-full overflow-hidden transition-all duration-500 ease-in-out"
            style={{
              animation: `spin ${Number.parseFloat(getAnimationSpeed()) * 0.3}s linear infinite reverse`,
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(circle at 40% 60%, ${currentColors.primary}70, transparent 70%),
                  radial-gradient(circle at 60% 40%, ${currentColors.accent}50, transparent 60%)
                `,
              }}
            />
          </div>

          <div className="absolute inset-0 rounded-full overflow-hidden">
            {stars.map((star) => (
              <div
                key={star.id}
                className="absolute rounded-full animate-pulse transition-all duration-500 ease-in-out"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  boxShadow: `0 0 ${star.size * 4}px rgba(255, 255, 255, 0.8), 0 0 ${star.size * 2}px ${currentColors.glow}60`,
                  animationDelay: `${star.delay}s`,
                  animationDuration: currentState === OrbState.ERROR ? "0.5s" : "3s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
