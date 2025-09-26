import { Typography } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import PlaceholderContainer from '@/components/Placeholders/PlaceholderContainer';

const NoCategories = () => (
  <PlaceholderContainer>
    <CategoryIcon sx={{ fontSize: 48, opacity: 0.6 }} />
    <Typography variant="body1">No categories yet</Typography>
    <Typography variant="body2">Add your first category to organize transactions</Typography>
  </PlaceholderContainer>
);

export default NoCategories;
