import { Typography } from '@mui/material';
import Column from '@/components/Layout/Containers/Column';
import logo from '@/assets/finSightIcon.png';

const ComingSoon = () => (
  <Column
    alignItems="center"
    justifyContent="center"
    spacing={4}
    sx={{
      minHeight: '100%',
      textAlign: 'center',
      color: '#fff',
    }}
  >
    <img src={logo} alt="FinSight Logo" width={120} height={120} style={{ borderRadius: '12px' }} />
    <Typography variant="h3" fontWeight={600}>
      Coming Soon
    </Typography>
    <Typography variant="subtitle1" sx={{ maxWidth: 400 }}>
      We’re working hard to bring you something amazing. Stay tuned for updates!
    </Typography>
  </Column>
);

export default ComingSoon;
