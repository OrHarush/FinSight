import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import BottomCtaSection from '@/pages/Home/BottomCtaSection';
import FeaturesSection from '@/pages/Home/FeaturesSection/FeaturesSection';
import HeroSection from '@/pages/Home/HeroSection';
import HomePageFooter from '@/pages/Home/HomePageFooter';
import HowItWorksSection from '@/pages/Home/HowItWorksSection';
import LandingNavbar from '@/pages/Home/LandingNavbar';

const HomePage = () => (
  <>
    <LandingNavbar />
    <ScrollableColumn component={'main'}>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <BottomCtaSection />
      <HomePageFooter />
    </ScrollableColumn>
  </>
);

export default HomePage;
