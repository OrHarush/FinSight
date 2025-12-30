import Row from '@/components/shared/layout/containers/Row';
import Column from '@/components/shared/layout/containers/Column';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import LanguageSelect from '@/components/shared/ui/LanguageSelect';

const PublicLayout = () => (
  <Row height={'100vh'} width={'100vw'} overflow={'auto'}>
    <Box
      sx={{
        position: 'absolute',
        top: { xs: 16, md: 24 },
        right: { xs: 16, md: 24 },
        left: 'auto',
        zIndex: 10,
      }}
    >
      <LanguageSelect />
    </Box>
    <Column width={'100%'} position={'relative'}>
      <Outlet />
    </Column>
  </Row>
);

export default PublicLayout;
