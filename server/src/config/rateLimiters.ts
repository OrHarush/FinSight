import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

/**
 * Authentication rate limiter
 * Strict limit to prevent brute force attacks on login
 * 50 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
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

/**
 * Data export rate limiter
 * Export is read-heavy (7 collection scans) and the response can be megabytes;
 * cap per authenticated user to prevent abuse / DB hammering
 * 5 requests per hour per user
 */
export const exportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: req => req.userId ?? ipKeyGenerator(req.ip ?? '') ?? 'anonymous',
  message: 'Too many export requests, please try again in an hour.',
});
