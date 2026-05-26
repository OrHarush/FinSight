import { CreateFeedbackCommand } from '@lyra/shared';

import { ApiError } from '../errors/ApiError';
import * as dailyActivityRepository from '../repositories/dailyActivityRepository';
import * as feedbackRepository from '../repositories/feedbackRepository';
import * as transactionRepository from '../repositories/transactionRepository';
import * as userRepository from '../repositories/userRepository';
import * as emailService from './emailService';

// Users activated before this date who already have ≥3 transactions are silently
// marked seen on first eligibility check, so the popup never appears retroactively.
const DEPLOY_DATE = new Date('2026-05-26T00:00:00.000Z');

export const submit = async (feedback: CreateFeedbackCommand, userId: string) => {
  if (!feedback?.message || !feedback.message.trim()) {
    throw ApiError.badRequest('Feedback message is required');
  }

  if (feedback.message.length > 1000) {
    throw ApiError.badRequest('Feedback message is too long');
  }

  if (!feedback.metadata?.route) {
    throw ApiError.badRequest('Feedback route is required');
  }

  await feedbackRepository.insert({
    type: feedback.type ?? 'feedback',
    message: feedback.message.trim(),
    userId,
    variant: feedback.variant ?? 'manual',
    route: feedback.metadata.route,
  });

  await emailService.sendFeedback({ ...feedback, userId });
};

export const getSurveyEligibility = async (userId: string): Promise<{ shouldShow: boolean }> => {
  const user = await userRepository.findById(userId);

  if (!user || !!user.feedbackSurveySeenAt) {
    return { shouldShow: false };
  }

  const txCount = await transactionRepository.countByUser(userId);
  const isPreDeployUser = user.createdAt && user.createdAt < DEPLOY_DATE;

  if (isPreDeployUser && txCount >= 3) {
    await userRepository.markFeedbackSurveySeen(userId);
    return { shouldShow: false };
  }

  if (txCount >= 3) {
    return { shouldShow: true };
  }

  const activeDays = await dailyActivityRepository.countByUser(userId);

  if (activeDays >= 2) {
    return { shouldShow: true };
  }

  return { shouldShow: false };
};

export const markSurveySeen = async (userId: string): Promise<void> => {
  await userRepository.markFeedbackSurveySeen(userId);
};
