import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { alpha, Chip, Collapse, Paper, Typography, useTheme } from '@mui/material';
import { useState } from 'react';

import CategoryIconFrame from '@/components/features/categories/CategoryIconFrame';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { WizardRow } from '@/pages/Import/types/importWizard';
import { CategoryDto } from '@/types/Category';

const formatDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-').map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

interface CategoryCardProps {
  category: CategoryDto;
  name: string;
  assignedRows: WizardRow[];
  isOver: boolean;
  onAssign: () => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDrop: () => void;
}

const CategoryCard = ({
  category,
  name,
  assignedRows,
  isOver,
  onAssign,
  onDragEnter,
  onDragLeave,
  onDrop,
}: CategoryCardProps) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const hasAssigned = assignedRows.length > 0;

  const handleCardClick = (e: React.MouseEvent) => {
    if (hasAssigned) {
      setExpanded(prev => !prev);
    } else {
      onAssign();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop();
  };

  return (
    <Paper
      elevation={0}
      variant="outlined"
      onClick={handleCardClick}
      onDragEnter={onDragEnter}
      onDragLeave={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onDragLeave();
        }
      }}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      sx={{
        borderRadius: 2,
        cursor: 'pointer',
        border: isOver ? `2px solid ${category.color}` : `1px solid ${theme.palette.divider}`,
        backgroundColor: isOver ? alpha(category.color, 0.08) : 'background.paper',
        transition: 'all 0.15s ease',
        '&:hover': {
          borderColor: category.color,
          backgroundColor: alpha(category.color, 0.04),
        },
      }}
    >
      <Row px={1.5} py={1} alignItems="center" spacing={1}>
        <Row spacing={1.5} alignItems="center" minWidth={0} flex={1}>
          <CategoryIconFrame color={category.color} icon={category.icon} />
          <Typography variant="body2" noWrap flex={1}>
            {name}
          </Typography>
          {hasAssigned && (
            <Chip
              label={assignedRows.length}
              size="small"
              sx={{
                bgcolor: 'transparent',
                border: `1.5px solid ${category.color}`,
                color: category.color,
                fontWeight: 700,
                minWidth: 26,
                flexShrink: 0,
                height: 22,
              }}
            />
          )}
        </Row>
        <ExpandMoreIcon
          fontSize="small"
          sx={{
            flexShrink: 0,
            opacity: hasAssigned ? 0.7 : 0.25,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            color: 'text.secondary',
          }}
        />
      </Row>

      <Collapse in={expanded && hasAssigned}>
        <Column
          px={2}
          pb={1.5}
          spacing={0.5}
          sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
        >
          {assignedRows.map((row, i) => (
            <Row key={i} justifyContent="space-between" alignItems="center" pt={i === 0 ? 1 : 0}>
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ flexShrink: 0, minWidth: 48, mr: 1 }}
              >
                {formatDate(row.date)}
              </Typography>
              <Typography variant="caption" noWrap sx={{ flex: 1, color: 'text.secondary' }}>
                {row.name || '—'}
              </Typography>
              <Typography
                variant="caption"
                sx={{ flexShrink: 0, ml: 1, color: 'error.main', fontWeight: 500 }}
              >
                {Math.abs(row.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Row>
          ))}
        </Column>
      </Collapse>
    </Paper>
  );
};

export default CategoryCard;
