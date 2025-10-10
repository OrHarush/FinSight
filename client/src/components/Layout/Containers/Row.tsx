import React from 'react';
import { StackOwnProps } from '@mui/material/Stack/Stack';
import { Stack, useTheme } from '@mui/material';

interface RowProps extends StackOwnProps {
  children: React.ReactNode[] | React.ReactNode;
}

const Row = ({ children, ...props }: RowProps) => {
  const theme = useTheme();

  return (
    <Stack {...props} direction={theme.direction === 'rtl' ? 'row-reverse' : 'row'}>
      {children}
    </Stack>
  );
};

export default Row;
