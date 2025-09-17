import { Typography } from '@mui/material';
import Row from '@/components/Layout/Row';

const SidebarHeader = () => {
  return (
    <Row alignItems={'center'} spacing={2} padding={2}>
      <img src="../../../../assets/finsightIcon.png" alt="App Logo" width={50} height={50} />
      <Typography variant={'h5'} fontWeight={700}>
        FinSight
      </Typography>
    </Row>
  );
};

export default SidebarHeader;
