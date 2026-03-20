import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { alpha, Box, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

type ProcessAnimationProps = {
  activeStage: number;
};

const ProcessAnimation = ({ activeStage }: ProcessAnimationProps) => {
  const theme = useTheme();
  const { t } = useTranslation('home');

  const fieldSx = {
    px: 1,
    py: 0.45,
    borderRadius: 1.5,
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    backgroundColor: alpha(theme.palette.background.paper, 0.5),
  };

  const setupItems = [
    {
      label: t('processAnimation.accountLabel'),
      value: t('processAnimation.accountValue'),
    },
    {
      label: t('processAnimation.paymentLabel'),
      value: t('processAnimation.paymentValue'),
    },
    {
      label: t('processAnimation.categoriesLabel'),
      value: t('processAnimation.categoriesValue'),
    },
  ];

  const dashboardMetrics = [
    {
      label: t('processAnimation.incomeLabel'),
      value: '₪11,600',
      color: theme.palette.success.main,
    },
    {
      label: t('processAnimation.expensesLabel'),
      value: '₪7,910',
      color: theme.palette.error.main,
    },
    {
      label: t('processAnimation.balanceLabel'),
      value: '+₪3,690',
      color: theme.palette.primary.main,
    },
  ];

  return (
    <Column alignItems="center" spacing={1.5} sx={{ mb: { xs: 5, md: 6 } }}>
      <Row justifyContent="center" spacing={0.75}>
        {[0, 1, 2].map(i => (
          <Box
            key={i}
            sx={{
              width: activeStage === i ? 22 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor:
                activeStage === i
                  ? theme.palette.primary.main
                  : alpha(theme.palette.text.secondary, 0.2),
              transition: 'all 0.35s ease',
            }}
          />
        ))}
      </Row>

      <Box
        sx={{
          width: '100%',
          maxWidth: 300,
          height: 145,
          position: 'relative',
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.5),
          backdropFilter: 'blur(16px)',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          {activeStage === 0 && (
            <motion.div
              key="defaults"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.28 }}
              style={{ position: 'absolute', inset: 0, padding: 14 }}
            >
              <Column spacing={0.85}>
                <Typography
                  sx={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {t('processAnimation.stage0Title')}
                </Typography>

                {setupItems.map(item => (
                  <Row key={item.label} justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                      {item.label}
                    </Typography>

                    <Row alignItems="center" spacing={0.4}>
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                        }}
                      >
                        {item.value}
                      </Typography>
                      <CheckCircleIcon sx={{ fontSize: 11, color: theme.palette.success.main }} />
                    </Row>
                  </Row>
                ))}
              </Column>
            </motion.div>
          )}

          {activeStage === 1 && (
            <motion.div
              key="transaction"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.28 }}
              style={{ position: 'absolute', inset: 0, padding: 14 }}
            >
              <Column spacing={0.75}>
                <Typography
                  sx={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {t('processAnimation.stage1Title')}
                </Typography>

                <Column spacing={0.5}>
                  <Row sx={fieldSx}>
                    <Typography
                      sx={{
                        fontSize: '0.7rem',
                        color: 'text.primary',
                        fontWeight: 600,
                      }}
                    >
                      {t('processAnimation.transactionName')}
                    </Typography>
                  </Row>

                  <Row spacing={0.5}>
                    <Row sx={{ ...fieldSx, flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: 'text.primary',
                        }}
                      >
                        ₪28
                      </Typography>
                    </Row>

                    <Row sx={{ ...fieldSx, flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          color: theme.palette.warning.main,
                          fontWeight: 600,
                        }}
                      >
                        {t('processAnimation.transactionCategory')}
                      </Typography>
                    </Row>
                  </Row>

                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.25 }}
                  >
                    <Row
                      justifyContent="center"
                      sx={{
                        py: 0.5,
                        borderRadius: 1.5,
                        backgroundColor: alpha(theme.palette.success.main, 0.1),
                        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.68rem',
                          color: theme.palette.success.main,
                          fontWeight: 700,
                        }}
                      >
                        ✓ {t('processAnimation.transactionAdded')}
                      </Typography>
                    </Row>
                  </motion.div>
                </Column>
              </Column>
            </motion.div>
          )}

          {activeStage === 2 && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.28 }}
              style={{ position: 'absolute', inset: 0, padding: 14 }}
            >
              <Column spacing={0.85}>
                <Typography
                  sx={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {t('processAnimation.stage2Title')}
                </Typography>

                <Row spacing={0.75}>
                  {dashboardMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.25 }}
                      style={{ flex: 1 }}
                    >
                      <Column
                        alignItems="center"
                        spacing={0.2}
                        sx={{
                          px: 0.5,
                          py: 0.6,
                          borderRadius: 1.5,
                          backgroundColor: alpha(metric.color, 0.08),
                          border: `1px solid ${alpha(metric.color, 0.15)}`,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.58rem',
                            color: 'text.secondary',
                            fontWeight: 500,
                          }}
                        >
                          {metric.label}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: '0.65rem',
                            color: metric.color,
                            fontWeight: 700,
                          }}
                        >
                          {metric.value}
                        </Typography>
                      </Column>
                    </motion.div>
                  ))}
                </Row>
              </Column>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Column>
  );
};

export default ProcessAnimation;
