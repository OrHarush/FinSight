// components/dialogs/ReassignTransactionsDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

interface TransferDialogProps {
  open: boolean;
  onClose: () => void;
  entityType: 'account' | 'category';
  count: number;
  accountId: string;
}

const ReassignTransactionsDialog = ({ open, onClose, entityType, count }: TransferDialogProps) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Linked Transactions</DialogTitle>
    <DialogContent>
      <Typography>
        There are <b>{count}</b> transactions linked to this {entityType}.<br />
        You can transfer them to another {entityType} before deleting.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="error">
        Delete Anyway
      </Button>
      <Button onClick={onClose} color="primary" variant="contained">
        Transfer
      </Button>
    </DialogActions>
  </Dialog>
);

export default ReassignTransactionsDialog;
