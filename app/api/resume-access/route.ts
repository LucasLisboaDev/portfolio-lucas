import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/data/site";
import { isValidEmail, RESUME_ACCESS_COOKIE } from "@/lib/resume";

const inbox = process.env.CONTACT_EMAIL || CONTACT_EMAIL;
const COOKIE_MAX_AGE = 60 * 60 * 24;

function hasResumeAccess(request: NextRequest) {
  return request.cookies.get(RESUME_ACCESS_COOKIE)?.value === "1";
}

function grantResumeAccess(response: NextResponse) {
  response.cookies.set(RESUME_ACCESS_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return response;
}

async function notifyResumeAccess(email: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not configured; resume access granted without notification.");
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: inbox,
    subject: `Resume download: ${email}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">Resume access requested</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p style="color: #666; font-size: 14px;">Someone entered this email on your portfolio to view or download your resume.</p>
      </div>
    `,
    text: `Resume access requested\n\nEmail: ${email}`,
  });

  if (error) {
    console.error("Resend resume notification error:", error);
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ granted: hasResumeAccess(request) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await notifyResumeAccess(email);

    return grantResumeAccess(
      NextResponse.json({ message: "Access granted." }, { status: 200 })
    );
  } catch (error) {
    console.error("Resume access error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
