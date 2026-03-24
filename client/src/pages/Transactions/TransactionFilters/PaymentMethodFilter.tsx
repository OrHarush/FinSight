import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import MultiSelectChip, {
  MultiSelectChipItem,
} from '@/components/shared/inputs/MultiSelectChip';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { PAYMENT_TYPE_GROUPS, PAYMENT_TYPE_LOCALE_KEY } from '@/utils/paymentMethodUtils';
import { getFilterChipLabel } from '@/utils/transactionUtils';

interface PaymentMethodFilterProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

const PaymentMethodFilter = ({ selectedIds, onChange }: PaymentMethodFilterProps) => {
  const { t } = useTranslation('transactions');
  const { t: tPm } = useTranslation('paymentMethods');
  const { paymentMethods } = usePaymentMethods();

  const items: MultiSelectChipItem[] = [];

  PAYMENT_TYPE_GROUPS.forEach((group, groupIndex) => {
    const groupMethods = paymentMethods.filter(pm => group.types.includes(pm.type));

    if (groupMethods.length === 0) {
      return;
    }

    if (groupIndex > 0 && items.length > 0) {
      items.push({ id: `divider-${groupIndex}`, isDivider: true });
    }

    items.push({
      id: `header-${groupIndex}`,
      subheaderLabel: tPm(group.labelKey.replace('paymentMethods:', '')),
    });

    groupMethods.forEach(pm => {
      const label = pm.name || tPm(`types.${PAYMENT_TYPE_LOCALE_KEY[pm.type]}`);

      items.push({
        id: pm._id,
        renderRow: () => <Typography variant="body2">{label}</Typography>,
      });
    });
  });

  return (
    <MultiSelectChip
      label={getFilterChipLabel(selectedIds.length, t('filters.allPaymentMethods'), t, 'filters.selectedPaymentMethods')}
      selectedIds={selectedIds}
      onChange={onChange}
      items={items}
    />
  );
};

export default PaymentMethodFilter;
