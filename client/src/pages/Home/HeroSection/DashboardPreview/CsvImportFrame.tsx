import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { alpha, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import FrameChip from '@/pages/Home/HeroSection/DashboardPreview/FrameChip';

interface TxRow {
  name: string;
  amount: string;
  emoji: string;
  category: string;
}

interface CsvImportFrameProps {
  isPaused?: boolean;
}

const CsvImportFrame = (_: CsvImportFrameProps = {}) => {
  const theme = useTheme();
  const { t } = useTranslation('home');

  const transactions: TxRow[] = [
    {
      name: t('landing.hero.frames.csvImport.tx1Name'),
      amount: '₪234',
      emoji: '🍔',
      category: t('landing.hero.frames.csvImport.tx1Category'),
    },
    {
      name: t('landing.hero.frames.csvImport.tx2Name'),
      amount: '₪180',
      emoji: '🚗',
      category: t('landing.hero.frames.csvImport.tx2Category'),
    },
    {
      name: t('landing.hero.frames.csvImport.tx3Name'),
      amount: '₪55',
      emoji: '🎬',
      category: t('landing.hero.frames.csvImport.tx3Category'),
    },
  ];

  return (
    <Column spacing={1.75} sx={{ width: '100%' }}>
      <FrameChip label={t('landing.hero.frames.csvImport.title')} />

      <Row
        spacing={1.25}
        alignItems="center"
        sx={{
          px: 1.75,
          py: 1.25,
          borderRadius: 2.5,
          backgroundColor: alpha(theme.palette.background.default, 0.6),
          border: `1px solid ${alpha(theme.palette.divider, 0.18)}`,
        }}
      >
        <InsertDriveFileIcon aria-hidden="true" sx={{ fontSize: 20, color: theme.palette.success.main }} />
        <Typography
          sx={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'text.primary',
            flex: 1,
          }}
          dir="ltr"
        >
          {t('landing.hero.frames.csvImport.filename')}
        </Typography>
        <CheckCircleIcon aria-hidden="true" sx={{ fontSize: 18, color: theme.palette.success.main }} />
      </Row>

      <Typography
        variant="caption"
        sx={{
          color: theme.palette.success.main,
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      >
        {t('landing.hero.frames.csvImport.summary')}
      </Typography>

      <Column spacing={0.75}>
        {transactions.map(tx => (
          <Row
            key={tx.name}
            alignItems="center"
            sx={{
              px: 1.25,
              py: 0.85,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.default, 0.45),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              gap: 1.25,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'text.primary',
                flex: 1,
                minWidth: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {tx.name}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: 'text.secondary',
                width: 56,
                textAlign: 'end',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {tx.amount}
            </Typography>
            <Row alignItems="center" spacing={0.4} sx={{ width: 90, justifyContent: 'flex-end' }}>
              <Typography aria-hidden="true" sx={{ fontSize: '0.85rem' }}>{tx.emoji}</Typography>
              <Typography
                sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}
              >
                {tx.category}
              </Typography>
            </Row>
          </Row>
        ))}
      </Column>
    </Column>
  );
};

export default CsvImportFrame;
