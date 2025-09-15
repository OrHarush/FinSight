import Column from '@/components/Layout/Column';
import Sidebar from '@/components/Layout/Sidebar';
import Row from '@/components/Layout/Row';
import { StackOwnProps } from '@mui/material/Stack/Stack';

interface PageLayoutProps extends StackOwnProps {
  children?: React.ReactNode[] | React.ReactNode;
}

const PageLayout = ({ children, ...props }: PageLayoutProps) => {
  return (
    <Row height={'100vh'} width={'100vw'}>
      <Sidebar />
      <Column padding={'16px'} width={'100%'} {...props}>
        {children}
      </Column>
    </Row>
  );
};

export default PageLayout;
