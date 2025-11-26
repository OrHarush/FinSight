import { useState, useEffect, useRef } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import Row from '@/components/layout/Containers/Row';
import Column from '@/components/layout/Containers/Column';

interface ConsoleLog {
  id: number;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: string;
}

// Capture logs before component mounts
const capturedLogs: ConsoleLog[] = [];
let logId = 0;

const addLogToBuffer = (type: ConsoleLog['type'], args: any[]) => {
  const message = args
    .map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    })
    .join(' ');

  capturedLogs.push({
    id: logId++,
    type,
    message,
    timestamp: new Date().toLocaleTimeString(),
  });
};

// Override console methods immediately
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;
const originalInfo = console.info;

console.log = (...args: any[]) => {
  originalLog(...args);
  addLogToBuffer('log', args);
};

console.error = (...args: any[]) => {
  originalError(...args);
  addLogToBuffer('error', args);
};

console.warn = (...args: any[]) => {
  originalWarn(...args);
  addLogToBuffer('warn', args);
};

console.info = (...args: any[]) => {
  originalInfo(...args);
  addLogToBuffer('info', args);
};

const MobileConsole = () => {
  const [logs, setLogs] = useState<ConsoleLog[]>(capturedLogs);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const addLog = (type: ConsoleLog['type'], args: any[]) => {
      const message = args
        .map(arg => {
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg, null, 2);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        })
        .join(' ');

      const newLog: ConsoleLog = {
        id: logId++,
        type,
        message,
        timestamp: new Date().toLocaleTimeString(),
      };

      setLogs(prev => [...prev, newLog]);
      capturedLogs.push(newLog);
    };

    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    console.log = (...args: any[]) => {
      originalLog(...args);
      addLog('log', args);
    };

    console.error = (...args: any[]) => {
      originalError(...args);
      addLog('error', args);
    };

    console.warn = (...args: any[]) => {
      originalWarn(...args);
      addLog('warn', args);
    };

    console.info = (...args: any[]) => {
      originalInfo(...args);
      addLog('info', args);
    };

    window.addEventListener('error', event => {
      addLog('error', [`${event.message} at ${event.filename}:${event.lineno}:${event.colno}`]);
    });

    window.addEventListener('unhandledrejection', event => {
      addLog('error', [`Unhandled Promise Rejection: ${event.reason}`]);
    });

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
    };
  }, []);

  useEffect(() => {
    if (containerRef.current && isOpen) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  const errorCount = logs.filter(l => l.type === 'error').length;
  const warnCount = logs.filter(l => l.type === 'warn').length;

  const getTypeColor = (type: ConsoleLog['type']): 'error' | 'warning' | 'info' | 'default' => {
    switch (type) {
      case 'error':
        return 'error';
      case 'warn':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  const clearLogs = () => {
    setLogs([]);
    capturedLogs.length = 0;
  };

  return (
    <>
      <Fab
        color={errorCount > 0 ? 'error' : warnCount > 0 ? 'warning' : 'primary'}
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9998,
        }}
      >
        <BugReportIcon />
        {(errorCount > 0 || warnCount > 0) && (
          <Chip
            label={errorCount + warnCount}
            color={errorCount > 0 ? 'error' : 'warning'}
            size="small"
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              height: 24,
              minWidth: 24,
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}
          />
        )}
      </Fab>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh',
            maxHeight: '80vh',
          },
        }}
      >
        <DialogTitle>
          <Row spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Row spacing={1} sx={{ alignItems: 'center' }}>
              <Typography variant="h6">Console Logs ({logs.length})</Typography>
              {errorCount > 0 && <Chip label={`${errorCount} errors`} color="error" size="small" />}
            </Row>
            <Row spacing={1}>
              <IconButton onClick={clearLogs} size="small">
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => setIsOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Row>
          </Row>
        </DialogTitle>

        <DialogContent
          ref={containerRef}
          sx={{
            bgcolor: 'grey.50',
            p: 2,
          }}
        >
          {logs.length === 0 ? (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                py: 4,
              }}
            >
              No logs yet. Console output will appear here.
            </Typography>
          ) : (
            <Column spacing={1.5}>
              {logs.map(log => (
                <Column
                  key={log.id}
                  spacing={1}
                  sx={{
                    p: 1.5,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Row spacing={1} sx={{ alignItems: 'center' }}>
                    <Chip
                      label={log.type.toUpperCase()}
                      color={getTypeColor(log.type)}
                      size="small"
                      sx={{ height: 20, fontSize: '0.7rem', fontWeight: 'bold' }}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {log.timestamp}
                    </Typography>
                  </Row>
                  <Typography
                    component="pre"
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      m: 0,
                    }}
                  >
                    {log.message}
                  </Typography>
                </Column>
              ))}
            </Column>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileConsole;
