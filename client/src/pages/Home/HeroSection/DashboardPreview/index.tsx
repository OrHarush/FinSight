import { Box } from '@mui/material';

import DashboardSummary from '@/pages/Home/HeroSection/DashboardPreview/DashboardSummary';
import HealthScore from '@/pages/Home/HeroSection/DashboardPreview/HealthScore';
import TransactionFloatingCard from '@/pages/Home/HeroSection/DashboardPreview/TransactionFloatingCard';

const DashboardPreview = () => (
  <Box
    sx={{
      display: { xs: 'none', md: 'block' },
      flex: '0 0 auto',
      position: 'relative',
      width: { md: 440 },
      pt: 3,
      pb: 3,
      px: 3,
    }}
  >
    <DashboardSummary />
    <TransactionFloatingCard />
    <HealthScore />
  </Box>
);

export default DashboardPreview;
