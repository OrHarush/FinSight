import Column from '@/components/shared/layout/containers/Column';
import { useTranslation } from 'react-i18next';
import RHFSelect from '@/components/shared/inputs/RHFSelect';
import TextInput from '@/components/shared/inputs/TextInput';

const FeedbackForm = () => {
  const { t } = useTranslation('common');

  return (
    <Column spacing={2}>
      <RHFSelect
        name="type"
        label={t('feedback.fields.type')}
        options={[
          { value: 'feedback', label: t('feedback.options.feedback') },
          { value: 'bug', label: t('feedback.options.bug') },
          { value: 'idea', label: t('feedback.options.idea') },
        ]}
      />
      <TextInput
        name="message"
        label={t('feedback.fields.message')}
        multiline
        minRows={5}
        fullWidth
        sx={{
          '& .MuiInputBase-root': {
            height: 'auto',
            alignItems: 'flex-start',
          },
        }}
      />
    </Column>
  );
};

export default FeedbackForm;
