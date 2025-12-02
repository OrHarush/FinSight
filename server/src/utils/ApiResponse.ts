import { Response } from 'express';

export class ApiResponse {
  static ok<T>(res: Response, data: T) {
    return res.status(200).json({ success: true, data });
  }

  static created<T>(res: Response, data: T) {
    return res.status(201).json({ success: true, data });
  }

  static deleted(res: Response, message = 'Deleted successfully') {
    return res.status(200).json({ success: true, message });
  }
}
