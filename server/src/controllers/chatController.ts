import { Request, Response } from 'express';
import * as chatService from '../services/chatService';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../errors/ApiError';

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
  console.log(req.userRole);

  // const {
  //   message: responseText,
  //   model,
  //   parsed,
  // } = await chatService.chat(
  //   req.userId,
  //   message.trim(),
  //   conversationHistory,
  //   currentDate,
  //   currentYear,
  //   currentMonth,
  //   isAdmin
  // );

  return ApiResponse.ok();
  // return ApiResponse.ok(res, {
  //   message: responseText,
  //   model,
  //   parsed,
  // });
});
