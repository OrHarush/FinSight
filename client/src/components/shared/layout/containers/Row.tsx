import React from 'react';
import { StackProps } from '@mui/material/Stack/Stack';
import { Stack } from '@mui/material';

interface RowProps extends StackProps {
  children: React.ReactNode[] | React.ReactNode;
  dir?: 'ltr' | 'rtl';
}

const Row = ({ children, dir, ...props }: RowProps) => (
  <Stack {...props} direction={'row'} dir={dir}>
    {children}
  </Stack>
);

export default Row;
