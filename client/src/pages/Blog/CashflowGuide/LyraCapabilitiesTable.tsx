import { alpha, Table, TableBody, TableCell, TableHead, TableRow, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { getCellToneColor } from '@/pages/Home/ComparisonSection/cellTone';
import { CellTone } from '@/pages/Home/ComparisonSection/types';

const BRAND_PURPLE = '#a78bfa';

interface LyraRow {
  key: string;
  tone: CellTone;
}

const ROWS: LyraRow[] = [
  { key: 'price', tone: 'positive' },
  { key: 'bank', tone: 'positive' },
  { key: 'cycle', tone: 'positive' },
  { key: 'import', tone: 'positive' },
  { key: 'privacy', tone: 'positive' },
];

const LyraCapabilitiesTable = () => {
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
        <TableRow sx={{ backgroundColor: alpha(BRAND_PURPLE, 0.07) }}>
          <TableCell sx={headerCellSx}>{t('lyraTable.columns.feature')}</TableCell>
          <TableCell align="center" sx={{ ...headerCellSx, color: BRAND_PURPLE }}>
            {t('lyraTable.columns.value')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {ROWS.map(row => (
          <TableRow key={row.key}>
            <TableCell sx={{ ...bodyCellSx, color: theme.palette.text.primary, fontWeight: 600 }}>
              {t(`lyraTable.rows.${row.key}.feature`)}
            </TableCell>
            <TableCell
              align="center"
              sx={{ ...bodyCellSx, color: getCellToneColor(row.tone, theme), fontWeight: 600 }}
            >
              {t(`lyraTable.rows.${row.key}.value`)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LyraCapabilitiesTable;
