import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogProps, DialogTitle, IconButton, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import Row from '../layout/Containers/Row';

export interface BaseDialogProps {
  isOpen: boolean;
  closeDialog: () => void;
}

interface FinSightDialogProps extends BaseDialogProps, Omit<DialogProps, 'open' | 'onClose'> {
  title: string;
  titleIcon?: SvgIconComponent;
  children: ReactNode;
}

const FinSightDialog = ({
  isOpen,
  closeDialog,
  title,
  titleIcon: Icon,
  children,
  ...props
}: FinSightDialogProps) => (
  <Dialog
    fullWidth
    maxWidth={'xs'}
    sx={{
      '& .MuiDialog-paper': {
        borderRadius: '12px',
        paddingY: 1,
        paddingX: 1,
      },
    }}
    {...props}
    open={isOpen}
    onClose={closeDialog}
  >
    <DialogTitle>
      <Row spacing={1} alignItems={'flex-end'}>
        {Icon && (
          <Icon
            sx={{
              fontSize: 28,
              color: 'error.main',
            }}
          />
        )}
        <Typography>{title}</Typography>
      </Row>
    </DialogTitle>
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
