import Column from '@/components/layout/Containers/Column';
import TextInput from '@/components/inputs/TextInput';
import RHFSelect from '@/components/inputs/RHFSelect';
import { useTranslation } from 'react-i18next';

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
        placeholder={t('feedback.placeholders.email')}
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
