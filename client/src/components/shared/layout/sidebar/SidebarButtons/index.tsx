import DesktopSidebarButtons from '@/components/shared/layout/sidebar/SidebarButtons/DesktopSidebarButtons';
import MobileSidebarButtons from '@/components/shared/layout/sidebar/SidebarButtons/MobileSidebarButtons';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';

const SidebarButtons = () => {
  const isSmallScreen = useIsSmallScreen();

  if (isSmallScreen) {
    return <MobileSidebarButtons />;
  }

  return <DesktopSidebarButtons />;
};

export default SidebarButtons;
