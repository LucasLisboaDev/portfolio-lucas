import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import {
  getResumeFilePath,
  RESUME_ACCESS_COOKIE,
  RESUME_DOWNLOAD_NAME,
} from "@/lib/resume";

export async function GET(request: NextRequest) {
  const hasAccess = request.cookies.get(RESUME_ACCESS_COOKIE)?.value === "1";

  if (!hasAccess) {
    return NextResponse.json(
      { error: "Please enter your email to access the resume." },
      { status: 401 }
    );
  }

  try {
    const buffer = await readFile(getResumeFilePath());
    const download = request.nextUrl.searchParams.get("download") === "1";
    const disposition = download ? "attachment" : "inline";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename="${RESUME_DOWNLOAD_NAME}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Resume file read error:", error);
    return NextResponse.json(
      { error: "Resume is temporarily unavailable." },
      { status: 500 }
    );
  }
}
