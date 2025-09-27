import EntityPlaceholderContainer from '@/components/Entities/EntityPlaceholderContainer';
import { Typography } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { EntityName } from '@/constants/entities';

interface NoEntityProps {
  entityName: EntityName;
  subtitle: string;
  icon: SvgIconComponent;
}

const EntityEmpty = ({ entityName, subtitle, icon: Icon }: NoEntityProps) => {
  return (
    <EntityPlaceholderContainer>
      <Icon sx={{ fontSize: 48, opacity: 0.6 }} />
      <Typography variant="body1">No {entityName} yet</Typography>
      <Typography variant="body2">{subtitle}</Typography>
    </EntityPlaceholderContainer>
  );
};

export default EntityEmpty;
