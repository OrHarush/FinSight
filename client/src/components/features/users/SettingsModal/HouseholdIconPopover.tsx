import { Grid, IconButton, Popover } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Controller, useFormContext } from 'react-hook-form';

import Column from '@/components/shared/layout/containers/Column';
import { householdIcons } from '@/constants/HouseholdIcons';
import { householdIconMap } from '@/constants/householdIconMap';

interface HouseholdIconPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const HouseholdIconPopover = ({ anchorEl, onClose }: HouseholdIconPopoverProps) => {
  const { control } = useFormContext();

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      slotProps={{
        paper: {
          sx: {
            p: 2,
            borderRadius: 2,
            width: 280,
          },
        },
      }}
    >
      <Controller
        name="icon"
        control={control}
        render={({ field }) => (
          <Column spacing={1}>
            <Grid container columns={6} spacing={1}>
              {householdIcons.map(name => {
                const IconComponent = householdIconMap[name];

                if (!IconComponent) {
                  return null;
                }

                const selected = field.value === name;

                return (
                  <Grid key={name} size={1}>
                    <IconButton
                      type="button"
                      onClick={() => {
                        field.onChange(name);
                        onClose();
                      }}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        color: selected ? 'primary.main' : 'text.secondary',
                        backgroundColor: selected
                          ? theme => alpha(theme.palette.primary.main, 0.12)
                          : 'transparent',
                        boxShadow: selected
                          ? theme => `inset 0 0 0 1px ${alpha(theme.palette.primary.main, 0.4)}`
                          : 'none',
                        '&:hover': {
                          backgroundColor: selected
                            ? theme => alpha(theme.palette.primary.main, 0.16)
                            : 'action.hover',
                        },
                      }}
                    >
                      <IconComponent fontSize="small" />
                    </IconButton>
                  </Grid>
                );
              })}
            </Grid>
          </Column>
        )}
      />
    </Popover>
  );
};

export default HouseholdIconPopover;
