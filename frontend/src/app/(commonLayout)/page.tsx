import { FaqSection } from "@/components/modules/Home/faq";
import { FeaturesSection } from "@/components/modules/Home/features";
import { HeroSection } from "@/components/modules/Home/hero";
import { ShowcaseSection } from "@/components/modules/Home/showcase";

export default function Home() {
  return (
    <div className="flex flex-col font-sans">
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <FaqSection />
    </div>
  );
}
