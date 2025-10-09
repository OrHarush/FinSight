import { Box } from '@mui/material';
import finSightIcon from '@/assets/finSightIcon.png';

const FinSightIcon = () => (
  <Box
    sx={{
      width: 120,
      height: 120,
      margin: '0 auto 24px',
      borderRadius: '24px',
      background:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 255, 0.95) 100%)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255, 255, 255, 0.5)',
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
      src={finSightIcon}
      alt="App Logo"
      width={80}
      height={80}
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))',
        position: 'relative',
        zIndex: 1,
      }}
    />
  </Box>
);

export default FinSightIcon;
