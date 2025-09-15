import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from '@/theme/darkTheme';

interface AppProvidersProps {
  children?: React.ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
  </LocalizationProvider>
);
export default AppProviders;
