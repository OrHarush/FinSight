import { ReactNode } from 'react';
import { Stack, useMediaQuery, useTheme } from '@mui/material';
import { StackOwnProps } from '@mui/material/Stack/Stack';

interface ResponsiveRowProps extends StackOwnProps {
  children: ReactNode;
}

const ResponsiveRow = ({ children, ...props }: ResponsiveRowProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack alignItems={'center'} {...props} direction={isMobile ? 'column' : 'row'}>
      {children}
    </Stack>
  );
};

export default ResponsiveRow;
