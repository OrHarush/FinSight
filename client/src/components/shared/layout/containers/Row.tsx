import { Stack } from '@mui/material';
import { StackProps } from '@mui/material/Stack/Stack';
import React from 'react';

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
