"use client";

import { useState } from "react";
import { githubProjects, type ProjectSection } from "@/data/github-projects";

function ProjectTable({ table }: { table: NonNullable<ProjectSection["table"]> }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {table.headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-100 last:border-0 even:bg-gray-50/50"
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionBlock({ section }: { section: ProjectSection }) {
  return (
    <div className="space-y-3">
      <h4 className="text-lg font-bold text-gray-900">{section.heading}</h4>
      {section.paragraphs?.map((paragraph, i) => (
        <p key={i} className="text-gray-600 leading-relaxed">
          {paragraph}
        </p>
      ))}
      {section.bullets && (
        <ul className="list-disc pl-5 space-y-2 text-gray-600 leading-relaxed">
          {section.bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      )}
      {section.table && <ProjectTable table={section.table} />}
    </div>
  );
}

export default function RecentProjects() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="recent-projects" className="py-24 px-6 bg-blue-light">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            My Recent <span className="text-purple-primary">Projects</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Selected engineering work on GitHub — from production RAG and agentic systems to
            full-stack apps. Click a card to explore architecture, stack, and results.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {githubProjects.map((project) => {
            const expanded = expandedId === project.id;

            return (
              <article
                key={project.id}
                className={`bg-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-300 overflow-hidden ${
                  expanded ? "lg:col-span-2 ring-2 ring-purple-primary/30 shadow-xl" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : project.id)}
                  aria-expanded={expanded}
                  className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-primary focus-visible:ring-inset"
                >
                  <div className="bg-gradient-to-br from-purple-100 to-teal-100 px-6 py-8 border-b border-purple-100/80">
                    <p className="text-sm font-semibold uppercase tracking-wide text-purple-primary mb-1">
                      {project.subtitle}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    {project.highlight && (
                      <p className="text-teal-primary font-medium text-sm mb-2">
                        {project.highlight}
                      </p>
                    )}
                    <p
                      className={`text-gray-700 leading-relaxed ${
                        expanded ? "" : "line-clamp-3"
                      }`}
                    >
                      {project.summary}
                    </p>
                  </div>

                  <div className="p-6 pb-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="text-sm font-medium text-purple-primary">
                      {expanded ? "Show less" : "View full project overview"}
                    </span>
                  </div>
                </button>

                <div className="px-6 pb-6 flex flex-wrap gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-purple-primary px-4 py-2 text-sm font-semibold text-white hover:bg-purple-dark transition-colors"
                    >
                      Live demo
                      <span aria-hidden>↗</span>
                    </a>
                  )}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    GitHub
                    <span aria-hidden>↗</span>
                  </a>
                </div>

                {expanded && (
                  <div className="px-6 pb-8 border-t border-gray-100 space-y-8">
                    {project.sections.map((section) => (
                      <SectionBlock key={section.heading} section={section} />
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
