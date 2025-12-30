import Column from '@/components/shared/layout/containers/Column';
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => (
  <Column
    height="100%"
    width="100%"
    maxWidth={'1200px'}
    spacing={2}
    padding={2}
    alignSelf={'center'}
  >
    {children}
  </Column>
);

export default PageLayout;
