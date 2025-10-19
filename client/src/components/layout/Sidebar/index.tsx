import {
  Divider,
  Drawer,
  IconButton,
  SwipeableDrawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

import SidebarButtons from '@/components/layout/Sidebar/SidebarButtons';
import Settings from '@/components/layout/Sidebar/Settings';
import SidebarHeader from '@/components/layout/Sidebar/SidebarHeader';

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
          {drawerContent}
        </SwipeableDrawer>
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
          borderRadius: 0,
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
