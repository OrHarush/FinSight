import { useTheme } from '@mui/material';
import { StackProps } from '@mui/material/Stack/Stack';
import { ReactNode } from 'react';

import Column from '@/components/shared/layout/containers/Column';
import { getCustomScrollbarStyles } from '@/components/shared/layout/containers/scrollbarStyles';

interface ScrollableColumnProps extends StackProps {
  children: ReactNode;
  maxHeight?: number | string;
}

const ScrollableColumn = ({ maxHeight = 'none', children, ...props }: ScrollableColumnProps) => {
  const theme = useTheme();

  return (
    <Column
      {...props}
      sx={{
        maxHeight,
        overflow: 'auto',
        pr: 1,
        ...getCustomScrollbarStyles(theme),
        ...props.sx,
      }}
    >
      {children}
    </Column>
  );
};

export default ScrollableColumn;
