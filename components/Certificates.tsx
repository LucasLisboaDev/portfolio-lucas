import { certificates } from "@/data/certificates";

export default function Certificates() {
  return (
    <section id="certificates" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <p className="text-gray-600 text-sm font-medium mb-2">Credentials</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Certificates
          </h2>
          <p className="text-gray-600 text-lg mt-4 max-w-2xl">
            Professional certifications in Python, iOS development with Swift, and computer science fundamentals.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {certificates.map((cert, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-purple-50 to-teal-50 rounded-xl p-6 border-2 border-purple-100 shadow-sm hover:shadow-md hover:border-teal-primary/40 transition-all"
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-lg bg-white border border-purple-100 flex items-center justify-center text-purple-primary"
                  aria-hidden
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-primary mb-1">
                    {cert.issuer}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">
                    {cert.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
