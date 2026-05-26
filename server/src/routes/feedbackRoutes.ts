import express from 'express';

import {
  getFeedbackSurveyEligibility,
  markFeedbackSurveySeen,
  submitFeedback,
} from '../controllers/feedbackController';

const router = express.Router();

router.get('/survey-eligibility', getFeedbackSurveyEligibility);
router.patch('/survey-seen', markFeedbackSurveySeen);
router.post('/', submitFeedback);

export default router;
