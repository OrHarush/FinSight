import { Stack } from '@mui/material';
import { StackProps } from '@mui/material/Stack/Stack';
import React, { forwardRef } from 'react';

interface RowProps extends StackProps {
  children: React.ReactNode[] | React.ReactNode;
  dir?: 'ltr' | 'rtl';
}

const Row = forwardRef<HTMLDivElement, RowProps>(({ children, dir, ...props }, ref) => (
  <Stack ref={ref} {...props} direction={'row'} dir={dir}>
    {children}
  </Stack>
));

Row.displayName = 'Row';

export default Row;
