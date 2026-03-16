import Column from '@/components/shared/layout/containers/Column';
import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/common/useIsMobile';

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <Column
      height="100%"
      width="100%"
      maxWidth={'1200px'}
      spacing={2}
      padding={isMobile ? 0 : 2}
      alignSelf={'center'}
    >
      {children}
    </Column>
  );
};

export default PageLayout;
