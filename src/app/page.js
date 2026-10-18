import Hero from "@/components/hero/Hero";
import HowItWorksSection from "@/components/story/HowItWorks";
import ProblemSection from "@/components/story/ProblemSection";
import TrailBridge from "@/components/story/TrailBridge";
import { BRIDGES } from "@/data/story";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrailBridge {...BRIDGES.heroToProblem} />
      <ProblemSection />
      <TrailBridge {...BRIDGES.problemToNext} />
      <HowItWorksSection />
      <TrailBridge {...BRIDGES.howToNext} />
    </main>
  );
}
