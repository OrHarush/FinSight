import { Divider } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';
import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import DesktopSidebar from '@/components/shared/layout/sidebar/DesktopSidebar';
import MobileSidebar from '@/components/shared/layout/sidebar/MobileSidebar';
import Settings from '@/components/shared/layout/sidebar/settings';
import SidebarButtons from '@/components/shared/layout/sidebar/SidebarButtons';
import SidebarHeader from '@/components/shared/layout/sidebar/SidebarHeader';
import { useIsMobile } from '@/hooks/common/useIsMobile';

const Sidebar = () => {
  const isMobile = useIsMobile();

  const content = (
    <Column height={'100%'}>
      <SidebarHeader />
      <Divider />
      <ScrollableColumn spacing={2} flex={1} minHeight={0}>
        <SidebarButtons />
      </ScrollableColumn>
      <Divider />
      <Settings />
    </Column>
  );

  if (isMobile) {
    return <MobileSidebar>{content}</MobileSidebar>;
  }

  return <DesktopSidebar>{content}</DesktopSidebar>;
};

export default Sidebar;
