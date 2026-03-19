import SidebarNavigationButton, {
  SidebarButtonConfig,
} from '@/components/shared/layout/sidebar/SidebarNavigationButton';
import { useTranslation } from 'react-i18next';

interface SidebarSecondaryNavigationProps {
  secondaryNavigation: SidebarButtonConfig[];
  currentPath: string;
}

const SidebarSecondaryNavigation = ({
  secondaryNavigation,
  currentPath,
}: SidebarSecondaryNavigationProps) => {
  const { t } = useTranslation('sidebar');

  return (
    <>
      {secondaryNavigation.map(button => (
        <SidebarNavigationButton
          key={button.titleKey}
          button={button}
          isActive={currentPath === button.route}
          title={t(button.titleKey)}
        />
      ))}
    </>
  );
};

export default SidebarSecondaryNavigation;
