export interface ProjectTable {
  headers: string[];
  rows: string[][];
}

export interface ProjectSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: ProjectTable;
}

export interface GitHubProject {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  highlight?: string;
  tech: string[];
  liveUrl?: string;
  githubUrl: string;
  sections: ProjectSection[];
}

export const githubProjects: GitHubProject[] = [
  {
    id: "ai-content-pipeline",
    title: "AI Content Pipeline",
    subtitle: "Autonomous content engine",
    summary:
      "An end-to-end autonomous content engine that discovers trending topics via live web search, researches competitor gaps, drafts SEO-optimized posts with GPT-4o, and publishes to Ghost CMS — orchestrated on a recurring n8n schedule with zero manual intervention.",
    highlight: "Draft-first publishing. Four independently deployable FastAPI services.",
    tech: ["LangChain", "GPT-4o", "FastAPI", "n8n", "Tavily", "Ghost CMS", "Railway", "Pydantic"],
    liveUrl: "https://thesupercreator.ghost.io/brazilian-jiu-jitsu-misconceptions/",
    githubUrl: "https://github.com/LucasLisboaDev/ai-content-pipeline",
    sections: [
      {
        heading: "Architecture",
        bullets: [
          "Discovery: LangChain agent with Tavily real-time web search finds high-value blog topics for a given niche.",
          "Research: second LangChain agent analyzes competitor gaps, keywords, and content outline for the top topic.",
          "Drafting: LCEL chain with GPT-4o generates a full SEO-optimized blog post from the research brief.",
          "SEO scoring: deterministic Python scoring for character counts and keyword density — no LLM arithmetic.",
          "Publishing: Ghost CMS Admin API with JWT auth; posts publish as drafts by default for human review.",
          "Orchestration: n8n scheduler triggers the full pipeline on a recurring cadence and sends email notifications.",
        ],
      },
      {
        heading: "Stack",
        bullets: [
          "Backend: Python · FastAPI · Pydantic · Railway",
          "Agents: LangChain · Tavily · GPT-4o",
          "Orchestration: n8n · Gmail notifications",
          "CMS: Ghost Admin API · JWT (PyJWT)",
          "Repo: LucasLisboaDev/ai-content-pipeline",
        ],
      },
      {
        heading: "Key engineering decisions",
        bullets: [
          "Agents vs. chains: discovery and research use autonomous LangChain agents for tool use over live search; drafting uses LCEL chains when all context is already available.",
          "Temperature tuning: research and metadata at 0.1–0.2 for accuracy; drafting at 0.7 for natural prose.",
          "Deterministic SEO scoring: pure Python over LLM — faster, cheaper, and more reliable for measurable metrics.",
          "Draft-first publishing: posts never go live automatically — human review before publication.",
          "Separation of concerns: each pipeline phase is its own router, agent module, and Pydantic models — independently testable and replaceable.",
        ],
      },
    ],
  },
  {
    id: "email-calendar-agent",
    title: "Email & Calendar Automation Agent",
    subtitle: "Agentic email triage & scheduling",
    summary:
      "A production-grade agentic AI system that autonomously manages email triage, smart reply drafting, and meeting scheduling using a full-stack Python and React architecture deployed on Railway and Vercel.",
    highlight: "Human-in-the-loop for high-stakes actions. Full distributed tracing on every run.",
    tech: [
      "Python",
      "FastAPI",
      "GPT-4o",
      "Gmail API",
      "Google Calendar API",
      "OAuth 2.0",
      "Pydantic",
      "React",
      "Vite",
      "Railway",
      "Vercel",
      "Loguru",
    ],
    liveUrl: "https://email-agent-dashboard-alpha.vercel.app",
    githubUrl: "https://github.com/LucasLisboaDev/email-calendar-agent",
    sections: [
      {
        heading: "Architecture",
        bullets: [
          "Ingestion: Gmail API via OAuth 2.0. HTML stripped before any LLM processing.",
          "Classification: GPT-4o function-calling pipeline forces structured JSON output — intent label (meeting request, reply needed, spam/promo, FYI, urgent), suggested action, confidence score, and reasoning trace.",
          "Routing: low-stakes actions (archive promotions, mark newsletters read) execute automatically. High-stakes actions (schedule events, send replies) queue for human approval.",
          "Execution: approved actions fire Gmail send API or Google Calendar API in real time — Google Meet link generation and attendee invite delivery included.",
          "Tracing: unique trace ID per agent run; each pipeline step (fetch, clean, classify, route, execute) recorded as a timed span with full input/output logging.",
          "Self-evaluation: GPT-4o evaluator scores each session on intent accuracy, action quality, and reasoning quality — flags decisions where the evaluator disagrees with the agent.",
        ],
      },
      {
        heading: "Stack",
        bullets: [
          "Backend: Python · FastAPI · Pydantic · Loguru · Railway",
          "LLM: OpenAI GPT-4o (function calling)",
          "Integrations: Gmail API · Google Calendar API · OAuth 2.0",
          "Frontend: React · Vite · Vercel",
          "Repos: LucasLisboaDev/email-calendar-agent · LucasLisboaDev/email-agent-dashboard",
        ],
      },
      {
        heading: "Key engineering decisions",
        bullets: [
          "Function calling over freeform text: structured JSON output makes routing deterministic and auditable — no parsing fragile LLM prose.",
          "Human-in-the-loop for high-stakes actions: auto-execute low-risk triage, require one-click Approve/Reject on the React dashboard before sending emails or creating calendar events.",
          "HTML stripping before LLM: removes noise and token waste so classification focuses on message intent, not markup.",
          "Distributed tracing per run: every pipeline step is a timed span with I/O logging — debuggable in production without guesswork.",
          "Post-session self-evaluation: automated quality scoring catches classification drift before it reaches users.",
        ],
      },
    ],
  },
  {
    id: "production-rag-pipeline",
    title: "Production RAG Pipeline",
    subtitle: "ArXiv Research Assistant",
    summary:
      "A production-grade Retrieval-Augmented Generation system that answers natural language questions about AI research papers with fully cited, grounded responses. Built to demonstrate the enterprise RAG pattern used in real-world document intelligence systems.",
    tech: [
      "Python",
      "FastAPI",
      "Qdrant",
      "BM25",
      "sentence-transformers",
      "GPT-4o",
      "RAGAs",
      "React",
      "Vite",
    ],
    liveUrl: "https://production-rag-pipeline.vercel.app",
    githubUrl: "https://github.com/LucasLisboaDev/production-RAG-pipeline",
    sections: [
      {
        heading: "Architecture",
        bullets: [
          "Ingestion pipeline: 50 ArXiv PDFs downloaded via the arxiv Python client, parsed with PyMuPDF, chunked into 646 overlapping 512-word segments with citation metadata per chunk (title, authors, published date, arXiv URL).",
          "Hybrid retrieval: BM25 keyword search (rank-bm25) and dense vector similarity (BAAI/bge-small-en-v1.5, 384-dim embeddings) run in parallel. Results fused with Reciprocal Rank Fusion (RRF).",
          "Vector store: Qdrant Cloud (AWS us-east-1), cosine similarity, 646 vectors persisted and queryable over HTTP.",
          "Reranking: cross-encoder/ms-marco-MiniLM-L-6-v2 re-scores top 20 hybrid candidates, returns top 5 chunks.",
          "Generation: GPT-4o with citation-enforcement prompt. Every claim references a numbered source; ungrounded answers are refused.",
          "Evaluation: RAGAs (Faithfulness, Context Recall) on a golden Q&A dataset. GitHub Actions CI gates every PR — regressions block merges.",
        ],
      },
      {
        heading: "Stack",
        bullets: [
          "Backend: Python · FastAPI · uvicorn",
          "Retrieval: rank-bm25 · sentence-transformers · Qdrant Cloud",
          "Reranking: Hugging Face Transformers · cross-encoder/ms-marco-MiniLM-L-6-v2",
          "LLM: OpenAI GPT-4o",
          "Evaluation: RAGAs · pytest · GitHub Actions",
          "Frontend: React · Vite · Tailwind CSS",
          "Deployment: Railway (backend) · Vercel (frontend) · Qdrant Cloud",
        ],
      },
      {
        heading: "Key engineering decisions",
        bullets: [
          "Hybrid over vector-only: semantic search misses exact technical terms; BM25 catches model names and paper-specific terminology. RRF fuses both without score normalization.",
          "Two-stage retrieval: fast approximate search for recall, accurate cross-encoder for precision.",
          "Citation enforcement over best-effort: every claim tied to a retrieved chunk — auditable answers for enterprise deployment.",
          "CI-gated evaluation: automated RAGAs on every PR so retrieval tuning never silently degrades quality.",
        ],
      },
    ],
  },
  {
    id: "talentmatch-ai",
    title: "TalentMatch.ai",
    subtitle: "Fine-tuning research study",
    summary:
      "A 6-experiment ML research project investigating automated resume-to-job-description fit scoring using fine-tuned transformer models. Starting from a regression approach and iterating through LoRA fine-tuning, dataset comparison, and 3-class classification, the project systematically identified why public datasets fail for this problem and what it would take to solve it in production.",
    highlight:
      "6 experiments. Label quality beats quantity. Public datasets fail at distribution shift.",
    tech: [
      "Python",
      "HuggingFace Transformers",
      "PEFT",
      "PyTorch",
      "Gradio",
      "Google Colab",
      "HuggingFace Hub",
    ],
    liveUrl: "https://huggingface.co/spaces/LucasLisboadev/TalentMatch-AI",
    githubUrl: "https://github.com/LucasLisboaDev/TalentMatch-AI",
    sections: [
      {
        heading: "What I built and found",
        bullets: [
          "Trained DistilBERT (67M parameters) across 6 notebooks using the HuggingFace Trainer API, PEFT/LoRA, and two public datasets totaling 7,225 labeled resume-JD pairs.",
          "Full fine-tuning achieved MAE 11.95 on held-out test data — a 32% improvement over baseline.",
          "LoRA fine-tuning with only 1.09% trainable parameters matched the naive baseline, confirming that parameter-efficient methods require larger base models to be effective.",
          "Retraining on a 10x larger dataset with cosine-similarity-derived labels performed worse than the smaller GPT-4o-labeled dataset, demonstrating that label quality beats label quantity.",
          "The final 3-class classifier (No Fit / Potential Fit / Good Fit) achieved 70.3% accuracy and 0.69 macro F1 on 7,225 combined samples but failed to generalize to real-world inputs — a distribution shift problem that cannot be solved without proprietary human-labeled data at scale.",
        ],
      },
      {
        heading: "Stack",
        bullets: [
          "ML: Python · HuggingFace Transformers · PEFT/LoRA · PyTorch",
          "Interface: Gradio · HuggingFace Spaces",
          "Compute: Google Colab T4 GPU",
          "Models: HuggingFace Hub (LucasLisboadev)",
          "Repo: LucasLisboaDev/TalentMatch-AI",
        ],
      },
      {
        heading: "Key engineering decisions",
        bullets: [
          "Full fine-tuning vs LoRA tradeoff: full fine-tuning on DistilBERT delivered meaningful gains; LoRA underperformed at this model scale.",
          "Dynamic score normalization to prevent silent label corruption across datasets with different scoring scales.",
          "Stratified train/val splits across imbalanced classes to avoid optimistic metrics on majority classes.",
          "Macro F1 as the primary metric to handle class imbalance rather than raw accuracy alone.",
          "Pivot from regression to classification when label noise made continuous prediction intractable.",
        ],
      },
    ],
  },
  {
    id: "offline-llm-engineering",
    title: "offline-llm-engineering",
    subtitle: "Local LLM inference & benchmarking",
    summary:
      "Offline LLM inference pipeline benchmarking Llama 3.2 3B, Phi-4 Mini, and Mistral 7B on a consumer Intel Mac — zero cloud dependency. Covers CLI streaming, automated benchmarks, Pydantic structured outputs, and a 180-run model comparison study.",
    highlight: "300+ inference calls. Real numbers. No cherry-picking.",
    tech: ["Python", "Ollama", "Pydantic", "CLI", "Benchmarking", "GGUF"],
    githubUrl: "https://github.com/LucasLisboaDev/offline-llm-engineering",
    sections: [
      {
        heading: "What this is",
        bullets: [
          "CLI tool — stream responses from any of three models, measure TTFT and latency in real time.",
          "Inference benchmarking — automated 60-run benchmark across models and temperatures, exported to CSV.",
          "Structured outputs — JSON schema enforcement with Pydantic validation and retry logic.",
          "Model comparison study — 180 runs across 30 standardized prompts in 6 categories with quality analysis.",
        ],
        paragraphs: [
          "Everything runs offline. No API keys. No data leaves the machine.",
        ],
      },
      {
        heading: "Why local inference matters",
        bullets: [
          "Privacy — HIPAA, GDPR, and SOC 2 often prohibit sending sensitive data to third-party APIs.",
          "Latency — cloud round-trips add 200–600ms before the first token; local inference removes the network.",
          "Cost at scale — per-token billing vs fixed GPU capital; breakeven often at 3–6 months at high volume.",
          "Edge deployment — factory, medical, and field systems need self-contained on-device models.",
        ],
      },
      {
        heading: "Phase 5 — Full comparison study (180 runs)",
        paragraphs: [
          "30 prompts × 3 models × 2 temperatures · Intel MacBook Pro · 6-Core i7 · CPU-only",
        ],
        table: {
          headers: ["Model", "Temp", "Avg TTFT", "Avg latency", "Words/sec", "Verdict"],
          rows: [
            ["Llama 3.2 3B", "0.0", "11.76s", "38.23s", "1.3", "Best for CPU"],
            ["Llama 3.2 3B", "0.7", "12.45s", "38.42s", "1.1", "Consistent"],
            ["Phi-4 Mini", "0.0", "12.65s", "52.07s", "1.2", "Good at T=0"],
            ["Phi-4 Mini", "0.7", "24.83s", "120.70s", "0.7", "Degrades at T=0.7"],
            ["Mistral 7B", "0.0", "23.79s", "71.69s", "0.6", "Slow, needs GPU"],
            ["Mistral 7B", "0.7", "34.26s", "106.10s", "0.4", "Unusable on CPU"],
          ],
        },
      },
      {
        heading: "Cold vs warm inference (Llama 3.2 3B)",
        table: {
          headers: ["State", "TTFT", "Total latency"],
          rows: [
            ["Cold (loading from disk)", "8.66s", "12.37s"],
            ["Warm (resident in RAM)", "0.41s", "4.08s"],
            ["Speedup", "21×", "3×"],
          ],
        },
      },
      {
        heading: "Key findings",
        bullets: [
          "Llama 3.2 3B is the only model suitable for interactive CPU deployment — ~38s average latency, best instruction compliance.",
          "Phi-4 Mini has a temperature cliff: at T=0.7 latency triples and training data leakage can appear. Use T=0.0 with conciseness instructions.",
          "Mistral 7B needs a GPU — 0.4 words/sec at T=0.7 on CPU due to memory bandwidth limits.",
          "Cold start costs 21× more than warm inference — production systems must pre-warm models on startup.",
          "Quality and speed are orthogonal — speed benchmarks alone cannot substitute for quality evaluation.",
        ],
      },
      {
        heading: "Models",
        table: {
          headers: ["Model", "Parameters", "Creator", "Disk", "Notes"],
          rows: [
            ["llama3.2:3b", "3B", "Meta", "2.0 GB", "Best overall for CPU"],
            ["phi4-mini", "3.8B", "Microsoft", "2.5 GB", "Use T=0.0 only"],
            ["mistral:7b", "7B", "Mistral AI", "4.4 GB", "Needs GPU for interactive use"],
          ],
        },
      },
      {
        heading: "Concepts demonstrated",
        table: {
          headers: ["Concept", "Where"],
          rows: [
            ["Local vs cloud inference tradeoffs", "Architecture, Phase 1"],
            ["GGUF quantization", "Model setup, technical report"],
            ["Time to first token (TTFT)", "CLI, Phases 2–3"],
            ["Cold start vs warm inference", "Phase 2, 21× speedup"],
            ["Pydantic schema validation", "Phase 4"],
            ["Training data leakage", "Phase 5 Phi-4 finding"],
            ["Prompt injection defense", "comparison_study.py CONCISE_SUFFIX"],
          ],
        },
      },
    ],
  },
  {
    id: "jiujitsu-jobs",
    title: "JiuJitsuJobs",
    subtitle: "Two-sided BJJ coaching marketplace",
    summary:
      "A two-sided job marketplace connecting Brazilian jiu-jitsu coaches with gyms looking to hire — built end to end as a solo founder and developer. Purpose-built for the sport with belt rank verification, gi/no-gi specialization, competition history, and affiliation tracking.",
    highlight: "Solo founder. Full-stack product from domain model to production deployment.",
    tech: [
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
      "Clerk",
      "Resend",
      "Railway",
    ],
    liveUrl: "https://jiujitsujobs.net",
    githubUrl: "https://github.com/LucasLisboaDev/BJJJobs",
    sections: [
      {
        heading: "Problem & approach",
        paragraphs: [
          "The BJJ coaching industry runs almost entirely on personal networks and word of mouth, leaving talented coaches without visibility and gyms without an efficient way to find qualified instructors.",
          "JiuJitsuJobs solves this with a purpose-built platform that understands the sport — belt rank verification, gi/no-gi specialization, competition history, and affiliation tracking, all wrapped in a clean, modern interface.",
        ],
      },
      {
        heading: "Key features",
        bullets: [
          "Dual-sided registration flow for coaches and gyms, each with tailored onboarding.",
          "Real-time job search and filtering by city, belt rank, and job type.",
          "Application system with cover messages and duplicate-prevention logic.",
          "Role-aware dashboard — gyms manage listings and review applicants, coaches track application history.",
          "Public coach profiles showcasing belt rank, specialties, and competition background.",
          "Bilingual support (English/Portuguese) for the international BJJ community.",
        ],
      },
      {
        heading: "Stack",
        bullets: [
          "Frontend: Next.js 14 (App Router) · TypeScript · Tailwind CSS",
          "Database: PostgreSQL · Prisma ORM",
          "Auth: Clerk",
          "Email: Resend (transactional)",
          "Deployment: Railway · custom domain (jiujitsujobs.net)",
          "Repo: LucasLisboaDev/BJJJobs",
        ],
      },
    ],
  },
];
