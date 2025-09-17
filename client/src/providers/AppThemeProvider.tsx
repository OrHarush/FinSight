import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '@/theme/lightTheme';
import { darkTheme } from '@/theme/darkTheme';

interface AppThemeContextType {
  toggleColorMode: () => void;
}

const AppThemeContext = createContext<AppThemeContextType>({
  toggleColorMode: () => {},
});

export const useAppTheme = () => useContext(AppThemeContext);

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => setMode(prev => (prev === 'light' ? 'dark' : 'light')),
    }),
    []
  );

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <AppThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppThemeContext.Provider>
  );
};
