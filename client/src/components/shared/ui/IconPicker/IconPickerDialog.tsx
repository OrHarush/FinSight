import { SvgIconComponent } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Pagination,
  TextField,
} from '@mui/material';
import { ChangeEvent,useState } from 'react';

import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import Column from '@/components/shared/layout/containers/Column';
import IconOption from '@/components/shared/ui/IconPicker/IconOption';

const iconsPerPage = 30;

interface IconPickerDialogProps extends BaseDialogProps {
  selectIcon: (iconName: string) => void;
  icons: string[];
  iconMap: Record<string, SvgIconComponent>;
}

const IconPickerDialog = ({ isOpen, closeDialog, selectIcon, icons, iconMap }: IconPickerDialogProps) => {
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
                  <IconOption
                    name={name}
                    selectIcon={selectIcon}
                    closeDialog={closeDialog}
                    iconMap={iconMap}
                  />
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
