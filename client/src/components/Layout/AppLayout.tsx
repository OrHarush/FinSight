import Column from '@/components/Layout/Column';
import Row from '@/components/Layout/Row';
import Sidebar from '@/components/Layout/Sidebar';
import { Outlet } from 'react-router-dom';

const AppLayout = () => (
  <Row height={'100vh'} width={'100vw'} overflow={'auto'}>
    <Sidebar />
    <Column padding={'16px'} width={'100%'}>
      <Outlet />
    </Column>
  </Row>
);

export default AppLayout;
