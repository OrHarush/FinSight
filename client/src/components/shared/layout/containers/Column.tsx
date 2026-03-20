import { Stack } from '@mui/material';
import { StackProps } from '@mui/material/Stack/Stack';
import { ReactNode } from 'react';

interface ColumnProps extends StackProps {
  children: ReactNode;
}

const Column = ({ children, ...props }: ColumnProps) => (
  <Stack direction="column" {...props}>
    {children}
  </Stack>
);

export default Column;
