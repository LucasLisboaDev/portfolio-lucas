"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PillButton from "@/components/ui/PillButton";
import { Close } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type ResumeAccessProps = {
  /** Stretch the trigger button to full width (phones). */
  block?: boolean;
  className?: string;
};

/**
 * "View Resume" button plus the email-gated resume dialog.
 *
 * The access logic is unchanged from the original component: it checks
 * /api/resume-access on load, asks for an email when needed, and then offers
 * /api/resume to view or download. Phase 2 restyled it in the new design and
 * added Escape to close, focus moving into the dialog on open, and focus
 * returning to the button on close.
 */
export default function ResumeAccess({ block = false, className }: ResumeAccessProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const triggerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const checkAccess = useCallback(async () => {
    try {
      const response = await fetch("/api/resume-access");
      const data = await response.json();
      if (data.granted) {
        setHasAccess(true);
      }
    } catch {
      // Ignore; user can submit email again
    }
  }, []);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  const openModal = () => {
    setIsOpen(true);
    setStatus({ type: null, message: "" });
  };

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setStatus({ type: null, message: "" });
    triggerRef.current?.querySelector("button")?.focus();
  }, []);

  // Escape closes the dialog; focus moves to its first field or action.
  useEffect(() => {
    if (!isOpen) return;
    const first = dialogRef.current?.querySelector<HTMLElement>("input, a[href], button:not([aria-label='Close'])");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/resume-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        setHasAccess(true);
        setStatus({
          type: "success",
          message: "You're all set. View or download the resume below.",
        });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Failed to verify access. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div ref={triggerRef} className={cn(block && "w-full", className)}>
        <PillButton variant="secondary" block={block} onClick={openModal} aria-haspopup="dialog">
          View Resume
        </PillButton>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-access-title"
            aria-describedby="resume-access-desc"
            className="w-full max-w-md rounded-card bg-canvas p-8 text-ink shadow-float"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8 flex items-start justify-between gap-4">
              <div className="flex flex-col gap-3">
                <span className="text-display stretch-normal text-meta tracking-[0.08em] text-accent">/Resume</span>
                <h3 id="resume-access-title" className="font-display text-2xl font-bold">
                  {hasAccess ? "Your copy is ready" : "Access my resume"}
                </h3>
                <p id="resume-access-desc" className="text-sm leading-relaxed text-muted">
                  {hasAccess
                    ? "Open it in the browser or save a copy."
                    : "Enter your email to view or download my resume."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line transition-colors duration-fast hover:bg-ink hover:text-canvas"
              >
                <Close size={18} />
              </button>
            </div>

            {hasAccess ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <PillButton href="/api/resume" target="_blank" rel="noopener noreferrer" arrow className="flex-1">
                  View PDF
                </PillButton>
                <PillButton href="/api/resume?download=1" variant="secondary" className="flex-1">
                  Download
                </PillButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className="w-full rounded-none border-0 border-b border-line bg-transparent py-3.5 text-[17px] font-normal normal-case tracking-normal text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-0"
                  />
                </label>

                {status.type && (
                  <p
                    role={status.type === "error" ? "alert" : "status"}
                    className={cn(
                      "rounded-card px-4 py-3 text-sm",
                      status.type === "success" ? "bg-surface text-ink" : "bg-red-50 text-red-800",
                    )}
                  >
                    {status.message}
                  </p>
                )}

                <PillButton type="submit" disabled={isSubmitting} block arrow={!isSubmitting}>
                  {isSubmitting ? "Verifying…" : "Continue"}
                </PillButton>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
