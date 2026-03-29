import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, SwipeableDrawer, useTheme } from '@mui/material';
import { ReactNode, useState } from 'react';

import SidebarContext from '@/components/shared/layout/sidebar/SidebarContext';

interface MobileSidebarProps {
  children: ReactNode;
}

const MobileSidebar = ({ children }: MobileSidebarProps) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        onClick={() => setOpen(prev => !prev)}
        sx={{ position: 'absolute', top: 20, left: 4, zIndex: theme.zIndex.drawer + 1 }}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableBackdropTransition={!/iPad|iPhone|iPod/.test(navigator.userAgent)}
        swipeAreaWidth={56}
        disableDiscovery={false}
        keepMounted
      >
        <SidebarContext.Provider value={{ expanded: true, toggleExpanded: () => {} }}>
          {children}
        </SidebarContext.Provider>
      </SwipeableDrawer>
    </>
  );
};

export default MobileSidebar;
