import { Grid, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { PRESET_COLORS } from '../../../../../../shared/types/colors';
import { getContrastColor } from '@/utils/colorUtils';

interface ColorGridPickerProps {
  value?: string;
  onChange: (color: string) => void;
}

const ColorGridPicker = ({ value, onChange }: ColorGridPickerProps) => (
  <Grid container columns={6} spacing={1}>
    {PRESET_COLORS.map(color => {
      const selected = value === color;

      return (
        <Grid key={color} size={1}>
          <IconButton
            onClick={() => onChange(color)}
            sx={{
              width: 36,
              height: 36,
              backgroundColor: color,
              borderRadius: 1,
              border: '2px solid',
              borderColor: selected ? 'primary.main' : 'transparent',
              '&:hover': {
                backgroundColor: color,
                opacity: 0.9,
              },
            }}
          >
            {selected && (
              <CheckIcon
                sx={{
                  color: getContrastColor(color),
                  fontSize: 18,
                }}
              />
            )}
          </IconButton>
        </Grid>
      );
    })}
  </Grid>
);

export default ColorGridPicker;
