import { alpha, Table, TableBody, TableCell, TableHead, TableRow, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { getCellToneColor } from '@/pages/Home/ComparisonSection/cellTone';
import { CellTone } from '@/pages/Home/ComparisonSection/types';

const BRAND_PURPLE = '#a78bfa';

interface VsRow {
  key: string;
  lyraTone: CellTone;
  riseupTone: CellTone;
}

const ROWS: VsRow[] = [
  { key: 'price', lyraTone: 'positive', riseupTone: 'neutral' },
  { key: 'bank', lyraTone: 'positive', riseupTone: 'negative' },
  { key: 'cycle', lyraTone: 'positive', riseupTone: 'negative' },
  { key: 'entry', lyraTone: 'neutral', riseupTone: 'neutral' },
  { key: 'privacy', lyraTone: 'positive', riseupTone: 'negative' },
];

const VsComparisonTable = () => {
  const { t } = useTranslation('riseupReview');
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
          <TableCell sx={headerCellSx}>{t('vsTable.columns.feature')}</TableCell>
          <TableCell align="center" sx={{ ...headerCellSx, color: BRAND_PURPLE }}>
            Lyra
          </TableCell>
          <TableCell align="center" sx={headerCellSx}>
            RiseUp
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {ROWS.map(row => (
          <TableRow key={row.key}>
            <TableCell sx={{ ...bodyCellSx, color: theme.palette.text.primary, fontWeight: 600 }}>
              {t(`vsTable.rows.${row.key}.feature`)}
            </TableCell>
            <TableCell
              align="center"
              sx={{ ...bodyCellSx, color: getCellToneColor(row.lyraTone, theme), fontWeight: 600 }}
            >
              {t(`vsTable.rows.${row.key}.lyra`)}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                ...bodyCellSx,
                color: getCellToneColor(row.riseupTone, theme),
                fontWeight: row.riseupTone === 'neutral' ? 400 : 600,
              }}
            >
              {t(`vsTable.rows.${row.key}.riseup`)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VsComparisonTable;
