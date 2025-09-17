import { Dialog, DialogTitle, DialogContent, Grid, IconButton, Pagination } from '@mui/material';
import { useState } from 'react';
import * as Icons from '@mui/icons-material';
import { DialogProps } from '@/components/Dialogs/FormDialog';
import { SvgIconComponent } from '@mui/icons-material';

const iconsPerPage = 30; // how many per page

interface IconPickerDialogProps extends DialogProps {
  selectIcon: (iconName: string) => void;
}

const IconPickerDialog = ({ isOpen, closeDialog, selectIcon }: IconPickerDialogProps) => {
  const [page, setPage] = useState(1);

  const iconNames = Object.keys(Icons).filter(
    name =>
      !name.endsWith('Outlined') &&
      !name.endsWith('TwoTone') &&
      !name.endsWith('Rounded') &&
      !name.endsWith('Sharp')
  );
  const totalPages = Math.ceil(iconNames.length / iconsPerPage);

  const currentIcons = iconNames.slice((page - 1) * iconsPerPage, page * iconsPerPage);

  return (
    <Dialog open={isOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Select an Icon</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ bgcolor: 'gray' }}>
          {currentIcons.map(name => {
            const IconComponent = (Icons as Record<string, SvgIconComponent>)[name];

            return (
              <Grid size={{ xs: 2 }} key={name}>
                <IconButton
                  onClick={() => {
                    selectIcon(name);
                    closeDialog();
                  }}
                >
                  <IconComponent fontSize={'large'} />
                </IconButton>
              </Grid>
            );
          })}
        </Grid>
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} />
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default IconPickerDialog;
