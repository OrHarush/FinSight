import { Card, CardContent, Typography } from '@mui/material';
import Column from '@/components/Layout/Column';
import { SvgIconComponent } from '@mui/icons-material';

interface OverviewCardProps {
  headerTitle: string;
  balance: number;
  icon: SvgIconComponent;
}

const OverviewCard = ({ headerTitle, balance, icon: Icon }: OverviewCardProps) => {
  return (
    <Card sx={{ width: '280px', height: '104px', borderRadius: '8px' }}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'Row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px',
        }}
      >
        <Column spacing={1}>
          <Typography variant={'body2'}>{headerTitle}</Typography>
          <Typography variant={'h4'}>{balance}$</Typography>
        </Column>
        <Icon fontSize="large" color="primary" />
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
