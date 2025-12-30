import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Link,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useAuth } from '@/providers/AuthProvider';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';

interface TermsDialogProps {
  open: boolean;
  onAccepted: () => void;
}

const TermsDialog = ({ open, onAccepted }: TermsDialogProps) => {
  const { i18n } = useTranslation();
  const { alertSuccess, alertError } = useSnackbar();
  const { logout } = useAuth();

  const { mutateAsync: acceptTerms } = useApiMutation<void, { locale: string }>({
    method: 'post',
    url: API_ROUTES.AUTH.ACCEPT_TERMS,
  });

  const handleAccept = async () => {
    try {
      await acceptTerms({ locale: i18n.language });
      alertSuccess('Terms accepted successfully');
      onAccepted();
    } catch {
      alertError('Failed to accept terms');
    }
  };

  const handleDecline = () => {
    logout();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>Terms of Use</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" mb={2}>
          By using FinSight, you agree to our{' '}
          <Link href="/terms" target="_blank">
            Terms of Use
          </Link>{' '}
          and{' '}
          <Link href="/privacy" target="_blank">
            Privacy Policy
          </Link>
          . You must accept these terms to continue using the app.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDecline} color="error">
          Decline
        </Button>
        <Button onClick={handleAccept} variant="contained" color="primary">
          I Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsDialog;
