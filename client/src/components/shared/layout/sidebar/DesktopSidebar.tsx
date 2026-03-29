import { Drawer } from '@mui/material';
import { ReactNode, useState } from 'react';

import SidebarContext from '@/components/shared/layout/sidebar/SidebarContext';

const SIDEBAR_EXPANDED_WIDTH = 255;
const SIDEBAR_COLLAPSED_WIDTH = 64;

interface DesktopSidebarProps {
  children: ReactNode;
}

const DesktopSidebar = ({ children }: DesktopSidebarProps) => {
  const [expanded, setExpanded] = useState(true);
  const toggleExpanded = () => setExpanded(prev => !prev);

  return (
    <SidebarContext.Provider value={{ expanded, toggleExpanded }}>
      <Drawer
        sx={{
          width: expanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
          flexShrink: 0,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '& .MuiDrawer-paper': {
            width: expanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
            boxSizing: 'border-box',
            borderRadius: 0,
            overflowX: 'hidden',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {children}
      </Drawer>
    </SidebarContext.Provider>
  );
};

export default DesktopSidebar;
