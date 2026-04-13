import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import HeroSection from '@/components/home/hero-section';
import HowItWorksSection from '@/components/home/how-it-works-section';
import StylesSection from '@/components/home/styles-section';
import BeforeAfterSection from '@/components/home/before-after-section';
import PricingSection from '@/components/home/pricing-section';
import FAQSection from '@/components/home/faq-section';
import CTASection from '@/components/home/cta-section';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />
      <HeroSection />
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
