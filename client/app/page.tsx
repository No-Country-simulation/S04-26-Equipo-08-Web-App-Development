import BenefitsSection from "./components/landing/benefits/benefits-section";
import CTASection from "./components/landing/cta/cta-section";
import HeroSection from "./components/landing/hero/hero-seection";
import Header from "./components/layout/headers/header";

export default function Home() {
  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <CTASection />
    </div>
  );
}
