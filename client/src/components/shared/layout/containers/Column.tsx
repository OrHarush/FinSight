import { ReactNode } from 'react';
import { StackProps } from '@mui/material/Stack/Stack';
import { Stack } from '@mui/material';

interface ColumnProps extends StackProps {
  children: ReactNode;
}

const Column = ({ children, ...props }: ColumnProps) => (
  <Stack direction="column" {...props}>
    {children}
  </Stack>
);

export default Column;
