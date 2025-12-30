import * as Icons from '@mui/icons-material';
import { SvgIconComponent } from '@mui/icons-material';
import { Grid, IconButton, Tooltip } from '@mui/material';

interface IconOptionProps {
  name: string;
  selectIcon: (iconName: string) => void;
  closeDialog: () => void;
}

const IconOption = ({ name, selectIcon, closeDialog }: IconOptionProps) => {
  const IconComponent = (Icons as Record<string, SvgIconComponent>)[name];

  if (!IconComponent) {
    return null;
  }

  return (
    <Grid key={name} size={{ xs: 2 }}>
      <Tooltip title={name}>
        <IconButton
          onClick={() => {
            selectIcon(name);
            closeDialog();
          }}
        >
          <IconComponent fontSize="large" />
        </IconButton>
      </Tooltip>
    </Grid>
  );
};

export default IconOption;
