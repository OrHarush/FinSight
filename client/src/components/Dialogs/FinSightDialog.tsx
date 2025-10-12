import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogTitle, IconButton } from '@mui/material';
import { ReactNode } from 'react';
import { DialogProps } from '@/components/Dialogs/FormDialog';

interface FinSightDialogProps extends DialogProps {
  title: string;
  children: ReactNode;
}

const FinSightDialog = ({ isOpen, closeDialog, title, children }: FinSightDialogProps) => (
  <Dialog
    open={isOpen}
    onClose={closeDialog}
    fullWidth
    sx={{
      '& .MuiDialog-paper': {
        borderRadius: '8px',
      },
    }}
  >
    <DialogTitle>{title}</DialogTitle>
    <IconButton
      onClick={closeDialog}
      sx={theme => ({
        position: 'absolute',
        right: 8,
        top: 8,
        color: theme.palette.grey[500],
      })}
    >
      <CloseIcon />
    </IconButton>
    {children}
  </Dialog>
);

export default FinSightDialog;
