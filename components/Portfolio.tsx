"use client";

import Image from "next/image";
import { useState } from "react";
import { projects } from "@/data/projects";

function portfolioImageClassName(src: string) {
  const lower = src.toLowerCase();
  const useContain =
    lower.includes("logo") ||
    lower.includes("emblem") ||
    lower.includes("globant") ||
    lower.includes("chamber");
  if (!useContain) return "object-cover";
  const pad =
    lower.includes("globant") || lower.includes("chamber")
      ? "p-8 md:p-12"
      : "p-4";
  return `object-contain ${pad}`;
}

export default function Portfolio() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section id="portfolio" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            My Recent <span className="text-purple-primary">Works</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Here are a few past design projects I've worked on. Want to see more? Email me.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const expanded = expandedIndex === index;
            return (
              <div
                key={index}
                className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 ${
                  expanded
                    ? "md:col-span-2 lg:col-span-3 ring-2 ring-purple-primary/30 shadow-xl"
                    : ""
                }`}
              >
                {/* Project Image */}
                <div
                  className={`relative bg-gradient-to-br from-purple-100 to-teal-100 overflow-hidden transition-[height] duration-300 ${
                    expanded ? "h-72 md:h-80" : "h-64"
                  }`}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className={`${portfolioImageClassName(project.image)} group-hover:scale-110 transition-transform duration-300`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl text-gray-300">📱</div>
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-purple-primary opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                    <a
                      href={project.link}
                      target={project.link.startsWith("http") ? "_blank" : "_self"}
                      rel={project.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-white font-semibold text-lg px-6 py-3 bg-white text-purple-primary rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      View Project
                    </a>
                  </div>
                </div>

                {/* Project Info — click to expand / collapse */}
                <button
                  type="button"
                  onClick={() => setExpandedIndex(expanded ? null : index)}
                  aria-expanded={expanded}
                  className="w-full text-left p-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-primary focus-visible:ring-offset-2 rounded-none"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-primary transition-colors">
                    {project.title}
                  </h3>
                  <p
                    className={`text-gray-600 mb-4 leading-relaxed transition-all duration-300 ${
                      expanded ? "" : "line-clamp-2"
                    }`}
                  >
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-purple-100 hover:text-purple-primary transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <span className="text-sm font-medium text-purple-primary">
                    {expanded ? "Show less" : "Show full description"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
