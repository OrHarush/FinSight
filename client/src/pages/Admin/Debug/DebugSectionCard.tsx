import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

import Column from '@/components/shared/layout/containers/Column';

interface DebugSectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const DebugSectionCard = ({ title, subtitle, children }: DebugSectionCardProps) => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      borderRadius: 2,
      border: 1,
      borderColor: 'divider',
      overflow: 'hidden',
      p: 2.5,
    }}
  >
    <Column spacing={2}>
      <Column spacing={0.5}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Column>
      {children}
    </Column>
  </Box>
);

export default DebugSectionCard;
