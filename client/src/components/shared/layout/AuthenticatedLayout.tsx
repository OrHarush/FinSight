import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import Sidebar from '@/components/shared/layout/sidebar';
import { Outlet } from 'react-router-dom';
import { useOpen } from '@/hooks/useOpen';
import FeedbackDialog from '@/components/features/feedback/FeedbackDialog';
import { Fab } from '@mui/material';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import { useIsMobile } from '@/hooks/useIsMobile';

const AuthenticatedLayout = () => {
  const [isFeedbackDialogOpen, openFeedbackDialog, closeFeedbackDialog] = useOpen();
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
              right: 24,
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
