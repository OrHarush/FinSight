import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { alpha, LinearProgress, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import MetricCard from '@/pages/Home/HeroSection/DashboardPreview/MetricCard';

const DashboardSummary = () => {
  const theme = useTheme();
  const { t } = useTranslation('home');
  const budgets = [
    { label: t('dashboardPreview.groceries'), value: 68 },
    { label: t('dashboardPreview.transport'), value: 42 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, ease: 'easeOut', delay: 0.4 }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
      >
        <Column
          spacing={2}
          sx={{
            px: { xs: 2.5, sm: 3 },
            py: { xs: 2, sm: 2.5 },
            borderRadius: 4,
            backgroundColor: alpha(theme.palette.background.paper, 0.55),
            backdropFilter: 'blur(32px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 24px 64px ${alpha('#000', 0.22)}`,
            width: '100%',
          }}
        >
          <Row justifyContent="space-between" alignItems="center">
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontSize: '0.65rem',
              }}
            >
              {t('dashboardPreview.monthLabel')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
              2026
            </Typography>
          </Row>
          <Row spacing={1.25} justifyContent="stretch">
            <MetricCard
              icon={<TrendingUpIcon sx={{ fontSize: 13 }} />}
              label={t('dashboardPreview.income')}
              value="₪11,600"
              color={theme.palette.success.main}
            />
            <MetricCard
              icon={<TrendingDownIcon sx={{ fontSize: 13 }} />}
              label={t('dashboardPreview.expenses')}
              value="₪7,882"
              color={theme.palette.error.main}
            />
            <MetricCard
              icon={<AccountBalanceWalletIcon sx={{ fontSize: 13 }} />}
              label={t('dashboardPreview.balance')}
              value="+₪3,718"
              color={theme.palette.primary.main}
            />
          </Row>
          <Column
            spacing={1}
            sx={{
              pt: 1.5,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            {budgets.map(b => (
              <Column key={b.label} spacing={0.35}>
                <Row justifyContent="space-between" alignItems="center">
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontSize: '0.68rem' }}
                  >
                    {b.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.disabled', fontSize: '0.68rem' }}
                  >
                    {b.value}%
                  </Typography>
                </Row>
                <LinearProgress
                  variant="determinate"
                  value={b.value}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 2,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    },
                  }}
                />
              </Column>
            ))}
          </Column>
        </Column>
      </motion.div>
    </motion.div>
  );
};

export default DashboardSummary;
