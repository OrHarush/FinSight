import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { downloadFullBackup } from '@/api/admin';

type BackupStatus = 'idle' | 'loading' | 'error';

const ERROR_REVERT_DELAY_MS = 3000;

const LABEL_KEY: Record<BackupStatus, string> = {
  idle: 'backup.button',
  loading: 'backup.loading',
  error: 'backup.error',
};

const DownloadBackupButton = () => {
  const { t } = useTranslation('admin');
  const [status, setStatus] = useState<BackupStatus>('idle');
  const revertTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(
    () => () => {
      if (revertTimer.current) {
        clearTimeout(revertTimer.current);
      }
    },
    []
  );

  const downloadBackup = async () => {
    if (status === 'loading') {
      return;
    }

    setStatus('loading');

    try {
      await downloadFullBackup();
      setStatus('idle');
    } catch {
      setStatus('error');

      if (revertTimer.current) {
        clearTimeout(revertTimer.current);
      }

      revertTimer.current = setTimeout(() => setStatus('idle'), ERROR_REVERT_DELAY_MS);
    }
  };

  const label = t(LABEL_KEY[status]);

  return (
    <Tooltip title={label}>
      <span>
        <Button
          aria-label={label}
          variant="outlined"
          color={status === 'error' ? 'error' : 'inherit'}
          size="small"
          startIcon={statusIcon(status)}
          onClick={downloadBackup}
          disabled={status === 'loading'}
        >
          {label}
        </Button>
      </span>
    </Tooltip>
  );
};

const statusIcon = (status: BackupStatus) => {
  if (status === 'loading') {
    return <CircularProgress size={14} />;
  }

  if (status === 'error') {
    return <ErrorOutlineIcon fontSize="small" />;
  }

  return <CloudDownloadIcon fontSize="small" />;
};

export default DownloadBackupButton;
