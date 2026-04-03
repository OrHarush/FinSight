import { Outlet } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';

const PublicLayout = () => (
  <Column height={'100vh'} width={'100vw'} overflow={'hidden'}>
    <Outlet />
  </Column>
);

export default PublicLayout;
