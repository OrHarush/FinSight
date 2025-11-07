import { Box, IconButton, Typography } from '@mui/material';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import { ReactNode } from 'react';

interface SwipeableCardProps {
  children?: ReactNode;
  onDelete?: () => void;
}

const SwipeableCard = ({ children, onDelete }: SwipeableCardProps) => {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const deleteButtonOpacity = useTransform(x, [-150, 0], [1, 0]);

  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    await controls.start({ x: 0, transition: { type: 'tween', stiffness: 300 } });

    if (info.offset.x < -500) {
      if (onDelete) {
        onDelete();
      }
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
          right: 0,
          bottom: 0,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
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
            swipe to delete
          </Typography>
        </IconButton>
      </motion.div>
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
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
