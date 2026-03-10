import { Chip } from '@mui/material';

interface ModelBadgeProps {
  model?: string;
}

const ModelBadge = ({ model }: ModelBadgeProps) => {
  if (!model) {
    return null;
  }

  return (
    <Chip
      label={model}
      size="small"
      variant="outlined"
      sx={{
        height: 20,
        fontSize: '0.7rem',
      }}
    />
  );
};

export default ModelBadge;
