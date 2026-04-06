import { Divider } from '@mui/material';

import LegalContentRenderer from '@/components/legal/LegalContentRenderer';
import Column from '@/components/shared/layout/containers/Column';
import Footer from '@/components/shared/layout/Footer';

import { getLegalPageContainerStyle } from './styles';

export const AccessibilityPage = () => (
  <Column sx={getLegalPageContainerStyle()}>
    <LegalContentRenderer type="accessibility" />
    <Divider sx={{ mt: 4 }} />
    <Footer />
  </Column>
);

export default AccessibilityPage;
