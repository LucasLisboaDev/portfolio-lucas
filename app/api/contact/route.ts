import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/data/site";

const inbox = process.env.CONTACT_EMAIL || CONTACT_EMAIL;

/** Upper bounds that stop someone pasting megabytes into the form. */
const LIMITS = { name: 100, email: 254, phone: 40, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Escapes text before it goes into the HTML email. Without this, anything a
 * visitor typed (names, message) was inserted into the email's HTML as is,
 * so someone could inject links or markup into the message you receive.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot: the form has a hidden "website" field people never see.
    // Bots that fill every field get a normal-looking success and nothing is sent.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });
    }

    const firstName = clean(body.firstName, LIMITS.name);
    const lastName = clean(body.lastName, LIMITS.name);
    const email = clean(body.email, LIMITS.email);
    const phone = clean(body.phone, LIMITS.phone);
    const message = clean(body.message, LIMITS.message);

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service is not configured. Please contact the administrator." },
        { status: 500 },
      );
    }

    // Create client only at request time so `next build` never runs constructor with missing key
    const resend = new Resend(apiKey);

    const safe = {
      firstName: escapeHtml(firstName),
      lastName: escapeHtml(lastName),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      message: escapeHtml(message),
    };

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // This will work for testing
      // Once you verify your domain with Resend, change to:
      // from: `Portfolio Contact <contact@yourdomain.com>`,
      to: inbox,
      replyTo: email, // So you can reply directly to the sender
      subject: `Portfolio Contact Form: Message from ${firstName} ${lastName}`.replace(/[\r\n]+/g, " "),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0A0909;">New Contact Form Submission</h2>
          <div style="background-color: #F4F2F0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${safe.firstName} ${safe.lastName}</p>
            <p><strong>Email:</strong> ${safe.email}</p>
            ${safe.phone ? `<p><strong>Phone:</strong> ${safe.phone}</p>` : ""}
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #0A0909;">Message:</h3>
            <p style="white-space: pre-wrap; background-color: #FDFDFD; padding: 15px; border-radius: 5px;">${safe.message}</p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E2DF;">
            <p style="color: #707070; font-size: 12px;">You can reply directly to this email to respond to ${safe.firstName}.</p>
          </div>
        </div>
      `,
      text: `
        New Contact Form Submission

        Name: ${firstName} ${lastName}
        Email: ${email}
        ${phone ? `Phone: ${phone}` : ""}

        Message:
        ${message}
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 });
  }
}
