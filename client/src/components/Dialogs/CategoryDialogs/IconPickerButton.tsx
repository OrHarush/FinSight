import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, InputAdornment, InputLabel, TextField } from '@mui/material';
import * as Icons from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import IconPickerDialog from '@/components/Dialogs/IconPickerDialog';
import Column from '@/components/Layout/Containers/Column';

interface IconPickerFieldProps {
  name?: string;
  label?: string;
}

const IconPickerField = ({ name = 'icon', label = 'Icon' }: IconPickerFieldProps) => {
  const { control, setValue } = useFormContext();
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const IconComponent = (Icons as any)[field.value] ?? CategoryIcon;

          return (
            <Column spacing={0.5}>
              <InputLabel>{label}</InputLabel>
              <TextField
                value={field.value || ''}
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
                fullWidth
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
      />
    </>
  );
};

export default IconPickerField;
