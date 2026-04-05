import { Box, CssBaseline, Typography } from '@mui/material';

import lyraIcon from '@/assets/lyraIcon.webp';
import Column from '@/components/shared/layout/containers/Column';

const HEBREW_MESSAGE =
  'האפליקציה מושבתת זמנית עקב תקלת תשתית של AWS באזור המזרח התיכון. הנתונים שלך בטוחים ואנחנו עובדים על חזרה לפעילות בהקדם האפשרי. תודה על הסבלנות.';

const ENGLISH_MESSAGE =
  'The app is temporarily down due to an AWS infrastructure outage in the Middle East region. Your data is safe and we are working on returning to operation as soon as possible. Thank you for your patience.';

const MaintenancePage = () => (
  <Column
    alignItems="center"
    justifyContent="center"
    spacing={3}
    sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f16 0%, #111827 100%)',
      px: 3,
    }}
  >
    <CssBaseline />

    <Box
      sx={{
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: 'rgba(167, 139, 250, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(167, 139, 250, 0.2)',
      }}
    >
      <img src={lyraIcon} alt="Lyra Icon" width={60} height={60} />
    </Box>

    <Typography
      variant="h5"
      fontWeight={700}
      sx={{ color: '#a78bfa', letterSpacing: 2, textTransform: 'uppercase' }}
    >
      Lyra
    </Typography>

    <Column alignItems="center" spacing={2} sx={{ maxWidth: 480, textAlign: 'center' }}>
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255, 255, 255, 0.85)',
          lineHeight: 1.9,
          direction: 'rtl',
        }}
      >
        {HEBREW_MESSAGE}
      </Typography>

      <Box
        sx={{
          width: 40,
          height: 1,
          background: 'rgba(167, 139, 250, 0.3)',
          my: 1,
        }}
      />

      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontStyle: 'italic' }}>
        {ENGLISH_MESSAGE}
      </Typography>
    </Column>
  </Column>
);

export default MaintenancePage;
