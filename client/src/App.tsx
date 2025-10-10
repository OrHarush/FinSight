import Column from '@/components/Layout/Containers/Column';
import { CssBaseline } from '@mui/material';
import AppProviders from '@/providers/AppProviders';
import AppRoutes from '@/routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const App = () => {
  console.log('API Base URL:', import.meta.env.VITE_API_URL);

  return (
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
};

export default App;
