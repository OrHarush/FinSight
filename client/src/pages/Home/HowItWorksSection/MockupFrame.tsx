import { alpha, useTheme } from '@mui/material';
import { ReactNode } from 'react';

import Column from '@/components/shared/layout/containers/Column';

const FRAME_HEIGHT = 320;

interface MockupFrameProps {
  children: ReactNode;
}

const MockupFrame = ({ children }: MockupFrameProps) => {
  const theme = useTheme();

  return (
    <Column
      justifyContent="center"
      sx={{
        width: '100%',
        height: FRAME_HEIGHT,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.common.white, 0.06)}`,
        backgroundColor: '#161b24',
        p: 2.25,
        overflow: 'hidden',
      }}
    >
      {children}
    </Column>
  );
};

export default MockupFrame;
