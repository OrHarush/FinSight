import { ReactNode } from 'react';

import Column from '@/components/shared/layout/containers/Column';

const FRAME_HEIGHT = 312;

interface MockupFrameProps {
  children: ReactNode;
}

const MockupFrame = ({ children }: MockupFrameProps) => (
  <Column
    justifyContent="flex-start"
    sx={{
      width: '100%',
      height: FRAME_HEIGHT,
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      backgroundColor: 'background.paper',
      p: 2.25,
      overflow: 'hidden',
    }}
  >
    {children}
  </Column>
);

export default MockupFrame;
