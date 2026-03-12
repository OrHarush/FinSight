import { SvgIconComponent } from '@mui/icons-material';
import { Grid, IconButton, Tooltip } from '@mui/material';

interface IconOptionProps {
  name: string;
  selectIcon: (iconName: string) => void;
  closeDialog: () => void;
  iconMap: Record<string, SvgIconComponent>;
}

const IconOption = ({ name, selectIcon, closeDialog, iconMap }: IconOptionProps) => {
  const IconComponent = iconMap[name];

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
