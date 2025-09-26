import { Typography, useMediaQuery, useTheme } from '@mui/material';
import Row from '@/components/Layout/Containers/Row';

const SidebarHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Row
      alignItems={'center'}
      spacing={isMobile ? 1 : 2}
      padding={2}
      marginLeft={isMobile ? '32px' : 0}
    >
      <img src="../../../../assets/finsightIcon.png" alt="App Logo" width={50} height={50} />
      <Typography variant={'h5'} fontWeight={700}>
        FinSight
      </Typography>
    </Row>
  );
};

export default SidebarHeader;
