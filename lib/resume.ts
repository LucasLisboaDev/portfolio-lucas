import path from "path";

export const RESUME_FILENAME = "Software-AI-Resume-LucasLisboa.pdf";
export const RESUME_DOWNLOAD_NAME = "Lucas-Lisboa-Software-AI-Engineer-Resume-July-2026.pdf";

export function getResumeFilePath() {
  return path.join(process.cwd(), "data", RESUME_FILENAME);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email.trim());
}

export const RESUME_ACCESS_COOKIE = "resume_access";
