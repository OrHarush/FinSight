import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { alpha, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

const TransactionFloatingCard = () => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.1 }}
      style={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }}
    >
      <Row
        spacing={1}
        alignItems="center"
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: 2.5,
          backgroundColor: alpha(theme.palette.background.paper, 0.92),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.success.main, 0.22)}`,
          boxShadow: `0 8px 24px ${alpha('#000', 0.18)}`,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 14, color: theme.palette.success.main }} />
        <Column spacing={0}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: '0.7rem',
              lineHeight: 1.3,
            }}
          >
            Coffee Shop
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.63rem' }}>
            ₪28 · Food
          </Typography>
        </Column>
      </Row>
    </motion.div>
  );
};

export default TransactionFloatingCard;
