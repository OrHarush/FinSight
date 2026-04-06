import FileUploadIcon from '@mui/icons-material/FileUpload';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Row from '@/components/shared/layout/containers/Row';
import Controls from '@/components/shared/layout/NavBar/Controls';
import NavBarContainer from '@/components/shared/layout/NavBar/NavBarContainer';
import ThemeToggleButton from '@/components/shared/layout/NavBar/ThemeToggleButton';
import { usePageHeaderContext } from '@/components/shared/layout/PageHeaderContext';
import LanguageSelect from '@/components/shared/ui/LanguageSelect';
import MonthDateSelector from '@/components/shared/ui/MonthDateSelector';
import { ROUTES } from '@/constants/Routes';
import { useIsMobile } from '@/hooks/common/useIsMobile';

interface NavBarProps {
  onMobileOpen: () => void;
  sidebarExpanded: boolean;
  onToggleSidebar: () => void;
}

const NavBar = ({ onMobileOpen, sidebarExpanded, onToggleSidebar }: NavBarProps) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { title, showDateSelector, showImportButton, dateConfig } = usePageHeaderContext();
  const isRtl = theme.direction === 'rtl';

  const CollapseIcon = isRtl ? KeyboardDoubleArrowRightIcon : KeyboardDoubleArrowLeftIcon;
  const ExpandIcon = isRtl ? KeyboardDoubleArrowLeftIcon : KeyboardDoubleArrowRightIcon;
  const SidebarToggleIcon = sidebarExpanded ? CollapseIcon : ExpandIcon;

  if (isMobile) {
    return (
      <NavBarContainer sx={{ position: 'relative', flexWrap: 'nowrap' }}>
        <Row spacing={1} alignItems="center">
          <IconButton
            onClick={onMobileOpen}
            size="medium"
            sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
          >
            <MenuIcon />
          </IconButton>
          {showImportButton && (
            <IconButton size="medium" onClick={() => navigate(ROUTES.IMPORT_URL)}>
              <FileUploadIcon fontSize="small" />
            </IconButton>
          )}
        </Row>
        {showDateSelector && dateConfig && (
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 0,
            }}
          >
            <MonthDateSelector value={dateConfig.value} onChange={dateConfig.onChange} />
          </Box>
        )}
        <Row spacing={1} alignItems="center" sx={{ marginInlineStart: 'auto' }}>
          <ThemeToggleButton />
          <LanguageSelect sx={{ width: 36, height: 36, backgroundColor: 'transparent' }} />
        </Row>
      </NavBarContainer>
    );
  }

  return (
    <NavBarContainer>
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
    </NavBarContainer>
  );
};

export default NavBar;
