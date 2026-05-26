import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import TextInput from '@/components/shared/inputs/TextInput';
import TypeToggleField, {
  ToggleTypeOption,
} from '@/components/shared/inputs/TypeToggleField';
import Column from '@/components/shared/layout/containers/Column';

interface FeedbackFormProps {
  variant?: 'manual' | 'popup';
}

const FEEDBACK_OPTIONS: ToggleTypeOption[] = [
  { value: 'feedback', icon: ChatBubbleOutlineIcon, color: '#9333ea' },
  { value: 'bug', icon: BugReportOutlinedIcon, color: '#ef4444' },
  { value: 'idea', icon: LightbulbOutlinedIcon, color: '#f59e0b' },
];

const FeedbackForm = ({ variant = 'manual' }: FeedbackFormProps) => {
  const { t } = useTranslation('common');

  return (
    <Column spacing={2}>
      {variant === 'popup' && (
        <Column spacing={0.5}>
          <Typography variant="body1" fontWeight={500}>
            {t('feedback.popup.opener')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('feedback.popup.subline')}
          </Typography>
        </Column>
      )}
      <TypeToggleField
        label={t('feedback.fields.type')}
        namespace="common"
        translationKeyPrefix="feedback.toggle"
        options={FEEDBACK_OPTIONS}
        required={false}
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
