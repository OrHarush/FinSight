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
    <Column spacing={isMobile ? 2 : 0} width="100%">
      <Row
        alignItems="center"
        justifyContent="space-between"
        flexWrap={isMobile ? 'wrap' : 'nowrap'}
      >
        <Typography variant="h4" fontWeight={700}>
          {pageTitle}
        </Typography>
        {children}
      </Row>
    </Column>
  );
};

export default PageHeader;
