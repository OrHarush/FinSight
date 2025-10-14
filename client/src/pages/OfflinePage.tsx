import Column from '@/components/layout/Containers/Column';
import { Button, Typography, Box } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`;

const OfflinePage = () => (
  <Column
    alignItems="center"
    justifyContent="center"
    spacing={3}
    sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: 3,
    }}
  >
    <Box
      sx={{
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: 'rgba(147, 112, 219, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: `${pulse} 2s ease-in-out infinite`,
      }}
    >
      <WifiOffIcon sx={{ fontSize: 60, color: '#9370db' }} />
    </Box>

    <Box
      sx={{
        display: 'inline-block',
        padding: '6px 12px',
        background: 'rgba(255, 152, 0, 0.2)',
        borderRadius: '8px',
        marginBottom: 2,
      }}
    >
      <Typography variant="body2" sx={{ color: '#ffa726' }}>
        📡 No Connection
      </Typography>
    </Box>

    <Column alignItems="center" spacing={1.5} sx={{ maxWidth: 400, textAlign: 'center' }}>
      <Typography variant="h4" fontWeight={700} color="white">
        Youre Offline
      </Typography>

      <Typography variant="body1" color="rgba(255, 255, 255, 0.7)" sx={{ lineHeight: 1.6 }}>
        No internet connection detected. Some features may be limited, but you can still view your
        cached data.
      </Typography>
    </Column>

    <Button
      variant="contained"
      onClick={() => window.location.reload()}
      sx={{
        borderRadius: '12px',
        padding: '14px 32px',
        fontSize: 16,
        fontWeight: 600,
        backgroundColor: '#9370db',
        '&:hover': {
          backgroundColor: '#7d5bbe',
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(147, 112, 219, 0.4)',
        },
      }}
    >
      Try Again
    </Button>

    <Box
      sx={{
        marginTop: 4,
        padding: 2,
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        maxWidth: 400,
      }}
    >
      <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" textAlign="center">
        💡 Your recent transactions and accounts are still available offline
      </Typography>
    </Box>
  </Column>
);

export default OfflinePage;
