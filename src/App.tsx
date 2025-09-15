import Dashboard from './pages/Dashboard/Dashboard';
import Column from '@/components/Layout/Column';
import { CssBaseline } from '@mui/material';
import AppProviders from '@/providers/AppProviders';

const App = () => {
  return (
    <AppProviders>
      <Column width={'100vw'}>
        <CssBaseline />
        <Dashboard />
      </Column>
    </AppProviders>
  );
};

export default App;
