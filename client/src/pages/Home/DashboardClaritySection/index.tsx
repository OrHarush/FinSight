import { Box } from '@mui/material';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import ClarityCards from '@/pages/Home/DashboardClaritySection/ClarityCards';
import DashboardCard from '@/pages/Home/DashboardClaritySection/DashboardCard';
import Header from '@/pages/Home/DashboardClaritySection/Header';
import PhoneFrame from '@/pages/Home/DashboardClaritySection/PhoneFrame';

const DashboardClaritySection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px 0px' });

  return (
    <Column
      component="section"
      id="clarity"
      ref={sectionRef}
      spacing={0}
      sx={{
        px: { xs: 2, md: 4 },
        py: { xs: 8, md: 12 },
        position: 'relative',
        scrollMarginTop: '80px',
      }}
    >
      <Row
        spacing={8}
        alignItems="center"
        justifyContent="center"
        sx={{ display: { xs: 'none', lg: 'flex' }, width: '100%', maxWidth: 1100, mx: 'auto' }}
      >
        <Box sx={{ width: 380, flexShrink: 0 }}>
          <PhoneFrame>
            <DashboardCard />
          </PhoneFrame>
        </Box>
        <Column spacing={3.5} sx={{ flex: 1, maxWidth: 480 }}>
          <Header isInView={isInView} align="start" />
          <ClarityCards />
        </Column>
      </Row>

      <Column
        spacing={4}
        alignItems="center"
        sx={{ display: { xs: 'flex', lg: 'none' }, width: '100%' }}
      >
        <Header isInView={isInView} align="center" />
        <Box sx={{ width: '100%', maxWidth: 380 }}>
          <PhoneFrame>
            <DashboardCard />
          </PhoneFrame>
        </Box>
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <ClarityCards />
        </Box>
      </Column>
    </Column>
  );
};

export default DashboardClaritySection;
