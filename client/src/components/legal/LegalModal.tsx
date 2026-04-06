import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, IconButton, useMediaQuery, useTheme } from '@mui/material';

import LegalContentRenderer from './LegalContentRenderer';

export type LegalType = 'termsOfService' | 'privacyPolicy' | 'accessibility';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: LegalType;
}

const LegalModal = ({ isOpen, onClose, type }: LegalModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullScreen={isMobile}
      aria-labelledby="legal-modal-title"
      aria-modal="true"
      PaperProps={{
        sx: isMobile
          ? {
              m: 0,
              height: '95dvh',
              mt: 'auto',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }
          : {
              maxWidth: 800,
              width: '100%',
              borderRadius: 3,
              maxHeight: '90vh',
            },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: { xs: 8, md: 16 },
          right: { xs: 8, md: 16 },
          zIndex: 10,
          backgroundColor: 'background.paper',
          boxShadow: isMobile ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent id="legal-modal-title" sx={{ p: { xs: 2.5, md: 4 }, pt: { xs: 5, md: 4 } }}>
        <LegalContentRenderer type={type} />
      </DialogContent>
    </Dialog>
  );
};

export default LegalModal;

