import { Request, Response } from 'express';
import { acceptTermsService, loginOrRegister, updateLastUserLogin } from '../services/authService';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { getCurrentUserById } from '../services/userService';
import { Types } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET as string;
const CURRENT_TERMS_VERSION = process.env.CURRENT_TERMS_VERSION!;

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const me = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await getCurrentUserById(req.userId);

    if (!user) {
      console.error(`User not found for ID: ${req.userId}`);
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching current user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

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

    const appToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    const showTerms = !user.acceptedTermsAt || user.consentVersion !== CURRENT_TERMS_VERSION;

    res.json({
      token: appToken,
      user,
      showTerms,
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ error: 'Login failed', details: err });
  }
};

export const acceptTerms = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
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

    res.status(200).json({
      message: 'Terms accepted successfully',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Accept Terms error:', err);
    res.status(500).json({ error: 'Failed to accept terms' });
  }
};
