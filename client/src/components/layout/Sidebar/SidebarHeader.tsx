import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import finSightIcon from '@/assets/finSightIconNoText.png';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/Routes';

const SidebarHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={isMobile ? 1 : 2}
      padding={2}
      marginLeft={isMobile ? '32px' : 0}
    >
      <Box
        onClick={() => navigate(ROUTES.OVERVIEW_URL)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.25s ease',
          ':hover': {
            cursor: 'pointer',
            transform: 'scale(1.08)',
          },
        }}
      >
        <img src={finSightIcon} alt="App Logo" width={50} height={50} />
      </Box>

      <Typography
        variant="h5"
        fontWeight={700}
        onClick={() => navigate(ROUTES.OVERVIEW_URL)}
        sx={{
          ':hover': {
            cursor: 'pointer',
            transform: 'scale(1.05)',
            transition: 'transform 0.25s ease',
          },
        }}
      >
        FinSight
      </Typography>
    </Stack>
  );
};

export default SidebarHeader;
