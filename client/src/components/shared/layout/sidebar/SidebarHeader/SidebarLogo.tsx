import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import finSightIcon from '@/assets/finSightIcon.webp';
import { ROUTES } from '@/constants/Routes';

interface SidebarLogoProps {
  size?: number;
}

const SidebarLogo = ({ size = 50 }: SidebarLogoProps) => {
  const navigate = useNavigate();

  return (
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
      <img src={finSightIcon} alt="App Logo" width={size} height={size} />
    </Box>
  );
};

export default SidebarLogo;
