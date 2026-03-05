import { ReactNode } from 'react';
import { useTheme } from '@mui/material';
import { StackOwnProps } from '@mui/material/Stack/Stack';
import Column from '@/components/shared/layout/containers/Column';
import { getCustomScrollbarStyles } from '@/utils/scrollbarStyles';

interface ScrollableColumnProps extends StackOwnProps {
  children: ReactNode;
  maxHeight?: number | string;
}

const ScrollableColumn = ({ maxHeight = 400, children, ...props }: ScrollableColumnProps) => {
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
