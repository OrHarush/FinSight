import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import NavBar from '@/components/shared/layout/NavBar';
import { PageHeaderProvider } from '@/components/shared/layout/PageHeaderContext';
import Sidebar from '@/components/shared/layout/sidebar';

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
