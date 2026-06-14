import { Badge, ButtonBase, Typography } from '@mui/material';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import { BottomNavItemConfig } from '@/components/shared/layout/BottomNav/bottomNavConfig';
import {
  getItemButtonStyle,
  getItemContentStyle,
  getItemIconStyle,
  getItemLabelStyle,
} from '@/components/shared/layout/BottomNav/styles';
import Column from '@/components/shared/layout/containers/Column';

interface BottomNavItemProps {
  item: BottomNavItemConfig;
  isActive: boolean;
  onClick: () => void;
  badgeContent?: number;
}

const BottomNavItem = forwardRef<HTMLButtonElement, BottomNavItemProps>(
  ({ item, isActive, onClick, badgeContent = 0 }, ref) => {
    const { t } = useTranslation('sidebar');
    const Icon = item.icon;
    const label = t(item.titleKey);

    return (
      <ButtonBase
        ref={ref}
        onClick={onClick}
        sx={getItemButtonStyle()}
        aria-label={label}
        aria-current={isActive ? 'page' : undefined}
      >
        <Column sx={getItemContentStyle()}>
          <Badge badgeContent={badgeContent} color="primary" max={99} overlap="circular">
            <Icon sx={getItemIconStyle(isActive)} />
          </Badge>
          <Typography sx={getItemLabelStyle(isActive)}>{label}</Typography>
        </Column>
      </ButtonBase>
    );
  }
);

BottomNavItem.displayName = 'BottomNavItem';

export default BottomNavItem;
