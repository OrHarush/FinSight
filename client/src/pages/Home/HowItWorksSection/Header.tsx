import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Trans, useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

const ACCENT_PURPLE = '#a78bfa';

interface HeaderProps {
  isInView: boolean;
}

const Header = ({ isInView }: HeaderProps) => {
  const { t } = useTranslation('home');

  return (
    <Column spacing={1.5} alignItems="center" sx={{ mb: { xs: 5, md: 6 }, textAlign: 'center' }}>
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
          <Trans
            t={t}
            i18nKey="landing.how.headline"
            components={{
              accent: <Box component="span" sx={{ color: ACCENT_PURPLE }} />,
            }}
          />
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
            maxWidth: 560,
            lineHeight: 1.8,
            fontSize: { xs: '0.95rem', md: '1.05rem' },
          }}
        >
          {t('landing.how.subheadline')}
        </Typography>
      </motion.div>
    </Column>
  );
};

export default Header;
