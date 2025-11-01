import { Response } from 'express';
import { deleteUserCompletely } from '../services/userService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const deleteUserController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const requesterId = req.userId;

    if (userId !== requesterId) {
      return res.status(403).json({ message: 'Not authorized to delete this user.' });
    }

    const result = await deleteUserCompletely(userId);

    res.status(200).json({
      message: 'User and all related data deleted successfully.',
      // result,
    });
  } catch (err: any) {
    console.error('❌ deleteUserController:', err);
    res.status(500).json({ message: 'Failed to delete user.', error: err.message });
  }
};
