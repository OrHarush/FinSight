import Column from '@/components/shared/layout/containers/Column';
import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import BottomCtaSection from '@/pages/Home/BottomCtaSection';
import FeaturesSection from '@/pages/Home/FeaturesSection/FeaturesSection';
import HeroSection from '@/pages/Home/HeroSection';
import HomePageFooter from '@/pages/Home/HomePageFooter';
import HowItWorksSection from '@/pages/Home/HowItWorksSection';
import LandingNavbar from '@/pages/Home/LandingNavbar';

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
