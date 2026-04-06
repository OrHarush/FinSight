import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { Divider, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import HelpModal from '@/components/features/users/HelpModal';
import SettingsModal from '@/components/features/users/SettingsModal';
import LegalModal from '@/components/legal/LegalModal';
import { useOpen } from '@/hooks/common/useOpen';
import { useAuth } from '@/providers/AuthProvider';

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
}

const UserMenu = ({ anchorEl, setAnchorEl }: UserMenuProps) => {
  const { t } = useTranslation(['sidebar', 'user']);
  const { user, logout } = useAuth();
  const [isSettingsOpen, openSettings, closeSettings] = useOpen();
  const [isHelpOpen, openHelp, closeHelp] = useOpen();
  const [isAccessibilityOpen, openAccessibility, closeAccessibility] = useOpen();

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseMenu();
  };

  const handleOpenSettings = () => {
    handleCloseMenu();
    openSettings();
  };

  const handleOpenHelp = () => {
    handleCloseMenu();
    openHelp();
  };

  const handleOpenAccessibility = () => {
    handleCloseMenu();
    openAccessibility();
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
              overflow: 'visible',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            },
          },
        }}
      >
        <MenuItem disabled sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="body2" color="text.secondary">
            {t('settings.signedInAs', { defaultValue: 'Signed in as' })}
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {user!.email}
          </Typography>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleOpenSettings}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          {t('settings.title')}
        </MenuItem>
        <MenuItem onClick={handleOpenHelp}>
          <ListItemIcon>
            <HelpOutlineIcon fontSize="small" />
          </ListItemIcon>
          {t('settings.help')}
        </MenuItem>
        <MenuItem onClick={handleOpenAccessibility}>
          <ListItemIcon>
            <AccessibilityNewIcon fontSize="small" />
          </ListItemIcon>
          {t('common:LegalPage.accessibility')}
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {t('actions.logout')}
        </MenuItem>
      </Menu>
      {isSettingsOpen && <SettingsModal isOpen={isSettingsOpen} closeDialog={closeSettings} />}
      {isHelpOpen && <HelpModal isOpen={isHelpOpen} closeDialog={closeHelp} />}
      {isAccessibilityOpen && (
        <LegalModal
          isOpen={isAccessibilityOpen}
          onClose={closeAccessibility}
          type="accessibility"
        />
      )}
    </>
  );
};

export default UserMenu;
