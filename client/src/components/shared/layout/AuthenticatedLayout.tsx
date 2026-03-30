import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import NavBar from '@/components/shared/layout/NavBar';
import { PageHeaderProvider } from '@/components/shared/layout/PageHeaderContext';
import Sidebar from '@/components/shared/layout/sidebar';

export const useCurrentBreakpoint = () => {
  const theme = useTheme();
  const xl = useMediaQuery(theme.breakpoints.up('xl'));
  const lg = useMediaQuery(theme.breakpoints.up('lg'));
  const md = useMediaQuery(theme.breakpoints.up('md'));
  const sm = useMediaQuery(theme.breakpoints.up('sm'));

  if (xl) return 'xl';
  if (lg) return 'lg';
  if (md) return 'md';
  if (sm) return 'sm';
  return 'xs';
};

const AuthenticatedLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);
  const toggleSidebar = () => setSidebarExpanded(prev => !prev);

  return (
    <PageHeaderProvider>
      <Row height={'100dvh'} width={'100%'} overflow={'hidden'}>
        <Sidebar
          mobileOpen={mobileOpen}
          onMobileOpen={openMobile}
          onMobileClose={closeMobile}
          sidebarExpanded={sidebarExpanded}
          onToggleSidebar={toggleSidebar}
        />
        <Column width={'100%'} minWidth={0} minHeight={0} overflow={'auto'}>
          <NavBar
            onMobileOpen={openMobile}
            sidebarExpanded={sidebarExpanded}
            onToggleSidebar={toggleSidebar}
          />
          <Column height={'100%'} minHeight={0} overflow={'auto'} padding={'16px'}>
            <Outlet />
          </Column>
        </Column>
      </Row>
    </PageHeaderProvider>
  );
};

export default AuthenticatedLayout;
