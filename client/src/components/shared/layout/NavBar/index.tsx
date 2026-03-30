import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Typography, useTheme } from '@mui/material';

import Row from '@/components/shared/layout/containers/Row';
import Controls from '@/components/shared/layout/NavBar/Controls';
import { navBarSx } from '@/components/shared/layout/NavBar/styles';
import { usePageHeaderContext } from '@/components/shared/layout/PageHeaderContext';
import { useIsMobile } from '@/hooks/common/useIsMobile';

interface NavBarProps {
  onMobileOpen: () => void;
  sidebarExpanded: boolean;
  onToggleSidebar: () => void;
}

const NavBar = ({ onMobileOpen, sidebarExpanded, onToggleSidebar }: NavBarProps) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const { title } = usePageHeaderContext();
  const isRtl = theme.direction === 'rtl';

  const CollapseIcon = isRtl ? KeyboardDoubleArrowRightIcon : KeyboardDoubleArrowLeftIcon;
  const ExpandIcon = isRtl ? KeyboardDoubleArrowLeftIcon : KeyboardDoubleArrowRightIcon;
  const SidebarToggleIcon = sidebarExpanded ? CollapseIcon : ExpandIcon;

  if (isMobile) {
    return (
      <Row alignItems="center" sx={navBarSx(theme)}>
        <IconButton
          onClick={onMobileOpen}
          size="medium"
          sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
        >
          <MenuIcon />
        </IconButton>
        <Controls />
      </Row>
    );
  }

  return (
    <Row alignItems="center" sx={navBarSx(theme)}>
      <IconButton onClick={onToggleSidebar} size="small">
        <SidebarToggleIcon fontSize="small" />
      </IconButton>
      {title && (
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mx: 1.5, whiteSpace: 'nowrap', minWidth: 0 }}
        >
          {title}
        </Typography>
      )}
      <Controls />
    </Row>
  );
};

export default NavBar;
