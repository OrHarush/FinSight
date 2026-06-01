import { alpha, Table, TableBody, TableCell, TableHead, TableRow, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { getCellToneColor } from '@/pages/Home/ComparisonSection/cellTone';
import { CellTone } from '@/pages/Home/ComparisonSection/types';

interface MethodRow {
  key: string;
  effortTone: CellTone;
  drawbackTone: CellTone;
}

const ROWS: MethodRow[] = [
  { key: 'envelopes', effortTone: 'neutral', drawbackTone: 'negative' },
  { key: '503020', effortTone: 'positive', drawbackTone: 'negative' },
  { key: 'payYourself', effortTone: 'positive', drawbackTone: 'negative' },
  { key: 'zeroBased', effortTone: 'negative', drawbackTone: 'negative' },
];

const MethodsComparisonTable = () => {
  const { t } = useTranslation('cashflowGuide');
  const theme = useTheme();

  const hairline = `1px solid ${theme.palette.divider}`;

  const headerCellSx = {
    fontWeight: 700,
    fontSize: { xs: '0.72rem', md: '0.8rem' },
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    borderBottom: hairline,
    py: { xs: 1.25, md: 1.75 },
    px: { xs: 1, md: 2 },
    color: theme.palette.text.secondary,
  };

  const bodyCellSx = {
    borderBottom: hairline,
    py: { xs: 1.25, md: 1.5 },
    px: { xs: 1, md: 2 },
    fontSize: { xs: '0.82rem', md: '0.92rem' },
  };

  return (
    <Table
      sx={{
        borderCollapse: 'separate',
        borderSpacing: 0,
        width: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.02)
            : theme.palette.background.paper,
        '& tr:last-of-type td': { borderBottom: 'none' },
      }}
    >
      <TableHead>
        <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
          <TableCell sx={headerCellSx}>{t('methodsTable.columns.method')}</TableCell>
          <TableCell align="center" sx={headerCellSx}>{t('methodsTable.columns.effort')}</TableCell>
          <TableCell sx={headerCellSx}>{t('methodsTable.columns.suitable')}</TableCell>
          <TableCell sx={headerCellSx}>{t('methodsTable.columns.drawback')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {ROWS.map(row => (
          <TableRow key={row.key}>
            <TableCell sx={{ ...bodyCellSx, color: theme.palette.text.primary, fontWeight: 600 }}>
              {t(`methodsTable.rows.${row.key}.method`)}
            </TableCell>
            <TableCell
              align="center"
              sx={{ ...bodyCellSx, color: getCellToneColor(row.effortTone, theme), fontWeight: 600 }}
            >
              {t(`methodsTable.rows.${row.key}.effort`)}
            </TableCell>
            <TableCell sx={{ ...bodyCellSx, color: theme.palette.text.secondary }}>
              {t(`methodsTable.rows.${row.key}.suitable`)}
            </TableCell>
            <TableCell
              sx={{ ...bodyCellSx, color: getCellToneColor(row.drawbackTone, theme), fontWeight: 500 }}
            >
              {t(`methodsTable.rows.${row.key}.drawback`)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MethodsComparisonTable;
