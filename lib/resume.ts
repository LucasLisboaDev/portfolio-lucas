import path from "path";

export const RESUME_FILENAME = "Lisboa-AIEngineerResume.pdf";
export const RESUME_DOWNLOAD_NAME = "Lucas-Lisboa-AI-Engineer-Resume.pdf";

export function getResumeFilePath() {
  return path.join(process.cwd(), "data", RESUME_FILENAME);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email.trim());
}

export const RESUME_ACCESS_COOKIE = "resume_access";
