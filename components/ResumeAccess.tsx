"use client";

import { useCallback, useEffect, useState } from "react";

export default function ResumeAccess() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

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

  const closeModal = () => {
    setIsOpen(false);
    setStatus({ type: null, message: "" });
  };

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
      <button
        type="button"
        onClick={openModal}
        className="inline-block border-2 border-purple-primary text-purple-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-primary hover:text-white transition-colors"
      >
        View Resume
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-access-title"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3
                  id="resume-access-title"
                  className="text-2xl font-bold text-gray-900"
                >
                  {hasAccess ? "Your resume" : "Access my resume"}
                </h3>
                <p className="text-gray-600 mt-2 text-sm">
                  {hasAccess
                    ? "Open in the browser or save a copy."
                    : "Enter your email to view or download my resume."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {hasAccess ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/api/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-purple-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-dark transition-colors"
                >
                  View PDF
                </a>
                <a
                  href="/api/resume?download=1"
                  className="flex-1 text-center border-2 border-purple-primary text-purple-primary px-6 py-3 rounded-lg font-semibold hover:bg-purple-primary hover:text-white transition-colors"
                >
                  Download
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="resume-email" className="block text-gray-900 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="resume-email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 border-2 border-purple-light rounded-lg focus:outline-none focus:border-purple-primary transition-colors"
                    placeholder="you@company.com"
                  />
                </div>

                {status.type && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      status.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Verifying..." : "Continue"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
