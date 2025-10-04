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
import { DialogProps } from '@/components/Dialogs/FormDialog';
import Column from '@/components/Layout/Containers/Column';
import IconOption from '@/components/Dialogs/IconPicker/IconOption';
import CloseIcon from '@mui/icons-material/Close';

const iconsPerPage = 30;

interface IconPickerDialogProps extends DialogProps {
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
          <TextField
            fullWidth
            placeholder="Search icons..."
            value={search}
            onChange={handleSearch}
            size="small"
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            {currentIcons.map(name => (
              <IconOption
                key={name}
                name={name}
                selectIcon={selectIcon}
                closeDialog={closeDialog}
              />
            ))}
          </Grid>
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
