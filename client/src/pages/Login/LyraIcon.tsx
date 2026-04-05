import { Box } from '@mui/material';

import lyraIcon from '@/assets/lyraIcon.webp';

interface LyraIconProps {
  size?: number;
}

const LyraIcon = ({ size = 100 }: LyraIconProps) => (
  <Box
    sx={{
      width: size,
      height: size,
      margin: '0 auto 24px',
      borderRadius: `${size * 0.24}px`,
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      position: 'relative',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: '8px',
        borderRadius: '16px',
        background: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.4), transparent 70%)',
        pointerEvents: 'none',
      },
    }}
  >
    <img
      src={lyraIcon}
      alt="Lyra Icon"
      width={size}
      height={size}
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))',
        position: 'relative',
        zIndex: 1,
      }}
    />
  </Box>
);

export default LyraIcon;
