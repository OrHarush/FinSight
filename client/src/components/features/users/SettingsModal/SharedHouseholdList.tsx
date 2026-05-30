import SharedHouseholdCard from '@/components/features/users/SettingsModal/SharedHouseholdCard';
import Column from '@/components/shared/layout/containers/Column';
import { WorkspaceListItemDto } from '@/types/Workspace';

interface SharedHouseholdListProps {
  items: WorkspaceListItemDto[];
}

const SharedHouseholdList = ({ items }: SharedHouseholdListProps) => (
  <Column spacing={2}>
    {items.map(item => (
      <SharedHouseholdCard key={item.workspace._id} item={item} />
    ))}
  </Column>
);

export default SharedHouseholdList;
