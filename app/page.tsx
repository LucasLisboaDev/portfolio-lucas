import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import RecentProjects from "@/components/RecentProjects";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AnimatedGradient from "@/components/ui/animated-gradient";

export default function Home() {
  return (
    <main className="relative">
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden>
        <AnimatedGradient
          config={{
            preset: "custom",
            // Professional grey palette: charcoal → steel → soft slate
            color1: "#1E293B",
            color2: "#94A3B8",
            color3: "#F1F5F9",
            rotation: -28,
            proportion: 40,
            scale: 0.38,
            speed: 14,
            distortion: 5,
            swirl: 42,
            swirlIterations: 5,
            softness: 100,
            offset: -90,
            shape: "Edge",
            shapeSize: 34,
          }}
          noise={{ opacity: 0.12, scale: 1 }}
          style={{ zIndex: 0 }}
        />
      </div>
      <Navbar />
      <Hero />
      <Portfolio />
      <RecentProjects />
      <About />
      <Testimonials />
      <Certificates />
      <Contact />
      <Footer />
    </main>
  );
}
