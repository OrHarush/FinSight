import { Box, IconButton, Typography } from '@mui/material';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface SwipeableCardProps {
  children?: ReactNode;
  onDelete?: () => void;
}

const SwipeableCard = ({ children, onDelete }: SwipeableCardProps) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'he';

  const x = useMotionValue(0);
  const controls = useAnimation();
  const deleteButtonOpacity = useTransform(x, isRtl ? [0, 150] : [0, -150], [0, 1]);

  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    await controls.start({ x: 0, transition: { type: 'tween', stiffness: 300 } });

    const deleteThreshold = isRtl ? 500 : -500;
    const shouldDelete = isRtl ? info.offset.x > deleteThreshold : info.offset.x < deleteThreshold;

    if (shouldDelete && onDelete) {
      onDelete();
    }
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Box
      className="swipeable-wrapper"
      sx={{ position: 'relative', overflow: 'hidden', width: '100%' }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          ...(isRtl ? { left: 0 } : { right: 0 }),
          bottom: 0,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          backgroundColor: '#ef4444',
          opacity: deleteButtonOpacity,
        }}
      >
        <IconButton
          onClick={handleDelete}
          sx={{
            color: 'white',
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'row',
            gap: 0.5,
            padding: '12px 16px',
            borderRadius: 0,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <DeleteIcon sx={{ fontSize: 24 }} />
          <Typography variant="caption" fontSize={11} fontWeight={500}>
            {t('actions.swipeToDelete')}
          </Typography>
        </IconButton>
      </motion.div>
      <motion.div
        drag="x"
        dragConstraints={isRtl ? { left: 0, right: 150 } : { left: -150, right: 0 }}
        dragElastic={0}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{
          x,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </motion.div>
    </Box>
  );
};

export default SwipeableCard;
