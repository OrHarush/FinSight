import Column from '@/components/Layout/Column';
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
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
};

export default PageLayout;
