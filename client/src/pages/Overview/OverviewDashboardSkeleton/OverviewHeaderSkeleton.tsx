import { Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

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
      <Row
        justifyContent={isMobile ? 'center' : 'flex-end'}
        width={isMobile ? '100%' : 'auto'}
        spacing={2}
      >
        <Skeleton variant="rounded" width={180} height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rounded" width={200} height={40} sx={{ borderRadius: 1 }} />

        {!isMobile && <Skeleton variant="rounded" width={160} height={40} sx={{ borderRadius: 1 }} />}
      </Row>
    </Stack>
  );
};

export default OverviewHeaderSkeleton;
