import type { GoalStatusValue } from '@lyra/shared';
import AddIcon from '@mui/icons-material/Add';
import { Button, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

interface GoalsHeaderProps {
  status: GoalStatusValue;
  onStatusChange: (status: GoalStatusValue) => void;
  onCreate: () => void;
}

const STATUSES: GoalStatusValue[] = ['active', 'achieved', 'archived'];

const GoalsHeader = ({ status, onStatusChange, onCreate }: GoalsHeaderProps) => {
  const { t } = useTranslation('goals');

  return (
    <Column spacing={1.5} sx={{ mb: 2 }}>
      <Row justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreate}
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        >
          {t('page.createCta')}
        </Button>
      </Row>
      <Row spacing={1} flexWrap="wrap">
        {STATUSES.map(s => (
          <Chip
            key={s}
            label={t(`filters.${s}`)}
            variant={status === s ? 'filled' : 'outlined'}
            color={status === s ? 'primary' : 'default'}
            size="small"
            onClick={() => onStatusChange(s)}
          />
        ))}
      </Row>
    </Column>
  );
};

export default GoalsHeader;
