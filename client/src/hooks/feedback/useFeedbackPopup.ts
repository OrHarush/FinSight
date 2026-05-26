import { useEffect } from 'react';

import { API_ROUTES } from '@/constants/Routes';
import { useOpen } from '@/hooks/common/useOpen';
import { useFetch } from '@/hooks/common/useFetch';
import { useApiMutation } from '@/hooks/useApiMutation';

interface SurveyEligibility {
  shouldShow: boolean;
}

export const useFeedbackPopup = () => {
  const [isOpen, openSurvey, closeSurveyState] = useOpen();

  const { data } = useFetch<SurveyEligibility>({
    url: API_ROUTES.FEEDBACK_SURVEY_ELIGIBILITY,
    queryKey: ['feedback-survey-eligibility'],
  });

  const markSurveySeen = useApiMutation<void, object>({
    method: 'patch',
    url: API_ROUTES.FEEDBACK_SURVEY_SEEN,
  });

  useEffect(() => {
    if (data?.shouldShow) {
      openSurvey();
    }
  }, [data, openSurvey]);

  const closeSurvey = () => {
    markSurveySeen.mutate({});
    closeSurveyState();
  };

  return { isOpen, closeSurvey };
};
