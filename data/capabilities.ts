/**
 * The four Capabilities rows on the homepage. The descriptions are first
 * drafts written from the project and experience data; rewrite them in your
 * own words whenever you like.
 */
export type Capability = {
  title: string;
  description: string;
  /** Work that backs this capability up. Case studies link to /work/<slug>. */
  related: { label: string; href: string }[];
  /** The small tilted card shown in the hover preview. "\n" starts a new line. */
  preview: { label: string; title: string };
};

export const capabilities: Capability[] = [
  {
    title: "AI Engineering & Agents",
    description:
      "Autonomous agents and LLM workflows with LangChain and GPT-4o, plus real-time voice agents on ElevenLabs. Human review stays in the loop wherever a mistake would be costly.",
    related: [
      { label: "AI Content Pipeline", href: "/work/ai-content-pipeline" },
      { label: "Email & Calendar Agent", href: "/work/email-calendar-agent" },
      { label: "Encountr", href: "#experience" },
    ],
    preview: { label: "Agentic AI", title: "AI Content\nPipeline" },
  },
  {
    title: "RAG & Data Pipelines",
    description:
      "Retrieval systems that return cited, grounded answers, and data pipelines that handle ingestion, schema validation, transformation, and scoring across messy sources.",
    related: [
      { label: "Production RAG Pipeline", href: "/work/production-rag-pipeline" },
      { label: "BusyBee", href: "#experience" },
    ],
    preview: { label: "RAG & Search", title: "Production\nRAG Pipeline" },
  },
  {
    title: "Full Stack Product",
    description:
      "Products taken from domain model to production: Next.js and TypeScript frontends, PostgreSQL and Prisma backends, auth, transactional email, and deployment on Railway and Vercel.",
    related: [{ label: "JiuJitsuJobs", href: "/work/jiujitsu-jobs" }],
    preview: { label: "Full Stack", title: "JiuJitsu\nJobs" },
  },
  {
    title: "iOS & Mobile",
    description:
      "SwiftUI and UIKit features for an enterprise cruise app used by millions, bridged with legacy Objective-C, plus iOS and Android apps shipped for independent clients.",
    related: [
      { label: "Globant · Carnival", href: "#experience" },
      { label: "Independent clients", href: "#experience" },
    ],
    preview: { label: "iOS & Android", title: "Carnival\nMobile App" },
  },
];
