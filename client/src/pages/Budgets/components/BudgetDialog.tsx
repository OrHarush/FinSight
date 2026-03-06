import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { CategoryDto } from '@/types/Category';
import Column from '@/components/shared/layout/containers/Column';
import { useTranslation } from 'react-i18next';

interface BudgetDialogProps {
  isOpen: boolean;
  closeDialog: () => void;
  category: CategoryDto;
  year: number;
  month: number;
  existingLimit?: number;
  onSave: (limit: number, applyToRestOfYear: boolean) => void;
}

interface BudgetFormData {
  limit: number;
  applyToRestOfYear: boolean;
}

const BudgetDialog = ({
  isOpen,
  closeDialog,
  category,
  year,
  month,
  existingLimit,
  onSave,
}: BudgetDialogProps) => {
  const { t } = useTranslation('budget');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormData>({
    defaultValues: {
      limit: existingLimit || 0,
      applyToRestOfYear: false,
    },
  });

  const onSubmit = (data: BudgetFormData) => {
    onSave(data.limit, data.applyToRestOfYear);
    handleClose();
  };

  const handleClose = () => {
    reset();
    closeDialog();
  };

  const monthName = new Date(year, month).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {existingLimit ? t('dialog.editTitle') : t('dialog.setTitle')} - {category.name}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Column spacing={2} sx={{ mt: 1 }}>
            {errors.limit && <Alert severity="error">{t('dialog.validationError')}</Alert>}

            <Controller
              name="limit"
              control={control}
              rules={{
                required: true,
                min: { value: 0.01, message: t('dialog.validationError') },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('dialog.limitLabel')}
                  type="number"
                  fullWidth
                  error={!!errors.limit}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">₪</InputAdornment>,
                    },
                  }}
                  helperText={t('dialog.limitHelper', { monthYear: monthName })}
                />
              )}
            />

            {!existingLimit && (
              <Controller
                name="applyToRestOfYear"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox checked={field.value} onChange={field.onChange} />}
                    label={t('dialog.applyToYear')}
                  />
                )}
              />
            )}
          </Column>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('dialog.cancel')}</Button>
          <Button type="submit" variant="contained" color="primary">
            {t('dialog.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BudgetDialog;
