import { Card, CardContent, Skeleton, Typography, Box } from '@mui/material';
import Column from '@/components/Layout/Column';
import { SvgIconComponent } from '@mui/icons-material';
import CurrencyText from '@/components/CurrencyText';
import Row from '@/components/Layout/Row';

interface FinanceOverviewCardProps {
  headerTitle: string;
  balance: number;
  icon: SvgIconComponent;
  color: string;
  isLoading: boolean;
}

const FinanceOverviewCard = ({
  headerTitle,
  balance,
  icon: Icon,
  isLoading,
  color = '#8b5cf6',
}: FinanceOverviewCardProps) => (
  <Card sx={{ maxWidth: 280, height: 104, borderRadius: 3 }}>
    <CardContent
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        p: 3,
      }}
    >
      {isLoading ? (
        <Skeleton variant="rectangular" width={210} height={60} sx={{ borderRadius: 2 }} />
      ) : (
        <Row width="100%" justifyContent="space-between" alignItems="center">
          <Column>
            <Typography variant="body2" color="text.secondary">
              {headerTitle}
            </Typography>

            <CurrencyText variant="h5" value={balance} fontWeight={700} />
          </Column>
          <Box
            sx={{
              p: 1.2,
              borderRadius: 2,
              bgcolor: `${color}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 28, color }} />
          </Box>
        </Row>
      )}
    </CardContent>
  </Card>
);

export default FinanceOverviewCard;
