import { useState } from 'react';
import { Box, IconButton, InputAdornment, InputLabel, Popover, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import Column from '@/components/Layout/Column';

interface ColorPickerFieldProps {
  name?: string;
  label?: string;
  presetColors?: string[];
}

const defaultPresetColors = [
  '#f44336',
  '#ff9800',
  '#4caf50',
  '#2196f3',
  '#9c27b0',
  '#e91e63',
  '#00bcd4',
  '#8bc34a',
  '#ffc107',
  '#3f51b5',
  '#795548',
  '#607d8b',
];

const ColorPickerField = ({
  name = 'color',
  label = 'Color',
  presetColors = defaultPresetColors,
}: ColorPickerFieldProps) => {
  const { control } = useFormContext();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Column spacing={0.5}>
          <InputLabel>{label}</InputLabel>
          <TextField
            value={field.value}
            onClick={e => setAnchorEl(e.currentTarget)}
            slotProps={{
              input: {
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: field.value,
                        border: '1px solid #ccc',
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            fullWidth
          />
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, p: 2 }}>
              {presetColors.map(color => (
                <IconButton
                  key={color}
                  onClick={() => {
                    field.onChange(color);
                    setAnchorEl(null);
                  }}
                  sx={{
                    backgroundColor: color,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: field.value === color ? '2px solid white' : '2px solid transparent',
                    '&:hover': {
                      border: '2px solid #fff',
                      backgroundColor: color,
                    },
                  }}
                />
              ))}
            </Box>
          </Popover>
        </Column>
      )}
    />
  );
};

export default ColorPickerField;
