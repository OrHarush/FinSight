import Row from '@/components/Layout/Containers/Row';
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface PageHeaderProps {
  pageTitle: string;
  children?: ReactNode;
}

const PageHeader = ({ pageTitle, children }: PageHeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack
      alignItems="center"
      justifyContent={isMobile ? 'center' : 'space-between'}
      flexWrap={isMobile ? 'wrap' : 'nowrap'}
      textAlign={isMobile ? 'center' : 'left'}
      direction={isMobile ? 'column' : 'row'}
      spacing={2}
    >
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        fontWeight={700}
        sx={{ width: isMobile ? '100%' : 'auto' }}
      >
        {pageTitle}
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
