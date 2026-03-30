import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useSidebar } from '@/components/shared/layout/sidebar/SidebarContext';
import SidebarLogo from '@/components/shared/layout/sidebar/SidebarHeader/SidebarLogo';
import { ROUTES } from '@/constants/Routes';
import { useIsMobile } from '@/hooks/common/useIsMobile';

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
      <Column alignItems="center" padding={1} spacing={1}>
        <SidebarLogo size={40} />
      </Column>
    );
  }

  return (
    <Row
      alignItems="center"
      height={'64px'}
      spacing={isMobileBreakpointMd ? 1 : 2}
      padding={2}
      justifyContent="space-between"
      sx={{ border: '1px solid', borderColor: theme.palette.divider }}
    >
      <Row alignItems="center" spacing={isMobileBreakpointMd ? 1 : 2}>
        <SidebarLogo size={32} />
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
