import "./globals.css";
import { Inter } from "next/font/google";
import ElevenLabsConvaiWidget from "@/components/ElevenLabsConvaiWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lucas Lisboa Alves | Software / AI Engineer",
  description: "Software / AI Engineer with full-stack experience building production applications across web, mobile, data, and intelligent systems — from architecture to cloud deployment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ElevenLabsConvaiWidget />
      </body>
    </html>
  );
}