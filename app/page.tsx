import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeatureSection } from "@/components/feature-section";
import { Footer } from "@/components/footer";
import { FloatingCommits } from "@/components/floating-commits";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <FloatingCommits />
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <Footer />
    </div>
  );
}
