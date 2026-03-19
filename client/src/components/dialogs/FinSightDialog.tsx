import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogProps,
  DialogTitle,
  Fade,
  IconButton,
  Slide,
  Typography,
} from '@mui/material';
import { ReactNode, forwardRef } from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import Row from '@/components/shared/layout/containers/Row';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { TransitionProps } from '@mui/material/transitions';

export interface BaseDialogProps {
  isOpen: boolean;
  closeDialog: () => void;
}

interface FinSightDialogProps extends BaseDialogProps, Omit<DialogProps, 'open' | 'onClose'> {
  title: string;
  titleIcon?: SvgIconComponent;
  children: ReactNode;
}

// eslint-disable-next-line react/display-name
const SlideUp = forwardRef(
  (props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) => (
    <Slide direction="up" ref={ref} {...props} />
  )
);

// eslint-disable-next-line react/display-name
const FadeTransition = forwardRef(
  (props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) => (
    <Fade ref={ref} {...props} />
  )
);

const FinSightDialog = ({
  isOpen,
  closeDialog,
  title,
  titleIcon: Icon,
  children,
  ...props
}: FinSightDialogProps) => {
  const isMobile = useIsMobile();

  return (
    <Dialog
      fullWidth
      maxWidth={'xs'}
      slots={{ transition: isMobile ? SlideUp : FadeTransition }}
      slotProps={{
        transition: { timeout: 250 },
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(1px)',
          },
        },
      }}
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
      onClick={e => e.stopPropagation()}
    >
      <DialogTitle>
        <Row spacing={1} alignItems={'flex-end'}>
          {Icon && <Icon sx={{ fontSize: 28, color: 'error.main' }} />}
          <Typography variant="h6" fontWeight={600} fontSize="1.1rem">
            {title}
          </Typography>
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
};

export default FinSightDialog;
