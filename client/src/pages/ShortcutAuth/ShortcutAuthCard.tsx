import { Box, Card, CardContent } from '@mui/material';
import { ReactNode } from 'react';

import Column from '@/components/shared/layout/containers/Column';

const ShortcutAuthCard = ({ children }: { children: ReactNode }) => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100%" sx={{ p: 2 }}>
    <Card sx={{ width: '100%', maxWidth: 420, borderRadius: 4, textAlign: 'center' }}>
      <CardContent sx={{ py: 5, px: 4 }}>
        <Column spacing={2.5} alignItems="center">
          {children}
        </Column>
      </CardContent>
    </Card>
  </Box>
);

export default ShortcutAuthCard;
