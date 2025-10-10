import { Request, Response } from 'express';
import { loginOrRegister } from '../services/authService';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const JWT_SECRET = process.env.JWT_SECRET as string;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    const appToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token: appToken, user });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ error: 'Login failed', details: err });
  }
};
