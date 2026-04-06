import { useTheme } from '@mui/material';
import { StackProps } from '@mui/material/Stack/Stack';
import { ReactNode } from 'react';

import Row from '@/components/shared/layout/containers/Row';
import { navBarSx } from '@/components/shared/layout/NavBar/styles';

interface NavBarProps extends StackProps {
  children: ReactNode;
}

const NavBarContainer = ({ children, ...props }: NavBarProps) => {
  const theme = useTheme();

  return (
    <Row
      component={'header'}
      alignItems="center"
      sx={[navBarSx(theme), ...(Array.isArray(props.sx) ? props.sx : [props.sx])]}
    >
      {children}
    </Row>
  );
};

export default NavBarContainer;
