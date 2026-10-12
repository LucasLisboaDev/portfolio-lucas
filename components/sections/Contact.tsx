"use client";

import { useRef, useState, type FormEvent } from "react";
import Reveal from "@/components/motion/Reveal";
import PillButton from "@/components/ui/PillButton";
import StatusPill from "@/components/ui/StatusPill";
import { cn } from "@/lib/cn";
import { CONTACT_EMAIL } from "@/data/site";

type Fields = { firstName: string; lastName: string; email: string; message: string };
type FieldErrors = Partial<Record<keyof Fields, string>>;

const empty: Fields = { firstName: "", lastName: "", email: "", message: "" };

const fieldLabels: Record<keyof Fields, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  message: "Message",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f: Fields): FieldErrors {
  const errors: FieldErrors = {};
  if (!f.firstName.trim()) errors.firstName = "Please add your first name.";
  if (!f.lastName.trim()) errors.lastName = "Please add your last name.";
  if (!f.email.trim()) errors.email = "Please add your email so I can reply.";
  else if (!EMAIL_RE.test(f.email.trim())) errors.email = "That email doesn't look quite right.";
  if (!f.message.trim()) errors.message = "Please write a short message.";
  return errors;
}

const socials = [
  { label: "LinkedIn", href: "https://linkedin.com/in/lucaslisboadev" },
  { label: "GitHub", href: "https://github.com/LucasLisboaDev" },
  { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}?subject=Portfolio%20inquiry` },
];

/**
 * Contact: the "Have a project in mind?" headline and a minimal underline form.
 *
 * It posts to the same /api/contact route as before (Resend), with the same
 * field names. Validation runs in the browser first: each problem is shown
 * under its field, linked with aria-describedby, and focus moves to the first
 * one. A hidden "website" field catches simple bots. Results are announced in
 * a live region.
 */
export default function Contact() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const update = (name: keyof Fields, value: string) => {
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const found = validate(fields);
    setErrors(found);
    const first = (Object.keys(fieldLabels) as (keyof Fields)[]).find((k) => found[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, website }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setStatus({ type: "success", message: "Thank you! Your message is on its way, and I'll reply soon." });
        setFields(empty);
      } else {
        setStatus({ type: "error", message: data.error || "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ type: "error", message: "Couldn't send your message. Please try again, or email me directly." });
    } finally {
      setSending(false);
    }
  };

  const input = (name: keyof Fields, props: { type?: string; autoComplete?: string; textarea?: boolean }) => {
    const id = `contact-${name}`;
    const errorId = `${id}-error`;
    const invalid = Boolean(errors[name]);
    const common = {
      id,
      name,
      value: fields[name],
      "aria-invalid": invalid || undefined,
      "aria-describedby": invalid ? errorId : undefined,
      required: true,
      className: cn(
        "w-full rounded-none border-0 border-b bg-transparent py-3.5 text-[17px] text-ink placeholder:text-muted/70 focus:outline-none focus:ring-0 transition-colors duration-fast",
        invalid ? "border-red-700 focus:border-red-700" : "border-[#CFCBC8] focus:border-ink",
      ),
    };
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
          {fieldLabels[name]}
        </label>
        {props.textarea ? (
          <textarea {...common} rows={4} className={cn(common.className, "resize-y")} onChange={(e) => update(name, e.target.value)} />
        ) : (
          <input
            {...common}
            type={props.type ?? "text"}
            autoComplete={props.autoComplete}
            onChange={(e) => update(name, e.target.value)}
          />
        )}
        {invalid && (
          <p id={errorId} className="pt-1 text-sm text-red-700">
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <section id="contact" aria-labelledby="contact-h" className="pb-section-sm pt-16 md:pb-[140px] md:pt-24">
      <div className="mx-auto flex max-w-content flex-col items-center gap-7 px-gutter-sm text-center md:px-gutter">
        <Reveal>
          <StatusPill />
        </Reveal>
        <Reveal as="h2" id="contact-h" className="text-display text-contact">
          Have a project
          <br />
          <span className="text-outline">in mind?</span>
        </Reveal>
        <Reveal as="p" className="max-w-[560px] text-lead text-muted">
          Let&apos;s collaborate on your next product or talk about software engineering and AI opportunities.
        </Reveal>

        <Reveal className="mt-6 w-full max-w-[760px] text-left">
          <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
            <div className="grid gap-7 md:grid-cols-2">
              {input("firstName", { autoComplete: "given-name" })}
              {input("lastName", { autoComplete: "family-name" })}
            </div>
            {input("email", { type: "email", autoComplete: "email" })}
            {input("message", { textarea: true })}

            {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="flex flex-col-reverse items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[360px] text-sm text-muted">
                Your details are only used to reply to your message.
              </p>
              <PillButton type="submit" disabled={sending} arrow={!sending} className="w-full sm:w-auto">
                {sending ? "Sending…" : "Send message"}
              </PillButton>
            </div>

            <p
              role={status?.type === "error" ? "alert" : "status"}
              className={cn(
                "rounded-card px-4 py-3 text-sm empty:hidden",
                status?.type === "success" && "bg-surface text-ink",
                status?.type === "error" && "bg-red-50 text-red-800",
              )}
            >
              {status?.message ?? ""}
            </p>
          </form>
        </Reveal>

        <Reveal className="mt-4 flex flex-wrap justify-center gap-2.5">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex min-h-11 items-center rounded-full border border-line px-[18px] text-sm font-medium text-ink transition-colors duration-fast hover:bg-ink hover:text-canvas"
            >
              {s.label}
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
