import Column from '@/components/Layout/Containers/Column';
import { CssBaseline } from '@mui/material';
import AppProviders from '@/providers/AppProviders';
import AppRoutes from '@/routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const App = () => (
  <ErrorBoundary>
    <AppProviders>
      <Column width={'100vw'}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Column>
    </AppProviders>
  </ErrorBoundary>
);

export default App;
