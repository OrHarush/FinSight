import { Box, Paper } from '@mui/material';
import { ReactNode } from 'react';

import SidebarContext from '@/components/shared/layout/sidebar/SidebarContext';

const SIDEBAR_EXPANDED_WIDTH = 255;
const SIDEBAR_COLLAPSED_WIDTH = 64;

interface DesktopSidebarProps {
  children: ReactNode;
  expanded: boolean;
  toggleExpanded: () => void;
}

const DesktopSidebar = ({ children, expanded, toggleExpanded }: DesktopSidebarProps) => {
  const width = expanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <SidebarContext.Provider value={{ expanded, toggleExpanded }}>
      <Box
        component="aside"
        sx={{
          width,
          flexShrink: 0,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          height: '100vh',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width,
            height: '100%',
            borderRadius: 0,
            borderRight: '1px solid',
            borderColor: 'divider',
            overflowX: 'hidden',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {children}
        </Paper>
      </Box>
    </SidebarContext.Provider>
  );
};

export default DesktopSidebar;
