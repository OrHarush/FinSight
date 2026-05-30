import { ButtonBase, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import HouseholdIconFrame from '@/components/features/users/SettingsModal/HouseholdIconFrame';
import HouseholdIconPopover from '@/components/features/users/SettingsModal/HouseholdIconPopover';
import Column from '@/components/shared/layout/containers/Column';

const HouseholdPreview = () => {
  const { t } = useTranslation('user');
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { control } = useFormContext();

  const icon = useWatch({ control, name: 'icon' });

  const openPopover = () => {
    if (buttonRef.current) {
      setAnchorEl(buttonRef.current);
    }
  };

  return (
    <>
      <Column spacing={0.75} alignItems="center" alignSelf="center">
        <ButtonBase
          ref={buttonRef}
          onClick={openPopover}
          aria-label={t('sharedHousehold.create.changeIcon')}
          sx={{
            borderRadius: '50%',
            transition: 'transform 160ms ease',
            '&:hover': {
              transform: 'scale(1.04)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
            '&:focus-visible': {
              outline: theme => `2px solid ${theme.palette.primary.main}`,
              outlineOffset: 3,
            },
          }}
        >
          <HouseholdIconFrame icon={icon as string | undefined} size={96} shape="circle" />
        </ButtonBase>
        <Typography
          variant="caption"
          color="primary.main"
          fontWeight={600}
          onClick={openPopover}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
        >
          {t('sharedHousehold.create.changeIcon')}
        </Typography>
      </Column>
      <HouseholdIconPopover anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
    </>
  );
};

export default HouseholdPreview;
