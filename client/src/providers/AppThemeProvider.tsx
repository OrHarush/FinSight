import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { createContext, ReactNode, useContext, useEffect,useMemo, useState } from 'react'; // Added useEffect
import { useTranslation } from 'react-i18next';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

import { darkTheme } from '@/theme/darkTheme';
import { lightTheme } from '@/theme/lightTheme';

interface AppThemeContextType {
  toggleColorMode: () => void;
}

const AppThemeContext = createContext<AppThemeContextType>({
  toggleColorMode: () => {},
});

export const useAppTheme = () => useContext(AppThemeContext);

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
  key: 'muiltr',
});

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const { i18n } = useTranslation();

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => setMode(prev => (prev === 'light' ? 'dark' : 'light')),
    }),
    []
  );

  const isRtl = i18n.language === 'he';

  const theme = useMemo(() => {
    const baseTheme = mode === 'light' ? lightTheme : darkTheme;
    return {
      ...baseTheme,
      direction: isRtl ? 'rtl' : 'ltr',
      typography: {
        ...baseTheme.typography,
        fontFamily: isRtl
          ? '"Heebo", "Inter", -apple-system, BlinkMacSystemFont, sans-serif'
          : baseTheme.typography.fontFamily,
      },
    };
  }, [mode, isRtl]);

  useEffect(() => {
    document.dir = isRtl ? 'rtl' : 'ltr';
  }, [isRtl]);

  return (
    <AppThemeContext.Provider value={colorMode}>
      <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </CacheProvider>
    </AppThemeContext.Provider>
  );
};
