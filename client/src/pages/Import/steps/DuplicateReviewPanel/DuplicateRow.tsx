import { Paper, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import CurrencyText from '@/components/shared/ui/CurrencyText';
import { WizardRow } from '@/pages/Import/types/importWizard';

import { getImportToggleStyle, getSkipToggleStyle } from './styles';

export type DuplicateDecision = 'skip' | 'import';

interface DuplicateRowProps {
  row: WizardRow;
  accountName: string;
  decision: DuplicateDecision;
  onChange: (decision: DuplicateDecision) => void;
}

const DuplicateRow = ({ row, accountName, decision, onChange }: DuplicateRowProps) => {
  const { t } = useTranslation('transactions');
  const isSkipped = decision === 'skip';

  return (
    <Paper
      variant="outlined"
      sx={{ p: 1.5, borderRadius: 1.5, opacity: isSkipped ? 0.55 : 1 }}
    >
      <Row justifyContent="space-between" alignItems="center" spacing={1}>
        <Column spacing={0.25} minWidth={0}>
          <Typography fontWeight={600} noWrap>
            {row.name}
          </Typography>
          <Row spacing={0.5} alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {row.date}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ·
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {accountName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ·
            </Typography>
            <CurrencyText value={-row.amount} hasColor hasSign variant="caption" />
          </Row>
        </Column>
        <ToggleButtonGroup
          exclusive
          value={decision}
          size="small"
          onChange={(_, next: DuplicateDecision | null) => {
            if (next) {
              onChange(next);
            }
          }}
        >
          <ToggleButton value="skip" sx={getSkipToggleStyle(isSkipped)}>
            {t('importWizard.duplicates.skip')}
          </ToggleButton>
          <ToggleButton value="import" sx={getImportToggleStyle(!isSkipped)}>
            {t('importWizard.duplicates.import')}
          </ToggleButton>
        </ToggleButtonGroup>
      </Row>
    </Paper>
  );
};

export default DuplicateRow;
