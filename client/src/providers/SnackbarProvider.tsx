import { alpha, Alert, Box, Snackbar, useTheme } from '@mui/material';
import { createContext, ReactNode, useContext, useState } from 'react';

const AUTO_HIDE_DURATION = 4000;

import { useIsMobile } from '@/hooks/common/useIsMobile';

type AlertSeverity = 'success' | 'error' | 'warning' | 'info';

interface SnackbarContextValue {
  alertSuccess: (message: string) => void;
  alertError: (message: string) => void;
  alertWarning: (message: string) => void;
  alertInfo: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertSeverity>('info');
  const [snackbarKey, setSnackbarKey] = useState(0);
  const isMobile = useIsMobile();
  const theme = useTheme();

  const severityColor: Record<AlertSeverity, string> = {
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info.main,
  };

  const showAlert = (msg: string, sev: AlertSeverity) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
    setSnackbarKey(k => k + 1);
  };

  const handleClose = () => setOpen(false);

  const value: SnackbarContextValue = {
    alertSuccess: msg => showAlert(msg, 'success'),
    alertError: msg => showAlert(msg, 'error'),
    alertWarning: msg => showAlert(msg, 'warning'),
    alertInfo: msg => showAlert(msg, 'info'),
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: isMobile ? 'top' : 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{
            width: '100%',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            bgcolor: alpha(severityColor[severity], 0.12),
            border: `1px solid ${alpha(severityColor[severity], 0.25)}`,
            color: severityColor[severity],
            '& .MuiAlert-icon': { color: severityColor[severity] },
            '& .MuiAlert-action': { pt: 0, color: severityColor[severity] },
          }}
        >
          {message}
          <Box
            key={snackbarKey}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px',
              bgcolor: severityColor[severity],
              '@keyframes snackbarProgress': {
                from: { width: '100%' },
                to: { width: '0%' },
              },
              animation: `snackbarProgress ${AUTO_HIDE_DURATION}ms linear forwards`,
            }}
          />
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);

  if (!ctx) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return ctx;
};
