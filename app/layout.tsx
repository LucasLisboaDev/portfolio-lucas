import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lucas Lisboa Alves | AI Product Lead & Software Engineer",
  description: "AI Product Lead & Software Engineer specializing in ML, NLP, Computer Vision, and voice-first AI systems. Building intelligent products at the intersection of AI and human-centered design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}