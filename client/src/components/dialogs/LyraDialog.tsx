import { SvgIconComponent } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogProps,
  DialogTitle,
  Drawer,
  Fade,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, ReactNode } from 'react';

import Row from '@/components/shared/layout/containers/Row';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';

export interface BaseDialogProps {
  isOpen: boolean;
  closeDialog: () => void;
}

interface LyraDialogProps extends BaseDialogProps, Omit<DialogProps, 'open' | 'onClose'> {
  title: string;
  titleIcon?: SvgIconComponent;
  children: ReactNode;
  forceDialog?: boolean;
}

// eslint-disable-next-line react/display-name
const FadeTransition = forwardRef(
  (props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) => (
    <Fade ref={ref} {...props} />
  )
);

const LyraDialog = ({
  isOpen,
  closeDialog,
  title,
  titleIcon: Icon,
  children,
  forceDialog = false,
  ...props
}: LyraDialogProps) => {
  const isSmallScreen = useIsSmallScreen();
  const theme = useTheme();

  if (isSmallScreen && !forceDialog) {
    return (
      <Drawer
        anchor="bottom"
        open={isOpen}
        onClose={closeDialog}
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              pb: 3,
              px: 2,
              maxHeight: '92vh',
              overflowY: 'auto',
              '& .MuiDialogActions-root': {
                width: '100%',
                paddingTop: 1.5,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
              },
              '& .MuiDialogActions-root > .MuiStack-root': {
                width: '100%',
                margin: 0,
                paddingLeft: 0,
                paddingRight: 0,
                paddingBottom: 0,
              },
              '& .MuiDialogActions-root .MuiButton-root': {
                flex: 1,
                minWidth: 0,
                paddingTop: 1.25,
                paddingBottom: 1.25,
              },
              '& .MuiDialogActions-root .MuiButton-containedPrimary, & .MuiDialogActions-root .MuiButton-containedError, & .MuiDialogActions-root .MuiButton-containedSecondary': {
                flex: 2,
              },
            },
          },
        }}
        sx={{ zIndex: theme.zIndex.modal }}
        onClick={e => e.stopPropagation()}
      >
        <Box
          sx={{
            width: 36,
            height: 4,
            bgcolor: 'divider',
            borderRadius: 2,
            mx: 'auto',
            mt: 1.5,
            mb: 2,
          }}
        />
        {children}
      </Drawer>
    );
  }

  return (
    <Dialog
      fullWidth
      maxWidth={'xs'}
      slots={{ transition: FadeTransition }}
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
      <DialogTitle sx={{ p: 1 }}>
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

export default LyraDialog;
