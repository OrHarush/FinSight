import EntityPlaceholderContainer from '@/components/entities/EntityPlaceholderContainer';
import { Typography } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { EntityName } from '@/constants/entities';
import { useTranslation } from 'react-i18next';

interface NoEntityProps {
  entityName: EntityName;
  subtitleKey?: string; // optional
  icon: SvgIconComponent;
}

const EntityEmpty = ({ entityName, subtitleKey = 'subtitle', icon: Icon }: NoEntityProps) => {
  const { t } = useTranslation(entityName);

  const title = t('empty.title');
  const finalSubtitle = t(`empty.${subtitleKey}`);

  return (
    <EntityPlaceholderContainer>
      <Icon sx={{ fontSize: 48, opacity: 0.6 }} />
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2">{finalSubtitle}</Typography>
    </EntityPlaceholderContainer>
  );
};

export default EntityEmpty;
