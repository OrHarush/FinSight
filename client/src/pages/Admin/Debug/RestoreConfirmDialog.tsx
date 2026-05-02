import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface RestoreConfirmDialogProps {
  open: boolean;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const RestoreConfirmDialog = ({
  open,
  isPending,
  onCancel,
  onConfirm,
}: RestoreConfirmDialogProps) => (
  <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ fontWeight: 700 }}>שחזור מצב</DialogTitle>
    <DialogContent>
      פעולה זו תמחק עסקאות שנוצרו בהרצה ותחזיר יתרות וטמפלטים למצב לפני ההרצה. ההפעלה אינה הפיכה.
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onCancel} disabled={isPending}>
        ביטול
      </Button>
      <Button
        onClick={onConfirm}
        color="error"
        variant="contained"
        disabled={isPending}
        autoFocus
      >
        {isPending ? 'משחזר…' : 'שחזר'}
      </Button>
    </DialogActions>
  </Dialog>
);

export default RestoreConfirmDialog;
