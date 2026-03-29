import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import { Fab } from '@mui/material';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Outlet } from 'react-router-dom';

import FeedbackDialog from '@/components/features/feedback/FeedbackDialog';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import Sidebar from '@/components/shared/layout/sidebar';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useOpen } from '@/hooks/common/useOpen';

export const useCurrentBreakpoint = () => {
  const theme = useTheme();
  const xl = useMediaQuery(theme.breakpoints.up('xl'));
  const lg = useMediaQuery(theme.breakpoints.up('lg'));
  const md = useMediaQuery(theme.breakpoints.up('md'));
  const sm = useMediaQuery(theme.breakpoints.up('sm'));

  if (xl) return 'xl';
  if (lg) return 'lg';
  if (md) return 'md';
  if (sm) return 'sm';
  return 'xs';
};

const AuthenticatedLayout = () => {
  const [isFeedbackDialogOpen, openFeedbackDialog, closeFeedbackDialog] = useOpen();
  const isMobile = useIsMobile();
  const current = useCurrentBreakpoint();
  console.log(current);

  return (
    <Row height={'100dvh'} width={'100%'} overflow={'hidden'}>
      <Sidebar />
      <Column padding={'16px'} width={'100%'} minWidth={0} minHeight={0} overflow={'auto'}>
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
