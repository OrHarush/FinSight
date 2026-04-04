import { alpha, Card, Chip, Typography, useTheme } from '@mui/material';

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

interface MobileTransactionCardProps {
  row: WizardRow;
  categories: CategoryDto[];
  onChipClick: () => void;
}

const MobileTransactionCard = ({ row, categories, onChipClick }: MobileTransactionCardProps) => {
  const theme = useTheme();
  const category = categories.find(c => c._id === row.categoryId);

  return (
    <Card
      variant="outlined"
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 2,
        bgcolor: category ? alpha(category.color, 0.04) : 'background.paper',
        borderColor: category ? alpha(category.color, 0.3) : theme.palette.divider,
      }}
    >
      <Row justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Column spacing={0.5} minWidth={0} flex={1}>
          <Typography variant="body2" noWrap fontWeight={500}>
            {row.name || '—'}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {formatDate(row.date)}
          </Typography>
        </Column>
        <Column alignItems="flex-end" spacing={0.75} flexShrink={0}>
          <Typography variant="body2" fontWeight={600} color="error.main">
            {Math.abs(row.amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
          <Chip
            label={category ? category.name : '+ קטגוריה'}
            size="small"
            onClick={onChipClick}
            sx={
              category
                ? {
                    bgcolor: 'transparent',
                    border: `1.5px solid ${category.color}`,
                    color: category.color,
                    fontSize: '0.7rem',
                    height: 22,
                    cursor: 'pointer',
                  }
                : {
                    bgcolor: 'transparent',
                    border: `1.5px dashed ${theme.palette.text.disabled}`,
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                    height: 22,
                    cursor: 'pointer',
                  }
            }
          />
        </Column>
      </Row>
    </Card>
  );
};

export default MobileTransactionCard;
