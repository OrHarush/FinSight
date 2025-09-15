import React from 'react';
import { StackOwnProps } from '@mui/material/Stack/Stack';
import { Stack } from '@mui/material';

interface RowProps extends StackOwnProps {
  children: React.ReactNode[] | React.ReactNode;
}

const Row = ({children, ...props} : RowProps )  => {
  return (
    <Stack direction="row" {...props}>
      {children}
    </Stack>
  );
};

export default Row;