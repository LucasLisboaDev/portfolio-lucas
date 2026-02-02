import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image with Purple Abstract Background */}
          <div className="relative flex items-center justify-center py-8">
            {/* Purple Abstract Brushstroke Background */}
            <div className="absolute inset-0 flex items-center justify-center z-0 -ml-8 -mb-8">
              <svg
                className="w-full h-full max-w-lg"
                viewBox="0 0 500 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Main brushstroke shape - organic and flowing */}
                <path
                  d="M80 100 C120 80, 160 90, 200 70 C240 50, 280 60, 320 50 C360 40, 400 60, 420 100 C440 140, 430 180, 420 220 C410 260, 400 300, 390 340 C380 380, 370 420, 350 460 C330 500, 300 530, 260 550 C220 570, 180 560, 140 540 C100 520, 70 480, 50 440 C30 400, 20 360, 30 320 C40 280, 50 240, 60 200 C70 160, 70 120, 80 100 Z"
                  fill="#8B5CF6"
                  opacity="0.95"
                />
                {/* Secondary brushstroke for depth */}
                <path
                  d="M60 120 C100 100, 140 110, 180 90 C220 70, 260 80, 300 70 C340 60, 380 80, 400 120 C420 160, 410 200, 400 240 C390 280, 380 320, 370 360 C360 400, 350 440, 330 480 C310 520, 280 550, 240 570 C200 590, 160 580, 120 560 C80 540, 50 500, 30 460 C10 420, 0 380, 10 340 C20 300, 30 260, 40 220 C50 180, 50 140, 60 120 Z"
                  fill="#8B5CF6"
                  opacity="0.75"
                />
                {/* Accent brushstroke */}
                <path
                  d="M100 80 C140 60, 180 70, 220 50 C260 30, 300 40, 340 30 C380 20, 420 40, 440 80 C460 120, 450 160, 440 200 C430 240, 420 280, 410 320 C400 360, 390 400, 370 440 C350 480, 320 510, 280 530 C240 550, 200 540, 160 520 C120 500, 90 460, 70 420 C50 380, 40 340, 50 300 C60 260, 70 220, 80 180 C90 140, 90 100, 100 80 Z"
                  fill="#8B5CF6"
                  opacity="0.6"
                />
              </svg>
            </div>

            {/* Profile Image */}
            <div className="relative z-10 w-full max-w-md">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/lucas-profile.jpeg"
                  alt="Lucas Lisboa"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Text Content */}
          <div className="space-y-6">
            {/* Small Heading */}
            <p className="text-gray-600 text-sm font-medium uppercase tracking-wider">
              About
            </p>

            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              About Me
            </h2>

            {/* First Paragraph */}
            <p className="text-gray-600 text-lg leading-relaxed">
              I'm a U.S. Permanent Resident and AI Product Lead & Software Engineer with a passion for building intelligent systems that make a real impact. My expertise spans Machine Learning, Natural Language Processing, Computer Vision, and voice-first AI systems. I thrive at the intersection of engineering, design, and product strategy, always focused on delivering user-centric solutions.
            </p>

            {/* Second Paragraph */}
            <p className="text-gray-600 text-lg leading-relaxed">
              Currently leading AI product strategy at Encountr, I design end-to-end AI pipelines that transform raw speech into structured insights. Beyond tech, I'm a world-ranked Brazilian Jiu-Jitsu Black Belt, which has taught me discipline, resilience, and the importance of continuous learning—values I bring to every project.
            </p>

            {/* Education & Skills */}
            <div className="pt-4 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Education</h3>
                <p className="text-gray-600">Miami Dade College — B.S. Information Systems Technology (Software Engineering) & A.S. Computer Programming & Analysis (Mobile Applications)</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Languages</h3>
                <p className="text-gray-600">Portuguese (Native) • English (Fluent) • Spanish (Fluent)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
