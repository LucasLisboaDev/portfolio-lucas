import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import TalkToMaya from "@/components/sections/TalkToMaya";
import SelectedWork from "@/components/sections/SelectedWork";
import Capabilities from "@/components/sections/Capabilities";
import Experience from "@/components/sections/Experience";
import About from "@/components/sections/About";
import KindWords from "@/components/sections/KindWords";
import Credentials from "@/components/sections/Credentials";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

/**
 * Home page: every section is now in the redesign (Phases 2 to 5).
 * See docs/ANIMATED_PORTFOLIO_PLAN.md and docs/debriefs/ for how each was built.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" className="relative bg-canvas">
        <Hero />
        <TalkToMaya />
        <SelectedWork />
        <Capabilities />
        <Experience />
        <About />
        <KindWords />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
