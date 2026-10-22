import Footer from "@/components/Footer";
import Hero from "@/components/hero/Hero";
import Nav from "@/components/Nav";
import HowItWorksSection from "@/components/story/HowItWorks";
import ProblemSection from "@/components/story/ProblemSection";
import RevealSection from "@/components/story/RevealSection";
import TrailBridge from "@/components/story/TrailBridge";
import { BRIDGES } from "@/data/story";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrailBridge {...BRIDGES.heroToProblem} />
        <ProblemSection />
        <TrailBridge {...BRIDGES.problemToNext} />
        <HowItWorksSection />
        <TrailBridge {...BRIDGES.howToNext} />
        <RevealSection />
        <TrailBridge {...BRIDGES.revealToFooter} />
      </main>
      <Footer />
    </>
  );
}
