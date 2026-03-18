import { alpha, Typography, useTheme } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Row from '@/components/shared/layout/containers/Row';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4,
    },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const TrustBadges = () => {
  const theme = useTheme();
  const { t } = useTranslation('home');

  const badges = [
    t('trustBadges.free'),
    t('trustBadges.noCard'),
    t('trustBadges.setup'),
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Row
        spacing={{ xs: 2, sm: 3 }}
        flexWrap="wrap"
        justifyContent="center"
        sx={{ rowGap: 1 }}
      >
        {badges.map(badge => (
          <motion.div key={badge} variants={badgeVariants}>
            <Row alignItems="center" spacing={0.75}>
              <CheckCircleOutlineIcon
                sx={{
                  fontSize: 16,
                  color: theme.palette.secondary.main,
                  filter: `drop-shadow(0 0 6px ${alpha(theme.palette.secondary.main, 0.6)})`,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                }}
              >
                {badge}
              </Typography>
            </Row>
          </motion.div>
        ))}
      </Row>
    </motion.div>
  );
};

export default TrustBadges;
