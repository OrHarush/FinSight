import { Typography } from '@mui/material';
import Column from '@/components/layout/Containers/Column';
import { ReactNode } from 'react';

interface LegalSectionProps {
  title: string;
  children: ReactNode;
}

const LegalSection = ({ title, children }: LegalSectionProps) => (
    <Column spacing={1.5}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: 'primary.main' }}
      >
        {title}
      </Typography>

      <Typography
        variant="body1"
        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
      >
        {children}
      </Typography>
    </Column>
  );

export default LegalSection;
