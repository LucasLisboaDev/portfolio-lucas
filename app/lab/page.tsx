import type { Metadata } from "next";
import LabClient from "@/components/lab/LabClient";

/**
 * Hidden test page for the redesign's building blocks. It is not linked from
 * anywhere and tells search engines not to index it. Open /lab directly.
 */
export const metadata: Metadata = {
  title: "Motion Lab | Lucas Lisboa",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  return <LabClient />;
}
