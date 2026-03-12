import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import IconPickerDialog from '@/components/shared/ui/IconPicker/IconPickerDialog';
import { bankAccountIconMap, bankAccountIcons } from '@/constants/BankAccountIcons';

const AccountIconPicker = () => {
  const { control } = useFormContext();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  return (
    <Controller
      name="icon"
      control={control}
      render={({ field }) => {
        const IconComponent =
          (field.value && bankAccountIconMap[field.value]) || AccountBalanceIcon;

        return (
          <>
            <Box
              onClick={openDialog}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              sx={{
                position: 'relative',
                width: 64,
                height: 64,
                borderRadius: 2,
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'opacity 0.2s ease',
                opacity: isHovered ? 0.85 : 1,
              }}
            >
              <IconComponent sx={{ color: 'white', fontSize: 32 }} />
              {isHovered && (
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 2,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.35)',
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.45)' },
                  }}
                >
                  <EditIcon sx={{ fontSize: 20 }} />
                </IconButton>
              )}
            </Box>
            <IconPickerDialog
              isOpen={isDialogOpen}
              closeDialog={closeDialog}
              icons={bankAccountIcons}
              iconMap={bankAccountIconMap}
              selectIcon={icon => {
                field.onChange(icon);
                closeDialog();
              }}
            />
          </>
        );
      }}
    />
  );
};

export default AccountIconPicker;
