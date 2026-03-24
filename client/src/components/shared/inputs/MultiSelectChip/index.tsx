import {
  Checkbox,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListSubheader,
  Popover,
  Typography,
  useTheme,
} from '@mui/material';
import { ReactNode, useState } from 'react';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

import { getActiveChipSx, getPopoverPaperSx } from './styles';

export interface MultiSelectChipItem {
  id: string;
  renderRow?: () => ReactNode;
  subheaderLabel?: string;
  isDivider?: boolean;
}

interface MultiSelectChipProps {
  label: string;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  items: MultiSelectChipItem[];
}

const MultiSelectChip = ({ label, selectedIds, onChange, items }: MultiSelectChipProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isActive = selectedIds.length > 0;

  const chipLabel = label;

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(s => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <>
      <Chip
        label={chipLabel}
        variant="outlined"
        onClick={handleOpen}
        sx={getActiveChipSx(isActive, theme)}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: getPopoverPaperSx(theme) }}
      >
        <List dense disablePadding sx={{ overflowY: 'auto', flex: 1 }}>
          {items.length === 0 && (
            <Column px={2} py={1.5}>
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            </Column>
          )}
          {items.map(item => {
            if (item.isDivider) {
              return <Divider key={item.id} component="li" />;
            }

            if (item.subheaderLabel) {
              return (
                <ListSubheader
                  key={item.id}
                  disableSticky
                  sx={{ fontSize: '0.7rem', color: 'text.secondary', lineHeight: '1.8rem' }}
                >
                  {item.subheaderLabel}
                </ListSubheader>
              );
            }

            return (
              <ListItemButton
                key={item.id}
                onClick={() => handleToggle(item.id)}
                sx={{ px: 1, py: 0.5, borderRadius: 1 }}
              >
                <Row spacing={1} alignItems="center">
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    size="small"
                    disableRipple
                    sx={{ p: 0.5 }}
                  />
                  {item.renderRow?.()}
                </Row>
              </ListItemButton>
            );
          })}
        </List>
      </Popover>
    </>
  );
};

export default MultiSelectChip;
