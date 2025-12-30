import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, InputAdornment, InputLabel, TextField } from '@mui/material';
import * as Icons from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import IconPickerDialog from '@/components/shared/ui/IconPicker/IconPickerDialog';
import Column from '@/components/shared/layout/containers/Column';

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
            (Icons as any)[field.value] ?? (Icons as any)[defaultIcon] ?? CategoryIcon;

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
        selectIcon={(icon: string) => {
          setValue(name, icon);
          setDialogOpen(false);
        }}
        isOpen={isDialogOpen}
        closeDialog={() => setDialogOpen(false)}
        icons={icons}
      />
    </>
  );
};

export default IconPickerField;
