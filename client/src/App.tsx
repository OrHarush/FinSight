import Column from '@/components/Layout/Containers/Column';
import { CssBaseline } from '@mui/material';
import AppProviders from '@/providers/AppProviders';
import AppRoutes from '@/routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
  return (
    <AppProviders>
      <Column width={'100vw'}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Column>
    </AppProviders>
  );
};

export default App;
