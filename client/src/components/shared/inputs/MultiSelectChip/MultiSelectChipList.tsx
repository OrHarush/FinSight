import { Checkbox, Divider, List, ListItemButton, ListSubheader, Typography } from '@mui/material';
import { ReactNode } from 'react';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

export interface MultiSelectChipItem {
  id: string;
  renderRow?: () => ReactNode;
  subheaderLabel?: string;
  isDivider?: boolean;
}

interface MultiSelectChipListProps {
  items: MultiSelectChipItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const MultiSelectChipList = ({ items, selectedIds, onToggle }: MultiSelectChipListProps) => {
  if (items.length === 0) {
    return (
      <Column px={2} py={1.5}>
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
      </Column>
    );
  }

  return (
    <List dense disablePadding sx={{ overflowY: 'auto', flex: 1 }}>
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
            onClick={() => onToggle(item.id)}
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
  );
};

export default MultiSelectChipList;
