import React from 'react';
import { StackOwnProps } from '@mui/material/Stack/Stack';
import { Stack } from '@mui/material';

interface ColumnProps extends StackOwnProps {
  children: React.ReactNode[] | React.ReactNode;
}

const Column = ({children, ...props} : ColumnProps )  => {
  return (
    <Stack direction="column" {...props}>
      {children}
    </Stack>
  );
};

export default Column;