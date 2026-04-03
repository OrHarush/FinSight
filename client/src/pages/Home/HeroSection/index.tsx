import { alpha, Box, useTheme } from '@mui/material';

import homePage from '@/assets/homePage.jpg';
import Column from '@/components/shared/layout/containers/Column';
import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';
import DashboardPreview from '@/pages/Home/HeroSection/DashboardPreview';
import HeroContent from '@/pages/Home/HeroSection/HeroContent';

const HeroSection = () => {
  const theme = useTheme();

  return (
    <Column
      component={'section'}
      sx={{
        minHeight: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'center',
      }}
    >
      {/* Background image */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: theme.palette.mode === 'dark' ? 0.1 : 0.18,
          backgroundImage: `url(${homePage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          pointerEvents: 'none',
        }}
      />
      {/* Ambient glow blobs */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '-5%',
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.07)}, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '5%',
          right: '-5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, theme.palette.mode === 'dark' ? 0.08 : 0.05)}, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <ResponsiveRow
        sx={{
          zIndex: 1,
          px: { xs: 3, md: 8 },
          py: { xs: 8, md: 0 },
          gap: { xs: 6, md: 10 },
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'center' },
          justifyContent: { xs: 'center', md: 'space-between' },
          maxWidth: 1200,
          mx: 'auto',
          width: '100%',
        }}
      >
        <HeroContent />
        <DashboardPreview />
      </ResponsiveRow>
    </Column>
  );
};

export default HeroSection;
