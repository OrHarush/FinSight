import rateLimit from 'express-rate-limit';

/**
 * Authentication rate limiter
 * Strict limit to prevent brute force attacks on login
 * 50 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts, please try again later.',
});

/**
 * General API rate limiter
 * Baseline limit for all authenticated routes
 * 300 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests to the API, please wait before making new requests.',
});

/**
 * Chat/AI service rate limiter
 * Strict limit to protect Gemini API quota and prevent abuse
 * 20 requests per minute per IP
 */
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests to AI service, please wait before asking again.',
});

