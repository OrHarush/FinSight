import EntityPlaceholderContainer from '@/components/Entities/EntityPlaceholderContainer';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button, Typography } from '@mui/material';
import { EntityName } from '@/constants/entities';

interface EntityErrorProps {
  entityName: EntityName;
  refetch: () => void;
}

const EntityError = ({ entityName, refetch }: EntityErrorProps) => {
  return (
    <EntityPlaceholderContainer>
      <ErrorOutlineIcon sx={{ fontSize: 40, color: 'error.main', opacity: 0.8 }} />
      <Typography variant="body1" color="error">
        Failed to load {entityName}
      </Typography>
      <Button variant="outlined" size="small" color="error" onClick={refetch}>
        Retry
      </Button>
    </EntityPlaceholderContainer>
  );
};

export default EntityError;
