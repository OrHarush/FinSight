import { Button, DialogContent, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import FinSightDialog from '@/components/dialogs/FinSightDialog';
import { ROUTES } from '@/constants/Routes';

interface RequireSetupDialogProps {
  isCreateDialogOpen: boolean;
  closeCreateDialog: () => void;
}

const RequireSetupDialog = ({ isCreateDialogOpen, closeCreateDialog }: RequireSetupDialogProps) => {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();

  return (
    <FinSightDialog
      title={t('setupDialog.title')}
      isOpen={isCreateDialogOpen}
      closeDialog={closeCreateDialog}
    >
      <DialogContent
        sx={{
          p: 4,
          pt: 0,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          <Trans
            ns="transactions"
            i18nKey="setupDialog.message"
            components={{
              account: (
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  sx={{ p: 0, height: '100%', minWidth: 'unset' }}
                  onClick={() => navigate(ROUTES.ACCOUNTS_URL)}
                />
              ),
              category: (
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  sx={{ p: 0, height: '100%', minWidth: 'unset' }}
                  onClick={() => navigate(ROUTES.CATEGORIES_URL)}
                />
              ),
            }}
          />
        </Typography>
      </DialogContent>
    </FinSightDialog>
  );
};

export default RequireSetupDialog;
