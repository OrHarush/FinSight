import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import Sidebar from '@/components/layout/Sidebar';
import { Outlet } from 'react-router-dom';
import { useOpen } from '@/hooks/useOpen';
import FeedbackDialog from '@/components/dialogs/FeedbackDialog';
import { Fab } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import { useIsMobile } from '@/hooks/useIsMobile';

const AuthenticatedLayout = () => {
  const [isFeedbackDialogOpen, openFeedbackDialog, closeFeedbackDialog] = useOpen();
  const theme = useTheme();
  const isMobile = useIsMobile();

  return (
    <Row height={'100vh'} width={'100vw'} overflow={'auto'}>
      <Sidebar />

      <Column padding={'16px'} width={'100%'}>
        {!isMobile && (
          <Fab
            color="primary"
            aria-label={'main-action'}
            onClick={openFeedbackDialog}
            sx={{
              position: 'fixed',
              bottom: 24,
              [theme.direction === 'rtl' ? 'left' : 'right']: 24,
              zIndex: 1200,
            }}
          >
            <FeedbackOutlinedIcon />
          </Fab>
        )}
        <Outlet />
        {isFeedbackDialogOpen && (
          <FeedbackDialog isOpen={isFeedbackDialogOpen} closeDialog={closeFeedbackDialog} />
        )}
      </Column>
    </Row>
  );
};

export default AuthenticatedLayout;
