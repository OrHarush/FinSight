import { Card, CardContent, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import Column from '@/components/layout/Containers/Column';
import { SvgIconComponent } from '@mui/icons-material';
import CurrencyText from '@/components/appCommon/CurrencyText';
import Row from '@/components/layout/Containers/Row';
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
}: FinanceOverviewCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        height: 100,
        minWidth: '160px',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(139, 92, 246, 0.2)',
        },
      }}
    >
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
              <CurrencyText variant="h5" value={balance} fontWeight={700} isAnimated />
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
              <Icon sx={{ fontSize: isMobile ? 24 : 24, color }} />
            </Box>
          </Row>
        )}
      </CardContent>
    </Card>
  );
};

export default FinanceOverviewCard;
