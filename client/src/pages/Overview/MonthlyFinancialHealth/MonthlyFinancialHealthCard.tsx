import { Card, Grid } from '@mui/material';
import { ReactNode } from 'react';

interface MonthlyFinancialHealthCardProps {
  children?: ReactNode;
}

const MonthlyFinancialHealthCard = ({ children }: MonthlyFinancialHealthCardProps) => (
  <Grid size={{ xs: 12, md: 6, lg: 7 }}>
    <Card sx={{ p: 3, height: '100%', width: '100%' }}>{children}</Card>
  </Grid>
);

export default MonthlyFinancialHealthCard;
