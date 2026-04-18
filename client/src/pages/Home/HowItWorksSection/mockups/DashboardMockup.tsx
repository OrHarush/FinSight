import SavingsIcon from '@mui/icons-material/Savings';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Divider, LinearProgress, Typography, alpha, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import DashboardMetric from '@/pages/Home/HowItWorksSection/mockups/DashboardMetric';

const ACCENT_PURPLE = '#a78bfa';
const PROGRESS_PERCENT = 57;

const DashboardMockup = () => {
  const { t } = useTranslation('home');
  const theme = useTheme();

  const successGreen = theme.palette.success.main;
  const errorRed = theme.palette.error.main;

  return (
    <Column spacing={1.5} sx={{ width: '100%' }}>
      <Row
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 1,
          py: 0.85,
          borderRadius: 1.5,
          border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
        }}
      >
        <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary' }}>▾</Typography>
        <Row alignItems="center" spacing={0.5}>
          <Typography sx={{ fontSize: '0.8rem', color: 'text.primary', fontWeight: 600 }}>
            {t('landing.how.step03.account')}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem' }}>🏦</Typography>
          <Typography sx={{ fontSize: '0.72rem', color: ACCENT_PURPLE }}>★</Typography>
        </Row>
      </Row>

      <Row alignItems="center" justifyContent="space-evenly" spacing={1}>
        <Column alignItems="center" spacing={0} sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            dir="ltr"
            sx={{ fontSize: '1.05rem', color: 'text.primary', fontWeight: 700, lineHeight: 1.2 }}
          >
            4,280₪
          </Typography>
          <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary' }}>
            {t('landing.how.step03.balanceLabel')}
          </Typography>
        </Column>
        <Divider orientation="vertical" flexItem sx={{ borderColor: 'divider' }} />
        <Column alignItems="center" spacing={0} sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            dir="ltr"
            sx={{ fontSize: '1.05rem', color: ACCENT_PURPLE, fontWeight: 700, lineHeight: 1.2 }}
          >
            6,150₪
          </Typography>
          <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary' }}>
            {t('landing.how.step03.projectedLabel')}
          </Typography>
        </Column>
      </Row>

      <Row justifyContent="space-between" spacing={1}>
        <DashboardMetric
          icon={<TrendingUpIcon />}
          iconColor={successGreen}
          value="14,500₪"
          label={t('landing.how.step03.incomeLabel')}
        />
        <DashboardMetric
          icon={<TrendingDownIcon />}
          iconColor={errorRed}
          value="8,350₪"
          label={t('landing.how.step03.expensesLabel')}
        />
        <DashboardMetric
          icon={<SavingsIcon />}
          iconColor={successGreen}
          value="+6,150₪"
          label={t('landing.how.step03.netLabel')}
          valueColor={successGreen}
        />
      </Row>

      <Column spacing={0.5}>
        <Box sx={{ position: 'relative' }}>
          <LinearProgress
            variant="determinate"
            value={PROGRESS_PERCENT}
            sx={{
              height: 8,
              borderRadius: 999,
              backgroundColor: alpha(theme.palette.common.white, 0.08),
              '& .MuiLinearProgress-bar': {
                borderRadius: 999,
                backgroundColor: theme.palette.warning.main,
              },
            }}
          />
        </Box>
        <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary' }}>
          {t('landing.how.step03.progressLabel')}
        </Typography>
      </Column>
    </Column>
  );
};

export default DashboardMockup;
