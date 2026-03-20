import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CategoryIcon from '@mui/icons-material/Category';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Grid, Typography, useTheme } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import FeatureCard from '@/pages/Home/FeaturesSection/FeatureCard';

const FeaturesSection = () => {
  const { t } = useTranslation('home');
  const theme = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px 0px' });

  const features = [
    {
      icon: <DashboardIcon />,
      title: t('features.dashboard.title'),
      description: t('features.dashboard.description'),
      accentColor: theme.palette.primary.main,
      preview: 'dashboard' as const,
    },
    {
      icon: <ReceiptLongIcon />,
      title: t('features.transactions.title'),
      description: t('features.transactions.description'),
      accentColor: theme.palette.success.main,
      preview: 'quickAdd' as const,
    },
    {
      icon: <CategoryIcon />,
      title: t('features.categories.title'),
      description: t('features.categories.description'),
      accentColor: '#f97316',
      preview: 'categoryGallery' as const,
    },
    {
      icon: <AccountBalanceIcon />,
      title: t('features.accounts.title'),
      description: t('features.accounts.description'),
      accentColor: theme.palette.primary.light,
      preview: null,
    },
    {
      icon: <CreditCardIcon />,
      title: t('features.payments.title'),
      description: t('features.payments.description'),
      accentColor: theme.palette.secondary.main,
      preview: null,
    },
    {
      icon: <DonutLargeIcon />,
      title: t('features.budgets.title'),
      description: t('features.budgets.description'),
      accentColor: theme.palette.success.main,
      preview: 'budgets' as const,
    },
  ];

  return (
    <Column
      ref={sectionRef}
      spacing={0}
      sx={{ px: { xs: 2, md: 8 }, py: { xs: 8, md: 12 }, position: 'relative' }}
    >
      <Column
        spacing={1.5}
        alignItems="center"
        sx={{ mb: { xs: 6, md: 8 }, textAlign: 'center', position: 'relative' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.8rem', md: '2.8rem' },
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {t('features.sectionTitle')}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: 480,
              lineHeight: 1.8,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
            }}
          >
            {t('features.sectionSubtitle')}
          </Typography>
        </motion.div>
      </Column>

      <Grid container spacing={3} sx={{ maxWidth: 1100, mx: 'auto', position: 'relative' }}>
        {features.map((feature, index) => (
          <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.2 + index * 0.07 }}
              style={{ height: '100%' }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Column>
  );
};

export default FeaturesSection;
