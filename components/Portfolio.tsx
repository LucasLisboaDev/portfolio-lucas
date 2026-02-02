import Image from "next/image";
import { projects } from "@/data/projects";

export default function Portfolio() {
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
          {projects.map((project, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* Project Image */}
              <div className="relative h-64 bg-gradient-to-br from-purple-100 to-teal-100 overflow-hidden">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className={`${project.image.includes("logo") || project.image.includes("emblem") ? "object-contain p-4" : "object-cover"} group-hover:scale-110 transition-transform duration-300`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl text-gray-300">📱</div>
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-purple-primary opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
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

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-purple-100 hover:text-purple-primary transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
