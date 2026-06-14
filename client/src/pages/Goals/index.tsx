import type { GoalStatusValue } from '@lyra/shared';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PageLayout from '@/components/shared/layout/page/PageLayout';
import { usePageHeader, usePrimaryAction } from '@/components/shared/layout/PageHeaderContext';
import { useOpen } from '@/hooks/common/useOpen';
import CreateGoalDialog from '@/pages/Goals/components/dialogs/CreateGoalDialog';
import GoalsHeader from '@/pages/Goals/GoalsHeader';
import GoalsPageContent from '@/pages/Goals/GoalsPageContent';

const Goals = () => {
  const { t } = useTranslation('goals');
  const [status, setStatus] = useState<GoalStatusValue>('active');
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();

  usePageHeader(t('page.title'));
  usePrimaryAction(openCreateDialog);

  const goBackToActive = () => setStatus('active');

  return (
    <PageLayout>
      <GoalsHeader status={status} onStatusChange={setStatus} onCreate={openCreateDialog} />
      <GoalsPageContent
        status={status}
        onCreate={openCreateDialog}
        onBackToActive={goBackToActive}
      />
      {isCreateDialogOpen && (
        <CreateGoalDialog isOpen={isCreateDialogOpen} closeDialog={closeCreateDialog} />
      )}
    </PageLayout>
  );
};

export default Goals;
