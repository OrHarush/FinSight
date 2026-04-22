import { Divider, ListSubheader, MenuItem, TextFieldProps } from '@mui/material';
import { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import TextInput from '@/components/shared/inputs/TextInput';

export interface GroupedSelectOption {
  label?: string;
  value: string | number;
  design?: ReactNode;
}

export interface SelectOptionGroup {
  groupLabel: string;
  options: GroupedSelectOption[];
}

interface RHFGroupedSelectProps extends Omit<TextFieldProps, 'name' | 'required'> {
  name: string;
  label?: string;
  groups: SelectOptionGroup[];
  required?: boolean | string;
  extraItems?: ReactNode[];
}

const RHFGroupedSelect = ({
  name,
  label,
  groups,
  required,
  extraItems,
  ...props
}: RHFGroupedSelectProps) => {
  const { control } = useFormContext();
  const { t } = useTranslation('common');

  const items: ReactNode[] = [];

  groups.forEach((group, groupIndex) => {
    if (groupIndex > 0) {
      items.push(<Divider key={`divider-${groupIndex}`} component="li" />);
    }

    if (group.groupLabel) {
      items.push(
        <ListSubheader
          key={`header-${groupIndex}`}
          disableSticky
          sx={{ fontSize: '0.7rem', color: 'text.secondary', lineHeight: '1.5rem' }}
        >
          {group.groupLabel}
        </ListSubheader>
      );
    }

    group.options.forEach(option => {
      items.push(
        <MenuItem key={option.value} value={option.value}>
          {option.design ?? option.label}
        </MenuItem>
      );
    });
  });

  if (extraItems) {
    items.push(...extraItems);
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextInput
          {...field}
          select
          label={label || ''}
          name={name}
          required={required}
          error={!!fieldState.error}
          helperText={
            fieldState.error?.message ? t(fieldState.error.message, { field: label }) : undefined
          }
          {...props}
        >
          {items}
        </TextInput>
      )}
    />
  );
};

export default RHFGroupedSelect;
