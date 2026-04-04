import { Request, Response } from 'express';

import { ApiError } from '../errors/ApiError';
import { ApiResponse } from '../http/ApiResponse';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as chatService from '../services/chatService';

interface ChatRequest {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  currentDate?: string;
  currentYear?: number;
  currentMonth?: number;
}

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const {
    message,
    conversationHistory = [],
    currentDate,
    currentYear,
    currentMonth,
  } = req.body as ChatRequest;

  if (!message) {
    throw ApiError.badRequest('Message is required');
  }

  const isAdmin = req.userRole === 'admin';

  const {
    message: responseText,
    model,
    parsed,
  } = await chatService.chat(
    req.userId,
    message.trim(),
    conversationHistory,
    currentDate,
    currentYear,
    currentMonth,
    isAdmin
  );

  return ApiResponse.ok(res, {
    message: responseText,
    model,
    parsed,
  });
});
