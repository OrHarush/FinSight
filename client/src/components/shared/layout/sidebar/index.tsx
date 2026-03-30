import Column from '@/components/shared/layout/containers/Column';
import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import DesktopSidebar from '@/components/shared/layout/sidebar/DesktopSidebar';
import MobileSidebar from '@/components/shared/layout/sidebar/MobileSidebar';
import Settings from '@/components/shared/layout/sidebar/settings';
import SidebarButtons from '@/components/shared/layout/sidebar/SidebarButtons';
import SidebarHeader from '@/components/shared/layout/sidebar/SidebarHeader';
import { useIsMobile } from '@/hooks/common/useIsMobile';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileOpen: () => void;
  onMobileClose: () => void;
  sidebarExpanded: boolean;
  onToggleSidebar: () => void;
}

const Sidebar = ({
  mobileOpen,
  onMobileOpen,
  onMobileClose,
  sidebarExpanded,
  onToggleSidebar,
}: SidebarProps) => {
  const isMobile = useIsMobile();

  const content = (
    <Column height={'100%'}>
      <SidebarHeader onMobileClose={onMobileClose} />
      <ScrollableColumn spacing={2} flex={1} minHeight={0}>
        <SidebarButtons />
      </ScrollableColumn>
      <Settings />
    </Column>
  );

  if (isMobile) {
    return (
      <MobileSidebar open={mobileOpen} onOpen={onMobileOpen} onClose={onMobileClose}>
        {content}
      </MobileSidebar>
    );
  }

  return (
    <DesktopSidebar expanded={sidebarExpanded} toggleExpanded={onToggleSidebar}>
      {content}
    </DesktopSidebar>
  );
};

export default Sidebar;
