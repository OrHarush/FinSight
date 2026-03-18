import { alpha, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import Row from '@/components/shared/layout/containers/Row';
import Column from '@/components/shared/layout/containers/Column';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { motion } from 'framer-motion';

const HealthScore = () => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.3 }}
      style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 2 }}
    >
      <Row
        spacing={1.25}
        alignItems="center"
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: 2.5,
          backgroundColor: alpha(theme.palette.background.paper, 0.92),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
          boxShadow: `0 8px 24px ${alpha('#000', 0.18)}`,
        }}
      >
        <Column
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: `2.5px solid ${theme.palette.primary.main}`,
            flexShrink: 0,
          }}
        >
          <FavoriteIcon sx={{ fontSize: 13, color: theme.palette.primary.main }} />
        </Column>
        <Column spacing={0}>
          <Row alignItems="baseline" spacing={0.4}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: theme.palette.primary.main,
                fontSize: '0.82rem',
                lineHeight: 1.2,
              }}
            >
              82
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.6rem' }}>
              / 100
            </Typography>
          </Row>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.63rem' }}>
            Health Score
          </Typography>
        </Column>
      </Row>
    </motion.div>
  );
};

export default HealthScore;
