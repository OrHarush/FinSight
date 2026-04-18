import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { getCellToneColor } from '@/pages/Home/ComparisonSection/cellTone';
import { ComparisonRowData } from '@/pages/Home/ComparisonSection/types';

const BRAND_PURPLE = '#a78bfa';

const buildRows = (t: (k: string) => string): ComparisonRowData[] => [
  {
    feature: t('landing.comparison.rows.price.label'),
    lyra: { value: t('landing.comparison.rows.price.lyra'), tone: 'positive' },
    riseup: { value: t('landing.comparison.rows.price.riseup'), tone: 'neutral' },
    excel: { value: t('landing.comparison.rows.price.excel'), tone: 'positive' },
  },
  {
    feature: t('landing.comparison.rows.billingCycles.label'),
    lyra: { value: t('landing.comparison.rows.billingCycles.lyra'), tone: 'positive' },
    riseup: { value: t('landing.comparison.rows.billingCycles.riseup'), tone: 'negative' },
    excel: { value: t('landing.comparison.rows.billingCycles.excel'), tone: 'neutral' },
  },
  {
    feature: t('landing.comparison.rows.noBank.label'),
    lyra: { value: t('landing.comparison.rows.noBank.lyra'), tone: 'positive' },
    riseup: { value: t('landing.comparison.rows.noBank.riseup'), tone: 'negative' },
    excel: { value: t('landing.comparison.rows.noBank.excel'), tone: 'positive' },
  },
  {
    feature: t('landing.comparison.rows.dashboard.label'),
    lyra: { value: t('landing.comparison.rows.dashboard.lyra'), tone: 'positive' },
    riseup: { value: t('landing.comparison.rows.dashboard.riseup'), tone: 'positive' },
    excel: { value: t('landing.comparison.rows.dashboard.excel'), tone: 'negative' },
  },
  {
    feature: t('landing.comparison.rows.rtl.label'),
    lyra: { value: t('landing.comparison.rows.rtl.lyra'), tone: 'positive' },
    riseup: { value: t('landing.comparison.rows.rtl.riseup'), tone: 'positive' },
    excel: { value: t('landing.comparison.rows.rtl.excel'), tone: 'negative' },
  },
];

const ComparisonTable = () => {
  const { t } = useTranslation('home');
  const theme = useTheme();
  const rows = buildRows(t);

  const hairline = `1px solid ${alpha(theme.palette.common.white, 0.06)}`;

  const headerCellSx = {
    fontWeight: 700,
    fontSize: { xs: '0.75rem', md: '0.82rem' },
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    borderBottom: hairline,
    py: { xs: 1.5, md: 2 },
    px: { xs: 1.25, md: 2.5 },
    color: theme.palette.text.secondary,
  };

  const bodyCellSx = {
    borderBottom: hairline,
    py: { xs: 1.5, md: 1.75 },
    px: { xs: 1.25, md: 2.5 },
    fontSize: { xs: '0.85rem', md: '0.95rem' },
  };

  return (
    <Table
      sx={{
        borderCollapse: 'separate',
        borderSpacing: 0,
        width: '100%',
        maxWidth: 900,
        mx: 'auto',
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
        backgroundColor: alpha('#ffffff', 0.02),
        '& tr:last-of-type td': { borderBottom: 'none' },
      }}
    >
      <TableHead>
        <TableRow sx={{ backgroundColor: alpha(BRAND_PURPLE, 0.07) }}>
          <TableCell sx={headerCellSx}>{t('landing.comparison.columns.feature')}</TableCell>
          <TableCell
            align="center"
            sx={{
              ...headerCellSx,
              color: BRAND_PURPLE,
            }}
          >
            Lyra
          </TableCell>
          <TableCell align="center" sx={headerCellSx}>
            {t('landing.comparison.columns.riseup')}
          </TableCell>
          <TableCell align="center" sx={headerCellSx}>
            {t('landing.comparison.columns.excel')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.feature}>
            <TableCell sx={{ ...bodyCellSx, color: theme.palette.text.primary, fontWeight: 600 }}>
              {row.feature}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                ...bodyCellSx,
                color: getCellToneColor(row.lyra.tone, theme),
                fontWeight: 600,
              }}
            >
              {row.lyra.value}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                ...bodyCellSx,
                color: getCellToneColor(row.riseup.tone, theme),
                fontWeight: row.riseup.tone === 'neutral' ? 400 : 600,
              }}
            >
              {row.riseup.value}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                ...bodyCellSx,
                color: getCellToneColor(row.excel.tone, theme),
                fontWeight: row.excel.tone === 'neutral' ? 400 : 600,
              }}
            >
              <Typography component="span" sx={{ fontSize: 'inherit', color: 'inherit' }}>
                {row.excel.value}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ComparisonTable;
