import { createContext, useContext, useState, ReactNode } from 'react';
import { Alert, Snackbar } from '@mui/material';

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

  const showAlert = (msg: string, sev: AlertSeverity) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{
            width: '100%',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff',
            },
          }}
        >
          {message}
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
