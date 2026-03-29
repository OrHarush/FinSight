import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useSidebar } from '@/components/shared/layout/sidebar/SidebarContext';
import SidebarLogo from '@/components/shared/layout/sidebar/SidebarHeader/SidebarLogo';
import { ROUTES } from '@/constants/Routes';
import { useIsMobile } from '@/hooks/common/useIsMobile';
const SidebarHeader = () => {
  const theme = useTheme();
  const isMobileBreakpointMd = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { expanded, toggleExpanded } = useSidebar();
  const isRtl = theme.direction === 'rtl';

  const CollapseIcon = isRtl ? KeyboardDoubleArrowRightIcon : KeyboardDoubleArrowLeftIcon;
  const ExpandIcon = isRtl ? KeyboardDoubleArrowLeftIcon : KeyboardDoubleArrowRightIcon;

  if (!isMobile && !expanded) {
    return (
      <Column alignItems="center" padding={1} spacing={1}>
        <SidebarLogo size={40} />
        <IconButton onClick={toggleExpanded} size="small">
          <ExpandIcon fontSize="small" />
        </IconButton>
      </Column>
    );
  }

  return (
    <Row
      alignItems="center"
      spacing={isMobileBreakpointMd ? 1 : 2}
      padding={2}
      marginLeft={isMobileBreakpointMd ? '32px' : 0}
      justifyContent="space-between"
    >
      <Row alignItems="center" spacing={isMobileBreakpointMd ? 1 : 2}>
        <SidebarLogo size={50} />
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
      {!isMobile && (
        <IconButton onClick={toggleExpanded} size="small">
          <CollapseIcon fontSize="small" />
        </IconButton>
      )}
    </Row>
  );
};

export default SidebarHeader;
