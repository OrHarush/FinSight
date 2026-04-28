import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { alpha, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import FrameChip from '@/pages/Home/HeroSection/DashboardPreview/FrameChip';

interface BillingCycleFrameProps {
  isPaused?: boolean;
}

interface BillingRowData {
  nameKey: string;
  subtitleKey: string;
  icon: React.ReactNode;
  day: number | null;
  highlight: boolean;
}

const BillingCycleFrame = (_: BillingCycleFrameProps = {}) => {
  const theme = useTheme();
  const { t } = useTranslation('home');

  const rows: BillingRowData[] = [
    {
      nameKey: 'landing.hero.frames.billingCycle.card1Name',
      subtitleKey: 'landing.hero.frames.billingCycle.card1Subtitle',
      icon: <CreditCardIcon aria-hidden="true" sx={{ fontSize: 18 }} />,
      day: 15,
      highlight: true,
    },
    {
      nameKey: 'landing.hero.frames.billingCycle.card2Name',
      subtitleKey: 'landing.hero.frames.billingCycle.card2Subtitle',
      icon: <CreditCardIcon aria-hidden="true" sx={{ fontSize: 18 }} />,
      day: 2,
      highlight: false,
    },
    {
      nameKey: 'landing.hero.frames.billingCycle.bankName',
      subtitleKey: 'landing.hero.frames.billingCycle.bankSubtitle',
      icon: <AccountBalanceIcon aria-hidden="true" sx={{ fontSize: 18 }} />,
      day: null,
      highlight: false,
    },
  ];

  return (
    <Column spacing={1.5} sx={{ width: '100%' }}>
      <FrameChip label={t('landing.hero.frames.billingCycle.title')} />

      <Column spacing={1}>
        {rows.map(row => (
          <Row
            key={row.nameKey}
            alignItems="center"
            sx={{
              px: 1.5,
              py: 1.25,
              borderRadius: 2.5,
              backgroundColor: alpha(theme.palette.background.default, 0.5),
              border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
              gap: 1.25,
            }}
          >
            <Column
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
                flexShrink: 0,
              }}
            >
              {row.icon}
            </Column>

            <Column spacing={0.2} sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {t(row.nameKey)}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.72rem',
                  color: 'text.secondary',
                  lineHeight: 1.2,
                }}
              >
                {t(row.subtitleKey)}
              </Typography>
            </Column>

            <Row alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
              {row.day === null ? (
                <Typography
                  aria-hidden="true"
                  sx={{
                    fontSize: '1rem',
                    color: 'text.disabled',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                  }}
                >
                  —
                </Typography>
              ) : (
                <>
                  <Column
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      minWidth: 30,
                      height: 26,
                      px: 0.75,
                      borderRadius: 1.25,
                      background: row.highlight
                        ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                        : alpha(theme.palette.text.primary, 0.08),
                      boxShadow: row.highlight
                        ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.5)}`
                        : 'none',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: row.highlight ? '#fff' : 'text.primary',
                        lineHeight: 1,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {row.day}
                    </Typography>
                  </Column>
                  <Typography
                    sx={{
                      fontSize: '0.72rem',
                      color: 'text.secondary',
                      fontWeight: 500,
                    }}
                  >
                    {t('landing.hero.frames.billingCycle.perMonth')}
                  </Typography>
                </>
              )}
            </Row>
          </Row>
        ))}
      </Column>

      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontSize: '0.78rem',
          textAlign: 'center',
          mt: 0.5,
        }}
      >
        {t('landing.hero.frames.billingCycle.caption')}
      </Typography>
    </Column>
  );
};

export default BillingCycleFrame;
