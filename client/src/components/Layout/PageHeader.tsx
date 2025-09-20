import Row from '@/components/Layout/Row';
import Column from '@/components/Layout/Column';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface PageHeaderProps {
  pageTitle: string;
  children?: ReactNode;
}

const PageHeader = ({ pageTitle, children }: PageHeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Column width="100%">
      <Row
        alignItems="center"
        justifyContent={isMobile ? 'center' : 'space-between'}
        flexWrap={isMobile ? 'wrap' : 'nowrap'}
        textAlign={isMobile ? 'center' : 'left'}
      >
        <Typography variant="h4" fontWeight={700} sx={{ width: isMobile ? '100%' : 'auto' }}>
          {pageTitle}
        </Typography>
        {children && (
          <Row justifyContent={isMobile ? 'center' : 'flex-end'} width={isMobile ? '100%' : 'auto'}>
            {children}
          </Row>
        )}
      </Row>
    </Column>
  );
};

export default PageHeader;
