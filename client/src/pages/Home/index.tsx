import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import Footer from '@/components/shared/layout/Footer';
import BottomCtaSection from '@/pages/Home/BottomCtaSection';
import FeaturesSection from '@/pages/Home/FeaturesSection/FeaturesSection';
import HeroSection from '@/pages/Home/HeroSection';
import HowItWorksSection from '@/pages/Home/HowItWorksSection';
import LandingNavbar from '@/pages/Home/LandingNavbar';

const HomePage = () => (
  <>
    <LandingNavbar />
    <ScrollableColumn component={'main'} sx={{ pb: 4 }}>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <BottomCtaSection />
      <Footer />
    </ScrollableColumn>
  </>
);

export default HomePage;
