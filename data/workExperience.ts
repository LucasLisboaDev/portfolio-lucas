/**
 * Roles and builds shown in the Experience section, newest first.
 * Dates follow the resume (data/Software-AI-Resume-LucasLisboa.pdf).
 * Leave start and end out when they are not known; the row simply shows no date.
 */
export type ExperienceEntry = {
  company: string;
  role: string;
  /** For example "Sep 2025". */
  start?: string;
  /** For example "Aug 2025" or "Present". */
  end?: string;
  description: string;
  tech: string[];
  /** Company or project site, if public. */
  link?: string;
  /** Logos in /public, shown in the hover preview and inline on phones. */
  logos: string[];
  /** "build" marks hackathons and side builds rather than jobs. */
  kind: "role" | "build";
};

export const workExperience: ExperienceEntry[] = [
  {
    company: "Encountr",
    role: "Software Engineer / AI Developer",
    start: "Sep 2025",
    end: "Present",
    description:
      "Designed and built production AI systems end-to-end, including data ingestion pipelines, NLP classification models, agentic workflows, and cloud-deployed APIs. Developed multi-turn conversational flows with dynamic memory and safety constraints. Generated the company's first revenue by deploying an AI agent used internationally to qualify conference attendees.",
    tech: ["Python", "FastAPI", "AWS", "Docker", "Redis", "Hugging Face", "LangChain", "Qdrant", "ElevenLabs"],
    link: "https://encountr.ai",
    logos: ["/encountr-logo.png"],
    kind: "role",
  },
  {
    company: "BusyBee",
    role: "Software Engineer Intern",
    start: "May 2025",
    end: "Aug 2025",
    description:
      "Architected a configurable Python-based data processing pipeline handling ingestion, schema validation, transformation, and scoring across multiple heterogeneous data sources. Delivered a commercially licensed pipeline later adopted and sold as a data processing solution to enterprise clients.",
    tech: ["Python", "Pandas", "Kafka", "RabbitMQ", "SQLAlchemy"],
    logos: [],
    kind: "role",
  },
  {
    // One internship: employed by Globant, working on Carnival's app (as on the resume).
    company: "Globant · Carnival Cruise Lines",
    role: "Software Engineer Intern",
    start: "May 2024",
    end: "Aug 2024",
    description:
      "Built and maintained iOS UI components for Carnival's flagship mobile app serving millions of customers, within a large Agile engineering team. Bridged SwiftUI and UIKit with legacy Objective-C, participated in sprint planning and code reviews, and improved crew operational efficiency by engineering a hidden offline-accessible environment data page, enabling fast emergency responses without internet connectivity at sea.",
    tech: ["Swift", "SwiftUI", "UIKit", "Objective-C", "CoreData", "Xcode", "Azure DevOps"],
    logos: ["/globant-image.png", "/carnival-emblem.png"],
    kind: "role",
  },
  {
    company: "PlutoHacks Miami",
    role: "Hackathon · SOS Map App",
    start: "2024",
    description:
      "Built an emergency response mapping application during a hackathon, focused on real-time location sharing and emergency services coordination.",
    tech: ["Swift", "iOS", "MapKit", "Firebase"],
    logos: ["/plutohacks-logo.png"],
    kind: "build",
  },
  {
    company: "Independent Contractor",
    role: "Mobile Applications Developer",
    start: "Jan 2022",
    end: "Jan 2024",
    description:
      "Designed and shipped iOS and Android applications independently, managing the full product lifecycle from requirements gathering and stakeholder feedback to App Store deployment and iteration, across multiple client projects.",
    tech: ["Swift", "Kotlin", "Xcode", "Android Studio"],
    logos: [],
    kind: "role",
  },
  {
    // Dates not on the resume yet: add start and end when known.
    company: "U.S. Chamber of Commerce · Spark Founders",
    role: "AI Developer Intern",
    description:
      "Collaborated with the Spark Founders team, including the CTO and senior engineers, to design and prototype a real-time matching system connecting entrepreneurs with complementary skills. Performed algorithm analysis and feature engineering across fourteen domain-specific parameters, and benchmarked Hugging Face encoders to improve accuracy.",
    tech: ["Python", "Pandas", "Hugging Face", "NLP", "ML"],
    logos: ["/USChamber-OFcommerce.jpg"],
    kind: "role",
  },
];

/** "Sep 2025 – Present", "2024", or "" when unknown. */
export function formatDates(e: Pick<ExperienceEntry, "start" | "end">): string {
  if (!e.start) return "";
  return e.end ? `${e.start} – ${e.end}` : e.start;
}
