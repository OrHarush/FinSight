import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { alpha, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import InfoTooltip from '@/components/shared/ui/InfoTooltip';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';

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
  const isSmallScreen = useIsSmallScreen();

  const badges = [
    t('landing.hero.trustBadges.free'),
    t('landing.hero.trustBadges.noBank'),
    t('landing.hero.trustBadges.setup'),
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Column alignItems={isSmallScreen ? 'center' : 'flex-start'} spacing={1.5}>
        <Row spacing={{ xs: 2.5, sm: 3 }} flexWrap="wrap" justifyContent="center" sx={{ rowGap: 1.5 }}>
          {badges.map(badge => (
            <motion.div key={badge} variants={badgeVariants}>
              <Row alignItems="center" spacing={0.75}>
                <CheckCircleOutlineIcon
                  aria-hidden="true"
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
        <motion.div variants={badgeVariants} style={{ width: 'fit-content' }}>
          <Row
            alignItems="center"
            spacing={0.75}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
              borderRadius: '20px',
              px: 1.5,
              py: 0.5,
            }}
          >
            <Typography aria-hidden="true" sx={{ fontSize: 13, lineHeight: 1 }}>🔒</Typography>
            <Typography
              variant="body2"
              sx={{
                color: alpha(theme.palette.primary.main, 0.9),
                fontWeight: 500,
                fontSize: '0.85rem',
              }}
            >
              {t('landing.hero.privacy')}
            </Typography>
            <InfoTooltip content={t('landing.hero.privacyTooltip')} />
          </Row>
        </motion.div>
      </Column>
    </motion.div>
  );
};

export default TrustBadges;
