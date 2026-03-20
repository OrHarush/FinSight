import CategoryIcon from '@mui/icons-material/Category';
import { Box, InputAdornment, InputLabel, TextField } from '@mui/material';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Column from '@/components/shared/layout/containers/Column';
import IconPickerDialog from '@/components/shared/ui/IconPicker/IconPickerDialog';
import { bankAccountIconMap } from '@/constants/BankAccountIcons';

interface IconPickerFieldProps {
  name?: string;
  label?: string;
  icons: string[];
  defaultIcon?: string;
}

const IconPickerField = ({
  name = 'icon',
  label = 'Icon',
  icons,
  defaultIcon = 'Category',
}: IconPickerFieldProps) => {
  const { control, setValue } = useFormContext();
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const IconComponent =
            (field.value && bankAccountIconMap[field.value]) ||
            bankAccountIconMap[defaultIcon] ||
            CategoryIcon;

          return (
            <Column spacing={0.5}>
              <InputLabel>{label}</InputLabel>
              <TextField
                value={field.value || defaultIcon}
                onClick={() => setDialogOpen(true)}
                slotProps={{
                  input: {
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box display="flex" alignItems="center">
                          <IconComponent fontSize="small" />
                        </Box>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Column>
          );
        }}
      />
      <IconPickerDialog
        isOpen={isDialogOpen}
        closeDialog={() => setDialogOpen(false)}
        selectIcon={(icon: string) => {
          setValue(name, icon);
          setDialogOpen(false);
        }}
        icons={icons}
        iconMap={bankAccountIconMap}
      />
    </>
  );
};

export default IconPickerField;
