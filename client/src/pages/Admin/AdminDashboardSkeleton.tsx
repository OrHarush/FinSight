import { Box, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

const StatCardSkeleton = ({ label }: { label: string }) => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      borderRadius: 2,
      border: 1,
      borderColor: 'divider',
      px: 2,
      py: 1.5,
      minWidth: 0,
    }}
  >
    <Column spacing={0.25}>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 500 }}>
        {label}
      </Typography>
      <Skeleton width={40} height={30} />
      <Skeleton width={80} height={12} />
    </Column>
  </Box>
);

const BarSkeleton = ({ label }: { label: string }) => (
  <Row alignItems="center" spacing={1.5}>
    <Typography sx={{ fontSize: 13, color: 'text.secondary', minWidth: 110, flexShrink: 0 }}>
      {label}
    </Typography>
    <Skeleton sx={{ flex: 1 }} height={6} variant="rounded" />
    <Skeleton width={30} height={16} />
  </Row>
);

const AdminDashboardSkeleton = () => {
  const { t } = useTranslation('admin');
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Column spacing={3}>
      {/* Activity section */}
      <Column spacing={1}>
        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
          {t('activity.title').toUpperCase()}
        </Typography>

        {isDesktop ? (
          <Row spacing={2}>
            <Box sx={{ flex: 1 }}>
              <StatCardSkeleton label={t('activity.title')} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <StatCardSkeleton label={t('activity.wau')} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <StatCardSkeleton label={t('activity.mau')} />
            </Box>
          </Row>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {[t('activity.title'), t('activity.wau'), t('activity.mau'), t('activity.total')].map(
              label => (
                <StatCardSkeleton key={label} label={label} />
              )
            )}
          </Box>
        )}
      </Column>

      {/* Users section */}
      <Column spacing={1}>
        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
          {t('users.sectionTitle').toUpperCase()}
        </Typography>

        {isDesktop ? (
          <Row spacing={2}>
            {[
              t('users.today'),
              t('users.thisWeek'),
              t('users.thisMonth'),
              t('users.activated'),
            ].map(label => (
              <Box key={label} sx={{ flex: 1 }}>
                <StatCardSkeleton label={label} />
              </Box>
            ))}
          </Row>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {[
              t('users.today'),
              t('users.thisWeek'),
              t('users.thisMonth'),
              t('users.activated'),
            ].map(label => (
              <StatCardSkeleton key={label} label={label} />
            ))}
          </Box>
        )}
      </Column>
      {isDesktop ? (
        <Row spacing={2} sx={{ '& > *': { flex: 1 } }}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, letterSpacing: 1.5, px: 2, pt: 2, display: 'block' }}
            >
              {t('funnel.title').toUpperCase()}
            </Typography>
            <Column spacing={1.5} sx={{ p: 2 }}>
              <BarSkeleton label={t('funnel.signedUp')} />
              <BarSkeleton label={t('funnel.onboarded')} />
              <BarSkeleton label={t('funnel.firstTx')} />
              <BarSkeleton label={t('funnel.recurringSet')} />
            </Column>
          </Box>

          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, letterSpacing: 1.5, px: 2, pt: 2, display: 'block' }}
            >
              {t('adoption.title').toUpperCase()}
            </Typography>
            <Column spacing={1.5} sx={{ p: 2 }}>
              <BarSkeleton label={t('adoption.transactions')} />
              <BarSkeleton label={t('adoption.recurring')} />
              <BarSkeleton label={t('adoption.csvImport')} />
              <BarSkeleton label={t('adoption.customCategories')} />
            </Column>
          </Box>
        </Row>
      ) : (
        <Column spacing={2}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              px: 2,
              py: 1.5,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
              {t('funnel.title').toUpperCase()}
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              px: 2,
              py: 1.5,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
              {t('adoption.title').toUpperCase()}
            </Typography>
          </Box>
        </Column>
      )}
      <Box sx={{ borderTop: 1, borderColor: 'divider' }} />
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, letterSpacing: 1.5, px: 2, pt: 2, display: 'block' }}
        >
          {t('recent.title').toUpperCase()}
        </Typography>
        <Column sx={{ p: 2 }} spacing={0.5}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height={48} variant="rounded" />
          ))}
        </Column>
      </Box>
    </Column>
  );
};

export default AdminDashboardSkeleton;
