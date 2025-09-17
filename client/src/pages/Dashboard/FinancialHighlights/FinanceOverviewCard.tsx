import { Card, CardContent, Skeleton, Typography } from '@mui/material';
import Column from '@/components/Layout/Column';
import { SvgIconComponent } from '@mui/icons-material';

interface FinanceOverviewCardProps {
  headerTitle: string;
  balance: number;
  icon: SvgIconComponent;
  isLoading: boolean;
}

const FinanceOverviewCard = ({
  headerTitle,
  balance,
  icon: Icon,
  isLoading,
}: FinanceOverviewCardProps) => (
  <Card sx={{ maxWidth: '280px', height: '104px', borderRadius: '8px' }}>
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
        {isLoading ? (
          <Skeleton variant="rectangular" width={210} height={60} sx={{ borderRadius: '16px' }} />
        ) : (
          <>
            <Typography variant={'body2'}>{headerTitle}</Typography>
            <Typography variant={'h4'}>{balance}₪</Typography>
            <Icon fontSize="large" color="primary" />
          </>
        )}
      </Column>
    </CardContent>
  </Card>
);

export default FinanceOverviewCard;
