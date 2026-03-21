import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import { formatCurrency } from '@/utils/currencyUtils';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import FinSightDialog from '@/components/dialogs/FinSightDialog';
import { TransactionDto } from '@/types/Transaction';

const PREVIEW_LIMIT = 5;

interface DeleteWithReassignDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (replacementId: string | null) => void;
  itemName: string;
  itemType: 'account' | 'paymentMethod';
  itemId: string;
  replacementOptions: { id: string; label: string }[];
  isLoading: boolean;
}

type TxListData = {
  data: TransactionDto[];
  pagination?: { total: number };
};

const DeleteWithReassignDialog = ({
  open,
  onClose,
  onConfirm,
  itemName,
  itemType,
  itemId,
  replacementOptions,
  isLoading,
}: DeleteWithReassignDialogProps) => {
  const { t } = useTranslation(['paymentMethods', 'accounts', 'common']);
  const ns = itemType === 'paymentMethod' ? 'paymentMethods' : 'accounts';

  const [selectedReplacementId, setSelectedReplacementId] = useState('');

  const previewUrl = (() => {
    const params = new URLSearchParams({ limit: String(PREVIEW_LIMIT) });

    if (itemType === 'paymentMethod') {
      params.set('paymentMethodId', itemId);
    } else {
      params.set('accountId', itemId);
    }

    return `${API_ROUTES.TRANSACTIONS}?${params.toString()}`;
  })();

  const { data: txListData, isLoading: isLoadingTransactions } = useFetch<TxListData>({
    url: previewUrl,
    queryKey: ['deletePreviewTransactions', itemType, itemId],
    enabled: open && !!itemId,
  });

  const transactions = txListData?.data ?? [];
  const totalLinked = txListData?.pagination?.total ?? 0;
  const hasMore = totalLinked > PREVIEW_LIMIT;
  const hasTransactions = totalLinked > 0;

  const autoSelectedReplacement =
    replacementOptions.length === 1 ? replacementOptions[0] : undefined;

  const effectiveReplacementId = autoSelectedReplacement
    ? autoSelectedReplacement.id
    : selectedReplacementId;

  const canConfirm = !hasTransactions || !!effectiveReplacementId;

  const handleConfirm = () => {
    onConfirm(hasTransactions ? effectiveReplacementId : null);
  };

  const handleReplacementChange = (e: SelectChangeEvent) => {
    setSelectedReplacementId(e.target.value);
  };

  return (
    <FinSightDialog
      isOpen={open}
      closeDialog={onClose}
      title={t(`${ns}:deleteConfirmTitle`, { name: itemName })}
      titleIcon={WarningAmberIcon}
    >
      <DialogContent>
        <Column spacing={2}>
          <Column spacing={1}>
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              {t(`${ns}:relatedTransactions`)}
            </Typography>
            {isLoadingTransactions ? (
              <Row justifyContent="center" padding={2}>
                <CircularProgress size={24} />
              </Row>
            ) : !hasTransactions ? (
              <Typography variant="body2" color="text.secondary">
                {t(`${ns}:noRelatedTransactions`)}
              </Typography>
            ) : (
              <Column spacing={0.5}>
                {transactions.map((tx) => (
                  <Row key={tx._id} justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" noWrap sx={{ maxWidth: '60%' }}>
                      {tx.name}
                    </Typography>
                    <Row spacing={1} alignItems="center">
                      {tx.date && (
                        <Typography variant="caption" color="text.secondary">
                          {new Date(tx.date).toLocaleDateString()}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={tx.amount < 0 ? 'error.main' : 'success.main'}
                      >
                        {formatCurrency(tx.amount)}
                      </Typography>
                    </Row>
                  </Row>
                ))}
                {hasMore && (
                  <Typography variant="caption" color="text.secondary">
                    {t(`${ns}:andXMore`, { count: totalLinked - PREVIEW_LIMIT })}
                  </Typography>
                )}
              </Column>
            )}
          </Column>
          {hasTransactions && (
            <>
              <Divider />
              {autoSelectedReplacement ? (
                <Typography variant="body2" color="text.secondary">
                  {t(`${ns}:moveTransactionsTo`)}: <strong>{autoSelectedReplacement.label}</strong>
                </Typography>
              ) : (
                <FormControl fullWidth size="small">
                  <InputLabel>{t(`${ns}:moveTransactionsTo`)}</InputLabel>
                  <Select
                    value={selectedReplacementId}
                    label={t(`${ns}:moveTransactionsTo`)}
                    onChange={handleReplacementChange}
                  >
                    {replacementOptions.map((opt) => (
                      <MenuItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </>
          )}
        </Column>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          {t('common:buttons.cancel')}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={isLoading || !canConfirm}
          startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {t(`${ns}:actions.delete`)}
        </Button>
      </DialogActions>
    </FinSightDialog>
  );
};

export default DeleteWithReassignDialog;
