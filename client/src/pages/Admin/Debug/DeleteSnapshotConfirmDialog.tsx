import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface DeleteSnapshotConfirmDialogProps {
  open: boolean;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteSnapshotConfirmDialog = ({
  open,
  isPending,
  onCancel,
  onConfirm,
}: DeleteSnapshotConfirmDialogProps) => (
  <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ fontWeight: 700 }}>מחיקת snapshot</DialogTitle>
    <DialogContent>
      פעולה זו תמחק את ה-snapshot לצמיתות. לא ניתן יהיה לשחזר ממנו את ההרצה.
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onCancel} disabled={isPending}>
        ביטול
      </Button>
      <Button onClick={onConfirm} color="error" variant="contained" disabled={isPending} autoFocus>
        {isPending ? 'מוחק…' : 'מחק'}
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteSnapshotConfirmDialog;
