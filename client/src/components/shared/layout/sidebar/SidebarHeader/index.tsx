import CloseIcon from '@mui/icons-material/Close';
import { IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import LyraLogo from '@/components/shared/layout/LyraLogo';
import { useSidebar } from '@/components/shared/layout/sidebar/SidebarContext';
import { ROUTES } from '@/constants/Routes';
import { useIsMobile } from '@/hooks/common/useIsMobile';

const logoClickSx = {
  cursor: 'pointer',
  transition: 'transform 0.25s ease',
  ':hover': { transform: 'scale(1.05)' },
};

interface SidebarHeaderProps {
  onMobileClose: () => void;
}

const SidebarHeader = ({ onMobileClose }: SidebarHeaderProps) => {
  const theme = useTheme();
  const isMobileBreakpointMd = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { expanded } = useSidebar();

  if (!isMobile && !expanded) {
    return (
      <Column alignItems="center" padding={2} spacing={1}>
        <Row onClick={() => navigate(ROUTES.OVERVIEW_URL)} sx={logoClickSx}>
          <LyraLogo iconSize={40} showWordmark={false} />
        </Row>
      </Column>
    );
  }

  return (
    <Row
      alignItems="center"
      height={'56px'}
      spacing={isMobileBreakpointMd ? 1 : 2}
      padding={2}
      justifyContent="space-between"
      sx={{ borderBottom: '1px solid', borderColor: theme.palette.divider }}
    >
      <Row onClick={() => navigate(ROUTES.OVERVIEW_URL)} sx={logoClickSx}>
        <LyraLogo iconSize={32} />
      </Row>
      {isMobile && (
        <IconButton onClick={onMobileClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Row>
  );
};

export default SidebarHeader;
