import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';
import Row from '@/components/shared/layout/containers/Row';
import { useIsMobile } from '@/hooks/common/useIsMobile';

const OverviewHeaderSkeleton = () => {
  const { t } = useTranslation('overview');
  const isMobile = useIsMobile();

  return (
    <Stack
      alignItems="center"
      justifyContent={isMobile ? 'center' : 'space-between'}
      flexWrap={isMobile ? 'wrap' : 'nowrap'}
      textAlign={isMobile ? 'center' : 'left'}
      direction={isMobile ? 'column' : 'row'}
      spacing={2}
    >
      <Typography variant="h5" fontWeight={700} sx={{ width: isMobile ? '100%' : 'auto' }}>
        {t('pageTitle')}
      </Typography>
      <ResponsiveRow
        justifyContent={isMobile ? 'center' : 'flex-end'}
        width={isMobile ? '100%' : 'auto'}
        spacing={2}
      >
        {isMobile ? (
          <Row width="220px" alignItems="center" justifyContent="space-between" dir={'ltr'}>
            <IconButton disabled size="small" color="primary">
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <Skeleton variant="rounded" width={120} height={30} sx={{ borderRadius: 1 }} />
            <IconButton disabled size="small" color="primary">
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Row>
        ) : (
          <Skeleton variant="rounded" width={200} height={40} sx={{ borderRadius: 1 }} />
        )}
        <Skeleton variant="rounded" width={185} height={40} sx={{ borderRadius: 1 }} />
        {!isMobile && (
          <Skeleton variant="rounded" width={180} height={40} sx={{ borderRadius: 1 }} />
        )}
      </ResponsiveRow>
    </Stack>
  );
};

export default OverviewHeaderSkeleton;
