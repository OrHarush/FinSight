import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
  Pagination,
  TextField,
  Tooltip,
} from '@mui/material';
import { useState, ChangeEvent } from 'react';
import * as Icons from '@mui/icons-material';
import { DialogProps } from '@/components/Dialogs/FormDialog';
import { SvgIconComponent } from '@mui/icons-material';
import { curatedIcons } from '@/constants/curatedIcons';
import Column from '@/components/Layout/Containers/Column';

const iconsPerPage = 30;

interface IconPickerDialogProps extends DialogProps {
  selectIcon: (iconName: string) => void;
}

const IconPickerDialog = ({ isOpen, closeDialog, selectIcon }: IconPickerDialogProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const filteredIcons = curatedIcons.filter(name =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredIcons.length / iconsPerPage);
  const currentIcons = filteredIcons.slice((page - 1) * iconsPerPage, page * iconsPerPage);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <Dialog open={isOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Select an Icon</DialogTitle>
      <DialogContent sx={{ height: '480px' }}>
        <Column height="100%" justifyContent={'space-between'}>
          <Column>
            <TextField
              fullWidth
              placeholder="Search icons..."
              value={search}
              onChange={handleSearch}
              size="small"
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2}>
              {currentIcons.map(name => {
                const IconComponent = (Icons as Record<string, SvgIconComponent>)[name];
                if (!IconComponent) return null; // safeguard

                return (
                  <Grid key={name} size={{ xs: 2 }}>
                    <Tooltip title={name}>
                      <IconButton
                        onClick={() => {
                          selectIcon(name);
                          closeDialog();
                        }}
                      >
                        <IconComponent fontSize="large" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          </Column>

          {totalPages > 1 && (
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} />
            </Grid>
          )}
        </Column>
      </DialogContent>
    </Dialog>
  );
};

export default IconPickerDialog;
