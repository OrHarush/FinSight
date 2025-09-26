import Column from '@/components/Layout/Containers/Column';
import { ReactNode } from 'react';

interface PlaceholderContainerProps {
  children: ReactNode;
}

const PlaceholderContainer = ({ children }: PlaceholderContainerProps) => (
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

export default PlaceholderContainer;
