import Column from '@/components/shared/layout/containers/Column';
import { ReactNode } from 'react';

interface PlaceholderContainerProps {
  children: ReactNode;
}

const EntityPlaceholderContainer = ({ children }: PlaceholderContainerProps) => (
  <Column
    alignItems="center"
    justifyContent="center"
    spacing={1}
    flex={1}
    color={'gray'}
    textAlign={'center'}
  >
    {children}
  </Column>
);

export default EntityPlaceholderContainer;
