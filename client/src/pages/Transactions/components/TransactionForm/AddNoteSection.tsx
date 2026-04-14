import AddIcon from '@mui/icons-material/Add';
import { Collapse, Typography } from '@mui/material';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import TextInput from '@/components/shared/inputs/TextInput';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

const AddNoteSection = () => {
  const { t } = useTranslation('transactions');
  const { watch } = useFormContext();
  const noteValue = watch('note');
  const [isExpanded, setIsExpanded] = useState(() => !!noteValue);

  const expandNote = () => setIsExpanded(true);

  return (
    <Column>
      {!isExpanded && (
        <Row
          alignItems="center"
          spacing={0.5}
          sx={{ cursor: 'pointer', width: 'fit-content' }}
          onClick={expandNote}
        >
          <AddIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {t('fields.addNote')}
          </Typography>
        </Row>
      )}
      <Collapse in={isExpanded} unmountOnExit>
        <TextInput
          name="note"
          placeholder={t('fields.notePlaceholder')}
          maxLength={200}
          multiline
          rows={1}
        />
      </Collapse>
    </Column>
  );
};

export default AddNoteSection;
