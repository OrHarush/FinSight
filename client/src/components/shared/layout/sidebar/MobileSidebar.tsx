import { SwipeableDrawer } from '@mui/material';
import { ReactNode } from 'react';

import SidebarContext from '@/components/shared/layout/sidebar/SidebarContext';

interface MobileSidebarProps {
  children: ReactNode;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const MobileSidebar = ({ children, open, onOpen, onClose }: MobileSidebarProps) => (
  <SwipeableDrawer
    anchor="left"
    open={open}
    onClose={onClose}
    onOpen={onOpen}
    disableBackdropTransition={!/iPad|iPhone|iPod/.test(navigator.userAgent)}
    swipeAreaWidth={24}
    disableDiscovery={false}
    keepMounted
  >
    <SidebarContext.Provider value={{ expanded: true, toggleExpanded: () => {} }}>
      {children}
    </SidebarContext.Provider>
  </SwipeableDrawer>
);

export default MobileSidebar;
