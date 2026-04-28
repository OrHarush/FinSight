import { Typography } from '@mui/material';
import { ReactNode } from 'react';

import Column from '@/components/shared/layout/containers/Column';

interface LegalSectionProps {
  title: string;
  children: ReactNode;
}

const LegalSection = ({ title, children }: LegalSectionProps) => (
  <Column spacing={1.5}>
    <Typography component="h2" variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
      {title}
    </Typography>

    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
      {children}
    </Typography>
  </Column>
);

export default LegalSection;
