import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import Sidebar from '@/components/layout/Sidebar';
import { Outlet } from 'react-router-dom';

const AuthenticatedLayout = () => (
  <Row height={'100vh'} width={'100vw'} overflow={'auto'}>
    <Sidebar />
    <Column padding={'16px'} width={'100%'}>
      <Outlet />
    </Column>
  </Row>
);

export default AuthenticatedLayout;
