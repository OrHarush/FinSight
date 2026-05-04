import { ReactNode } from 'react';

import Column from '@/components/shared/layout/containers/Column';

const FRAME_HEIGHT = 320;

interface MockupFrameProps {
  children: ReactNode;
}

const MockupFrame = ({ children }: MockupFrameProps) => (
  <Column
    justifyContent="center"
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
