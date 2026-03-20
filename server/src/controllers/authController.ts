import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import { ApiError } from '../errors/ApiError';
import { acceptTermsService, loginOrRegister, updateLastUserLogin } from '../services/authService';
import { getCurrentUserById } from '../services/userService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_ISSUER = process.env.JWT_ISSUER as string;
const JWT_AUDIENCE = process.env.JWT_AUDIENCE as string;
const CURRENT_TERMS_VERSION = process.env.CURRENT_TERMS_VERSION!;

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw ApiError.unauthorized('Unauthorized');
  }

  const user = await getCurrentUserById(req.userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return ApiResponse.ok(res, user);
});

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }

    const { email, name, picture, sub } = payload;

    const user = await loginOrRegister({
      provider: 'google',
      providerId: sub!,
      email: email!,
      name: name || '',
      picture,
    });

    await updateLastUserLogin(user._id);

    const appToken = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: '7d',
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
        subject: user._id.toString(),
      }
    );

    const showTerms = !user.acceptedTermsAt || user.consentVersion !== CURRENT_TERMS_VERSION;

    res.json({
      token: appToken,
      user,
      showTerms,
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err });
  }
};

// export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
//   const { token } = req.body;
//
//   if (!token) {
//     throw ApiError.badRequest('Google token is required');
//   }
//
//   const ticket = await googleClient.verifyIdToken({
//     idToken: token,
//     audience: process.env.GOOGLE_CLIENT_ID,
//   });
//
//   const payload = ticket.getPayload();
//
//   if (!payload) {
//     throw ApiError.unauthorized('Invalid Google token');
//   }
//
//   const { email, name, picture, sub } = payload;
//
//   const user = await loginOrRegister({
//     provider: 'google',
//     providerId: sub!,
//     email: email!,
//     name: name || '',
//     picture,
//   });
//
//   await updateLastUserLogin(user._id);
//
//   const appToken = jwt.sign(
//     {
//       userId: user._id.toString(),
//       role: user.role,
//     },
//     JWT_SECRET,
//     {
//       algorithm: 'HS256',
//       expiresIn: '7d',
//       issuer: JWT_ISSUER,
//       audience: JWT_AUDIENCE,
//       subject: user._id.toString(),
//     }
//   );
//
//   const showTerms = !user.acceptedTermsAt || user.consentVersion !== CURRENT_TERMS_VERSION;
//
//   console.log({
//     token: appToken,
//     user,
//     showTerms,
//   });
//
//   return ApiResponse.ok(res, {
//     token: appToken,
//     user,
//     showTerms,
//   });
// });

export const acceptTerms = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw ApiError.unauthorized('Unauthorized');
  }

  const locale = req.body.locale || 'en';
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;
  const userAgent = req.headers['user-agent'] || '';

  const updatedUser = await acceptTermsService({
    userId: req.userId,
    locale,
    ip,
    userAgent,
  });

  return ApiResponse.ok(res, {
    message: 'Terms accepted successfully',
    user: updatedUser,
  });
});
