import { Divider, Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

import SidebarButtons from '@/components/Layout/Sidebar/SidebarButtons';
import Settings from '@/components/Layout/Sidebar/Settings';
import SidebarHeader from '@/components/Layout/Sidebar/SidebarHeader';

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  const drawerContent = (
    <>
      <SidebarHeader />
      <Divider />
      <SidebarButtons />
      <Divider />
      <Settings />
    </>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={() => setOpen(prev => !prev)}
          sx={{ position: 'absolute', top: 20, left: 4, zIndex: theme.zIndex.drawer + 1 }}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <Drawer open={open} onClose={() => setOpen(false)} variant="temporary">
          {drawerContent}
        </Drawer>
      </>
    );
  }

  return (
    <Drawer
      sx={{
        width: 255,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 255,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
