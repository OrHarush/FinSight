import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Pagination,
  TextField,
  IconButton,
} from '@mui/material';
import { useState, ChangeEvent } from 'react';
import Column from '@/components/shared/layout/containers/Column';
import IconOption from '@/components/shared/ui/IconPicker/IconOption';
import CloseIcon from '@mui/icons-material/Close';
import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';

const iconsPerPage = 30;

interface IconPickerDialogProps extends BaseDialogProps {
  selectIcon: (iconName: string) => void;
  icons: string[];
}

const IconPickerDialog = ({ isOpen, closeDialog, selectIcon, icons }: IconPickerDialogProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const filteredIcons = icons.filter(name => name.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filteredIcons.length / iconsPerPage);
  const currentIcons = filteredIcons.slice((page - 1) * iconsPerPage, page * iconsPerPage);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <Dialog open={isOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Select an Icon</DialogTitle>
      <IconButton
        onClick={closeDialog}
        sx={theme => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
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
            <Grid container spacing={2} alignItems={'flex-start'}>
              {currentIcons.map(name => (
                <Grid key={name} size={{ xs: 2 }}>
                  <IconOption name={name} selectIcon={selectIcon} closeDialog={closeDialog} />
                </Grid>
              ))}
            </Grid>
          </Column>
          {totalPages > 1 && (
            <Grid container justifyContent="center">
              <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} />
            </Grid>
          )}
        </Column>
      </DialogContent>
    </Dialog>
  );
};

export default IconPickerDialog;
