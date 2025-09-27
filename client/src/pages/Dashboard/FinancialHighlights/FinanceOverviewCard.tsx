import { Card, CardContent, Typography, Box } from '@mui/material';
import Column from '@/components/Layout/Containers/Column';
import { SvgIconComponent } from '@mui/icons-material';
import CurrencyText from '@/components/CurrencyText';
import Row from '@/components/Layout/Containers/Row';
import FinanceOverviewCardSkeleton from '@/pages/Dashboard/FinancialHighlights/FinanceOverviewCardSkeleton';

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
  <Card sx={{ height: 100, borderRadius: 3 }}>
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
        <FinanceOverviewCardSkeleton />
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
              backgroundColor: `${color}22`,
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
