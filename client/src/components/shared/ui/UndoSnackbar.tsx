import { Box, Button, keyframes, Paper, Snackbar, Typography } from '@mui/material';

import Row from '@/components/shared/layout/containers/Row';

const depleteProgress = keyframes`
  from { width: 100%; }
  to { width: 0%; }
`;

interface UndoSnackbarProps {
  open: boolean;
  message: string;
  undoLabel: string;
  duration?: number;
  onUndo: () => void;
  onExpire: () => void;
}

const UndoSnackbar = ({
  open,
  message,
  undoLabel,
  duration = 5000,
  onUndo,
  onExpire,
}: UndoSnackbarProps) => (
  <Snackbar
    open={open}
    autoHideDuration={null}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Paper
      elevation={6}
      sx={{
        minWidth: 300,
        overflow: 'hidden',
        borderRadius: 2,
      }}
    >
      <Row
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 1.5 }}
      >
        <Typography variant="body2" color="text.primary">
          {message}
        </Typography>
        <Button
          variant="text"
          color="primary"
          size="small"
          onClick={onUndo}
          sx={{ fontWeight: 700, minWidth: 'auto', ml: 2 }}
        >
          {undoLabel}
        </Button>
      </Row>
      {open && (
        <Box
          key={Date.now()}
          onAnimationEnd={onExpire}
          sx={{
            height: 3,
            bgcolor: 'primary.main',
            animation: `${depleteProgress} ${duration}ms linear forwards`,
          }}
        />
      )}
    </Paper>
  </Snackbar>
);

export default UndoSnackbar;
