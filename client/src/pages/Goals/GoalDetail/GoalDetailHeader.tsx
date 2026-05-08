import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import CategoryIconFrame from '@/components/features/categories/CategoryIconFrame';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import type { GoalDto } from '@/types/Goal';

interface GoalDetailHeaderProps {
  goal: GoalDto;
  onEdit: () => void;
  onDelete: () => void;
}

const FALLBACK_COLOR = '#9ca3af';

const GoalDetailHeader = ({ goal, onEdit, onDelete }: GoalDetailHeaderProps) => {
  const { t } = useTranslation('goals');
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const goalColor = goal.color ?? goal.category?.color ?? FALLBACK_COLOR;

  const closeMenu = () => setMenuAnchor(null);
  const openMenu = (event: React.MouseEvent<HTMLElement>) => setMenuAnchor(event.currentTarget);
  const goToGoalsList = () => navigate('/goals');

  const triggerEdit = () => {
    closeMenu();
    onEdit();
  };

  const triggerDelete = () => {
    closeMenu();
    onDelete();
  };

  return (
    <Column spacing={1.5} sx={{ mb: 1.5 }}>
      <Box>
        <Link
          component="button"
          onClick={goToGoalsList}
          underline="hover"
          sx={{ fontSize: 14 }}
        >
          <Row alignItems="center" spacing={0.5}>
            <ArrowBackIcon
              sx={{
                fontSize: 16,
                transform: theme => (theme.direction === 'rtl' ? 'rotate(180deg)' : 'none'),
              }}
            />
            <span>{t('detail.back')}</span>
          </Row>
        </Link>
      </Box>
      <Row alignItems="center" spacing={1.5}>
        <CategoryIconFrame icon={goal.icon ?? undefined} color={goalColor} />
        <Typography variant="h5" fontWeight={700} sx={{ flex: 1 }}>
          {goal.name}
        </Typography>
        <IconButton onClick={openMenu}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
          <MenuItem onClick={triggerEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('detail.menu.edit')}</ListItemText>
          </MenuItem>
          <MenuItem onClick={triggerDelete}>
            <ListItemIcon>
              <DeleteOutlineIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText sx={{ color: 'error.main' }}>{t('detail.menu.delete')}</ListItemText>
          </MenuItem>
        </Menu>
      </Row>
    </Column>
  );
};

export default GoalDetailHeader;
