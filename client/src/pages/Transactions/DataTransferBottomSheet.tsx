import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import {
  Box,
  CircularProgress,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/Routes';

interface DataTransferBottomSheetProps {
  open: boolean;
  isExporting: boolean;
  canExport: boolean;
  onClose: () => void;
  onExport: () => void;
}

const DataTransferBottomSheet = ({
  open,
  isExporting,
  canExport,
  onClose,
  onExport,
}: DataTransferBottomSheetProps) => {
  const { t } = useTranslation('transactions');
  const theme = useTheme();
  const navigate = useNavigate();

  const navigateToImport = () => {
    onClose();
    navigate(ROUTES.IMPORT_URL);
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          pb: 2,
        },
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 4,
          bgcolor: theme.palette.divider,
          borderRadius: 2,
          mx: 'auto',
          mt: 1.5,
          mb: 2,
        }}
      />
      <Typography variant="subtitle2" fontWeight={600} px={2} pb={1}>
        {t('dataTransfer.title')}
      </Typography>
      <List disablePadding>
        <ListItemButton onClick={navigateToImport} sx={{ px: 2, py: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <UploadIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('dataTransfer.import')}
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </ListItemButton>
        <ListItemButton
          onClick={onExport}
          disabled={isExporting || !canExport}
          sx={{ px: 2, py: 1.5 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {isExporting ? <CircularProgress size={20} /> : <DownloadIcon />}
          </ListItemIcon>
          <ListItemText
            primary={t('dataTransfer.export')}
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default DataTransferBottomSheet;
