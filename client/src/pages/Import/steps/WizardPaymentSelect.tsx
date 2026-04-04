import { Divider, ListSubheader, MenuItem } from '@mui/material';
import { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import TextInput from '@/components/shared/inputs/TextInput';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { PAYMENT_TYPE_GROUPS } from '@/utils/entities/paymentMethod';

interface WizardPaymentSelectProps {
  name: string;
  label: string;
}

const WizardPaymentSelect = ({ name, label }: WizardPaymentSelectProps) => {
  const { control } = useFormContext();
  const { t } = useTranslation(['transactions', 'paymentMethods']);
  const { paymentMethods } = usePaymentMethods();

  const items: ReactNode[] = [];

  PAYMENT_TYPE_GROUPS.forEach((group, groupIndex) => {
    const groupPMs = paymentMethods.filter(pm => group.types.includes(pm.type));

    if (!groupPMs.length) {
      return;
    }

    if (groupIndex > 0) {
      items.push(<Divider key={`d-${groupIndex}`} component="li" />);
    }

    items.push(
      <ListSubheader
        key={`h-${groupIndex}`}
        disableSticky
        sx={{ fontSize: '0.7rem', color: 'text.secondary', lineHeight: '1.5rem' }}
      >
        {t(group.labelKey)}
      </ListSubheader>
    );

    groupPMs.forEach(pm => {
      items.push(
        <MenuItem key={pm._id} value={pm._id}>
          {pm.name}
        </MenuItem>
      );
    });
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextInput {...field} select label={label} fullWidth required>
          {items}
        </TextInput>
      )}
    />
  );
};

export default WizardPaymentSelect;
