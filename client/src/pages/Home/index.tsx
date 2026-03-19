import Column from '@/components/shared/layout/containers/Column';
import LandingNavbar from '@/pages/Home/LandingNavbar';
import HeroSection from '@/pages/Home/HeroSection';
import FeaturesSection from '@/pages/Home/FeaturesSection/FeaturesSection';
import BottomCtaSection from '@/pages/Home/BottomCtaSection';
import HomePageFooter from '@/pages/Home/HomePageFooter';
import HowItWorksSection from '@/pages/Home/HowItWorksSection';
import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';

const HomePage = () => (
  <Column
    sx={{
      minHeight: '100vh',
      backgroundColor: 'background.default',
      overflow: 'hidden',
    }}
  >
    <LandingNavbar />
    <ScrollableColumn>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <BottomCtaSection />
      <HomePageFooter />
    </ScrollableColumn>
  </Column>
);

export default HomePage;
