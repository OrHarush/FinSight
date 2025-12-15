import { ApiError } from '../errors/ApiError';
import * as emailService from './emailService';
import { CreateFeedbackCommand } from '@shared/types/FeedbackCommands';

export const submit = async (feedback: CreateFeedbackCommand, userId?: string) => {
  if (!feedback?.message || !feedback.message.trim()) {
    throw ApiError.badRequest('Feedback message is required');
  }

  if (feedback.message.length > 1000) {
    throw ApiError.badRequest('Feedback message is too long');
  }

  if (!feedback.metadata?.route) {
    throw ApiError.badRequest('Feedback route is required');
  }

  await emailService.sendFeedback({
    ...feedback,
    userId,
  });
};
