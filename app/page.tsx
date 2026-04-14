import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import HeroSection from "@/components/home/hero-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import StylesSection from "@/components/home/styles-section";
import BeforeAfterSection from "@/components/home/before-after-section";
import PricingSection from "@/components/home/pricing-section";
import FAQSection from "@/components/home/faq-section";
import CTASection from "@/components/home/cta-section";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />
      <HeroSection isAuthenticated={Boolean(session)} />
      <HowItWorksSection />
      <StylesSection />
      <BeforeAfterSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <SiteFooter />
    </main>
  );
}
