import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SchoolIcon from '@mui/icons-material/School';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { alpha, Box, Chip, LinearProgress, Paper, Typography, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { JSX, useEffect, useState } from 'react';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

interface MiniPreviewProps {
  type: 'dashboard' | 'transactions' | 'budgets' | 'quickAdd' | 'categoryGallery' | null;
}

const DashboardPreview = () => {
  const theme = useTheme();
  return (
    <Row spacing={1} flexWrap="wrap" sx={{ rowGap: 0.75, mt: 1 }}>
      {[
        { label: '↑ ₪11,600', color: theme.palette.success.main },
        { label: '↓ ₪7,882', color: theme.palette.error.main },
        { label: '+₪3,718', color: theme.palette.primary.main },
      ].map(item => (
        <Column
          key={item.label}
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: 1.5,
            backgroundColor: alpha(item.color, 0.1),
            border: `1px solid ${alpha(item.color, 0.2)}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: item.color, fontSize: '0.7rem' }}
          >
            {item.label}
          </Typography>
        </Column>
      ))}
    </Row>
  );
};

const BudgetsPreview = () => {
  const theme = useTheme();
  return (
    <Column spacing={1} sx={{ mt: 1 }}>
      {[
        { label: 'Groceries', value: 69 },
        { label: 'Dates', value: 52 },
      ].map(b => (
        <Column key={b.label} spacing={0.4}>
          <Row justifyContent="space-between">
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              {b.label}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
              {b.value}%
            </Typography>
          </Row>
          <LinearProgress
            variant="determinate"
            value={b.value}
            sx={{
              height: 5,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.primary.main, 0.15),
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          />
        </Column>
      ))}
    </Column>
  );
};

// Fix 9: Fixed-height wrapper prevents card height jumps between form (2 rows) and list (3 rows)
const QuickAddPreview = () => {
  const theme = useTheme();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const durations = [1800, 1600, 2400];
    const timer = setTimeout(() => {
      setStage(s => (s + 1) % 3);
    }, durations[stage]);

    return () => clearTimeout(timer);
  }, [stage]);

  const fieldBase = {
    px: 1,
    py: 0.5,
    borderRadius: 1.25,
    border: `1px solid ${alpha(theme.palette.divider, 0.22)}`,
    backgroundColor: alpha(theme.palette.primary.main, 0.03),
  };

  return (
    <Box sx={{ mt: 1, height: 68, overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {stage < 2 ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <Column spacing={0.6}>
              <Row
                alignItems="center"
                sx={{
                  ...fieldBase,
                  borderColor: stage === 1
                    ? alpha(theme.palette.primary.main, 0.4)
                    : alpha(theme.palette.divider, 0.22),
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.7rem',
                    color: stage === 1 ? 'text.primary' : 'text.disabled',
                    fontWeight: stage === 1 ? 600 : 400,
                  }}
                >
                  {stage === 1 ? 'Coffee Shop' : 'Name…'}
                </Typography>
              </Row>
              <Row spacing={0.6}>
                <Row alignItems="center" sx={{ ...fieldBase, flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.7rem',
                      color: stage === 1 ? 'text.primary' : 'text.disabled',
                      fontWeight: stage === 1 ? 600 : 400,
                    }}
                  >
                    {stage === 1 ? '₪28' : 'Amount'}
                  </Typography>
                </Row>
                <Row
                  alignItems="center"
                  sx={{
                    ...fieldBase,
                    flex: 1,
                    borderColor: stage === 1
                      ? alpha(theme.palette.secondary.main, 0.4)
                      : alpha(theme.palette.divider, 0.22),
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.7rem',
                      color: stage === 1 ? theme.palette.secondary.main : 'text.disabled',
                      fontWeight: stage === 1 ? 600 : 400,
                    }}
                  >
                    {stage === 1 ? '🍔 Food' : 'Category'}
                  </Typography>
                </Row>
              </Row>
            </Column>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <Column spacing={0.5}>
              <motion.div
                initial={{ x: -8, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.28 }}
              >
                <Row
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1.25,
                    backgroundColor: alpha(theme.palette.success.main, 0.07),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.16)}`,
                  }}
                >
                  <Row alignItems="center" spacing={0.5}>
                    <CheckCircleIcon sx={{ fontSize: 10, color: theme.palette.success.main }} />
                    <Typography
                      variant="caption"
                      sx={{ fontSize: '0.7rem', color: 'text.primary', fontWeight: 600 }}
                    >
                      Coffee Shop
                    </Typography>
                  </Row>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: '0.7rem', color: theme.palette.error.main, fontWeight: 700 }}
                  >
                    ₪28
                  </Typography>
                </Row>
              </motion.div>
              {[
                { name: 'Rent', amount: '₪2,700', color: theme.palette.error.main },
                { name: 'Salary', amount: '₪11,600', color: theme.palette.success.main },
              ].map(tx => (
                <Row key={tx.name} justifyContent="space-between" alignItems="center">
                  <Typography
                    variant="caption"
                    sx={{ fontSize: '0.7rem', color: 'text.secondary' }}
                  >
                    {tx.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: '0.7rem', color: tx.color, fontWeight: 600 }}
                  >
                    {tx.amount}
                  </Typography>
                </Row>
              ))}
            </Column>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

const CATEGORIES = [
  { icon: <RestaurantIcon />, label: 'Food' },
  { icon: <DirectionsCarIcon />, label: 'Transport' },
  { icon: <ShoppingBagIcon />, label: 'Shopping' },
  { icon: <FavoriteIcon />, label: 'Health' },
  { icon: <HomeIcon />, label: 'Housing' },
  { icon: <SchoolIcon />, label: 'Education' },
  { icon: <SportsEsportsIcon />, label: 'Fun' },
];

// Fix 7: All items rendered with stable keys — framer-motion animates x/opacity/scale
// so there's no mount/unmount jank as the carousel advances
const CategoryGalleryPreview = () => {
  const theme = useTheme();
  const [centerIdx, setCenterIdx] = useState(0);
  const n = CATEGORIES.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCenterIdx(i => (i + 1) % n);
    }, 1400);

    return () => clearInterval(timer);
  }, [n]);

  const SLOT = 40; // px between slot centers

  return (
    <Box sx={{ mt: 1.5, position: 'relative', height: 58, overflow: 'hidden' }}>
      {CATEGORIES.map((cat, i) => {
        let offset = (i - centerIdx + n) % n;

        if (offset > Math.floor(n / 2)) {
          offset -= n;
        }

        const isCenter = offset === 0;
        const isNear = Math.abs(offset) === 1;
        const isVisible = Math.abs(offset) <= 2;

        return (
          <motion.div
            key={i}
            animate={{
              x: offset * SLOT,
              opacity: isCenter ? 1 : isNear ? 0.5 : isVisible ? 0.18 : 0,
              scale: isCenter ? 1 : isNear ? 0.76 : 0.55,
            }}
            transition={{ duration: 0.38, ease: 'easeInOut' }}
            style={{ position: 'absolute', left: 'calc(50% - 19px)', top: 0 }}
          >
            <Column alignItems="center" spacing={0.25}>
              <Column
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  color: theme.palette.primary.main,
                  '& svg': { fontSize: 20 },
                }}
              >
                {cat.icon}
              </Column>
              {/* Fixed-height label area keeps layout stable */}
              <Box sx={{ height: 14, display: 'flex', alignItems: 'center' }}>
                <motion.div animate={{ opacity: isCenter ? 1 : 0 }} transition={{ duration: 0.25 }}>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: '0.6rem', color: 'text.secondary', fontWeight: 600, whiteSpace: 'nowrap' }}
                  >
                    {cat.label}
                  </Typography>
                </motion.div>
              </Box>
            </Column>
          </motion.div>
        );
      })}
    </Box>
  );
};

const MiniPreview = ({ type }: MiniPreviewProps) => {
  if (type === 'dashboard') return <DashboardPreview />;
  if (type === 'budgets') return <BudgetsPreview />;
  if (type === 'quickAdd') return <QuickAddPreview />;
  if (type === 'categoryGallery') return <CategoryGalleryPreview />;
  return null;
};

export interface FeatureCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
  accentColor: string;
  badge?: string;
  preview?: 'dashboard' | 'transactions' | 'budgets' | 'quickAdd' | 'categoryGallery' | null;
}

const FeatureCard = ({
  icon,
  title,
  description,
  accentColor,
  badge,
  preview = null,
}: FeatureCardProps) => {
  const theme = useTheme();

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      style={{ height: '100%' }}
    >
      <Paper
        sx={{
          p: 3,
          height: '100%',
          borderRadius: 4,
          backgroundColor: alpha(theme.palette.background.paper, 0.6),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            borderColor: alpha(accentColor, 0.28),
            boxShadow: `0 12px 40px ${alpha(accentColor, 0.1)}`,
          },
        }}
      >
        <Column spacing={1.5} sx={{ height: '100%' }}>
          {/* Fix 6: Icon and title side-by-side in a Row */}
          <Row alignItems="center" justifyContent="space-between">
            <Row alignItems="center" spacing={1.25} sx={{ flex: 1, minWidth: 0 }}>
              <Column
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2.5,
                  backgroundColor: alpha(theme.palette.text.primary, 0.06),
                  border: `1px solid ${alpha(theme.palette.text.secondary, 0.14)}`,
                  color: accentColor,
                  '& svg': { fontSize: 20 },
                  flexShrink: 0,
                }}
              >
                {icon}
              </Column>
              <Typography
                variant="body1"
                sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.3 }}
              >
                {title}
              </Typography>
            </Row>
            {badge && (
              <Chip
                label={badge}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  backgroundColor: alpha(theme.palette.warning.main, 0.12),
                  color: theme.palette.warning.main,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.25)}`,
                  flexShrink: 0,
                  ml: 1,
                }}
              />
            )}
          </Row>

          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, flex: 1 }}>
            {description}
          </Typography>

          {preview && <MiniPreview type={preview} />}
        </Column>
      </Paper>
    </motion.div>
  );
};

export default FeatureCard;
