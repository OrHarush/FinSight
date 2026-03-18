import Column from '@/components/shared/layout/containers/Column';
import { alpha, LinearProgress, useTheme } from '@mui/material';
import Row from '@/components/shared/layout/containers/Row';
import Typography from '@mui/material/Typography';
import MetricCard from '@/pages/Home/HeroSection/DashboardPreview/MetricCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { motion } from 'framer-motion';

const DashboardSummary = () => {
  const theme = useTheme();
  const budgets = [
    { label: 'Groceries', value: 68 },
    { label: 'Transport', value: 42 },
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
              March Overview
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
              2026
            </Typography>
          </Row>
          <Row spacing={1.25} justifyContent="stretch">
            <MetricCard
              icon={<TrendingUpIcon sx={{ fontSize: 13 }} />}
              label="Income"
              value="₪11,600"
              color={theme.palette.success.main}
            />
            <MetricCard
              icon={<TrendingDownIcon sx={{ fontSize: 13 }} />}
              label="Expenses"
              value="₪7,882"
              color={theme.palette.error.main}
            />
            <MetricCard
              icon={<AccountBalanceWalletIcon sx={{ fontSize: 13 }} />}
              label="Balance"
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
