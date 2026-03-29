import { Breakpoint, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';

interface PageHeaderProps {
  entityName?: string;
  title?: string;
  breakPoint?: Breakpoint;
  children?: ReactNode;
}

const PageHeader = ({ entityName, title, breakPoint = 'sm', children }: PageHeaderProps) => {
  const { t } = useTranslation(entityName);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(breakPoint));

  return (
    <Stack
      alignItems="center"
      justifyContent={isMobile ? 'center' : 'space-between'}
      flexWrap={isMobile ? 'wrap' : 'nowrap'}
      textAlign={isMobile ? 'center' : 'left'}
      direction={isMobile ? 'column' : 'row'}
      spacing={2}
    >
      <Typography variant={'h5'} fontWeight={700} sx={{ minWidth: 120 }}>
        {title || t('pageTitle')}
      </Typography>
      {children && (
        <Row justifyContent={isMobile ? 'center' : 'flex-end'} width={isMobile ? '100%' : 'auto'}>
          {children}
        </Row>
      )}
    </Stack>
  );
};

export default PageHeader;
