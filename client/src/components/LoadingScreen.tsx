import { Box, CircularProgress, Typography } from '@mui/material';
// import finSightIcon from '../assets/finSightIcon.png';

const LoadingScreen = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
    flexDirection="column"
    sx={{ background: '#121212', color: 'white' }}
  >
    {/*<img src={finSightIcon} alt="FinSight Logo" width={180} height={180} />*/}
    <Typography variant="h6" mt={2}>
      Loading FinSight...
    </Typography>
    <CircularProgress sx={{ mt: 3, color: 'primary.main' }} />
  </Box>
);

export default LoadingScreen;
