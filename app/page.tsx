import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import RecentProjects from "@/components/RecentProjects";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/**
 * Home page.
 *
 * Phase 0 of the redesign removed the full-screen WebGL gradient that used to
 * sit behind every section. The page now renders on the flat `canvas`
 * background from the design tokens. The sections below are rebuilt one by one
 * in Phases 2 to 5 (see docs/ANIMATED_PORTFOLIO_PLAN.md).
 */
export default function Home() {
  return (
    <main className="relative bg-canvas">
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
