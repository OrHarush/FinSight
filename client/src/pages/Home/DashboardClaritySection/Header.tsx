import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

interface HeaderProps {
  isInView: boolean;
  align?: 'center' | 'start';
}

const Header = ({ isInView, align = 'center' }: HeaderProps) => {
  const { t } = useTranslation('home');
  const isCentered = align === 'center';

  return (
    <Column
      spacing={1.5}
      alignItems={isCentered ? 'center' : 'flex-start'}
      sx={{ textAlign: isCentered ? 'center' : 'start' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.8rem', md: '2.6rem' },
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          {t('landing.clarity.headline')}
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
            maxWidth: isCentered ? 620 : 'none',
            lineHeight: 1.8,
            fontSize: { xs: '0.95rem', md: '1.05rem' },
          }}
        >
          {t('landing.clarity.subheadline')}
        </Typography>
      </motion.div>
    </Column>
  );
};

export default Header;
