import { Divider } from '@mui/material';

import LegalContentRenderer from '@/components/legal/LegalContentRenderer';
import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import Footer from '@/components/shared/layout/Footer';
import LandingNavbar from '@/pages/Home/LandingNavbar';

interface LegalPageProps {
  type: 'termsOfService' | 'privacyPolicy' | 'accessibility';
}

const LegalPage = ({ type }: LegalPageProps) => (
  <>
    <LandingNavbar />
    <ScrollableColumn
      component={'main'}
      alignItems={'center'}
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        flex: 1,
      }}
    >
      <LegalContentRenderer type={type} />
      <Divider sx={{ mt: 'auto', width: '100%', maxWidth: '900px' }} />
      <Footer />
    </ScrollableColumn>
  </>
);

export default LegalPage;
