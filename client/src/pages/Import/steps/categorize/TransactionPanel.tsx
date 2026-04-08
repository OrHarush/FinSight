import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Box,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import CategorizeTabBar from '@/pages/Import/steps/categorize/CategorizeTabBar';
import TransactionRow from '@/pages/Import/steps/categorize/TransactionRow';
import { WizardRow } from '@/pages/Import/types/importWizard';
import { CategoryDto } from '@/types/Category';

interface TransactionPanelProps {
  rows: WizardRow[];
  categories: CategoryDto[];
  activeTab?: 'expense' | 'income';
  onTabChange?: (tab: 'expense' | 'income') => void;
  hasRefunds?: boolean;
  draggingIndices: number[];
  onToggleSelected: (index: number) => void;
  onToggleAll: () => void;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  onRenameRow: (index: number, name: string) => void;
  onDeleteSelected: (indices: number[]) => void;
}

const SectionHeader = ({ label }: { label: string }) => {
  const theme = useTheme();

  return (
    <TableRow sx={{ pointerEvents: 'none' }}>
      <TableCell
        colSpan={6}
        sx={{
          py: 0.75,
          px: 1.5,
          bgcolor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
          borderTop: `1px solid ${theme.palette.divider}`,
          position: 'sticky',
          top: 33,
          zIndex: 1,
        }}
      >
        <Typography
          variant="caption"
          fontWeight={600}
          color="text.secondary"
          sx={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}
        >
          {label}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

const TransactionPanel = ({
  rows,
  categories,
  activeTab,
  onTabChange,
  hasRefunds,
  draggingIndices,
  onToggleSelected,
  onToggleAll,
  onDragStart,
  onDragEnd,
  onRenameRow,
  onDeleteSelected,
}: TransactionPanelProps) => {
  const { t } = useTranslation('transactions');

  const tabFilter = (row: WizardRow) => {
    if (activeTab === 'income') {
      return row.amount < 0;
    }

    if (activeTab === 'expense') {
      return row.amount >= 0;
    }

    return true;
  };

  const uncategorized = rows
    .map((r, i) => ({ row: r, index: i }))
    .filter(({ row }) => row.categoryId === null && tabFilter(row));

  const categorized = rows
    .map((r, i) => ({ row: r, index: i }))
    .filter(({ row }) => row.categoryId !== null && tabFilter(row));

  const allSelected = rows.length > 0 && rows.every(r => r.selected);
  const someSelected = rows.some(r => r.selected);
  const selectedIndices = rows.map((r, i) => (r.selected ? i : -1)).filter(i => i >= 0);

  return (
    <Paper
      variant="outlined"
      sx={{ width: 600, flexShrink: 0, borderRadius: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {rows.length === 0 ? (
        <Column alignItems="center" justifyContent="center" height="100%" p={4}>
          <Typography variant="body2" color="text.secondary">
            {t('importWizard.categorize.empty')}
          </Typography>
        </Column>
      ) : (
        <>
          {hasRefunds && activeTab && onTabChange && (
            <Box sx={{ flexShrink: 0, borderBottom: '1px solid', borderColor: 'divider' }}>
              <CategorizeTabBar value={activeTab} onChange={onTabChange} centered />
            </Box>
          )}
          <ScrollableColumn flex={1}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ width: 36 }}>
                    <Checkbox
                      size="small"
                      checked={allSelected}
                      indeterminate={someSelected && !allSelected}
                      onChange={onToggleAll}
                    />
                  </TableCell>
                  {someSelected ? (
                    <TableCell colSpan={5} sx={{ p: 0 }}>
                      <Row alignItems="center" spacing={1} sx={{ pl: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('importWizard.categorize.selectedCount', { count: selectedIndices.length })}
                        </Typography>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteOutlineIcon fontSize="small" />}
                          onClick={() => onDeleteSelected(selectedIndices)}
                        >
                          {t('importWizard.categorize.deleteSelected')}
                        </Button>
                      </Row>
                    </TableCell>
                  ) : (
                    <>
                      <TableCell sx={{ width: 24, p: 0, pl: 0.5 }}>
                        <Tooltip title={t('importWizard.categorize.dragInfo')} placement="top" arrow>
                          <InfoOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled', display: 'block' }} />
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', width: 72 }}>
                        {t('importWizard.upload.col.date')}
                      </TableCell>
                      <TableCell>{t('importWizard.upload.col.name')}</TableCell>
                      <TableCell style={{ textAlign: 'right' }} sx={{ whiteSpace: 'nowrap' }}>
                        {t('importWizard.upload.col.amount')}
                      </TableCell>
                      <TableCell sx={{ width: 110 }}>{t('fields.category')}</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {uncategorized.length > 0 && (
                  <>
                    <SectionHeader label={t('importWizard.categorize.uncategorized')} />
                    {uncategorized.map(({ row, index }) => (
                      <TransactionRow
                        key={index}
                        row={row}
                        categories={categories}
                        isDragging={draggingIndices.includes(index)}
                        onToggleSelected={() => onToggleSelected(index)}
                        onDragStart={() => onDragStart(index)}
                        onDragEnd={onDragEnd}
                        onRenameRow={(name: string) => onRenameRow(index, name)}
                      />
                    ))}
                  </>
                )}
                {categorized.length > 0 && (
                  <>
                    <SectionHeader label={t('importWizard.categorize.categorized')} />
                    {categorized.map(({ row, index }) => (
                      <TransactionRow
                        key={index}
                        row={row}
                        categories={categories}
                        isDragging={draggingIndices.includes(index)}
                        onToggleSelected={() => onToggleSelected(index)}
                        onDragStart={() => onDragStart(index)}
                        onDragEnd={onDragEnd}
                        onRenameRow={(name: string) => onRenameRow(index, name)}
                      />
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </ScrollableColumn>
        </>
      )}
    </Paper>
  );
};

export default TransactionPanel;
