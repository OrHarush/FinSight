import type { GoalStatusValue } from '@lyra/shared';
import { useState } from 'react';

import PageLayout from '@/components/shared/layout/page/PageLayout';
import ActionFab from '@/components/shared/ui/ActionFab';
import { useOpen } from '@/hooks/common/useOpen';
import CreateGoalDialog from '@/pages/Goals/components/dialogs/CreateGoalDialog';
import GoalsHeader from '@/pages/Goals/GoalsHeader';
import GoalsPageContent from '@/pages/Goals/GoalsPageContent';

const Goals = () => {
  const [status, setStatus] = useState<GoalStatusValue>('active');
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();

  const goBackToActive = () => setStatus('active');

  return (
    <PageLayout>
      <GoalsHeader status={status} onStatusChange={setStatus} onCreate={openCreateDialog} />
      <GoalsPageContent
        status={status}
        onCreate={openCreateDialog}
        onBackToActive={goBackToActive}
      />
      <ActionFab onClick={openCreateDialog} showBelow="sm" />
      {isCreateDialogOpen && (
        <CreateGoalDialog isOpen={isCreateDialogOpen} closeDialog={closeCreateDialog} />
      )}
    </PageLayout>
  );
};

export default Goals;
