import { Request, Response } from 'express';

import { asyncHandler } from '../middlewares/asyncHandler';
import * as adminService from '../services/adminService';
import * as backupService from '../services/backupService';

export const downloadFullBackupController = asyncHandler(async (req: Request, res: Response) => {
  await adminService.recordDbBackupExport(req.userId!);

  const filename = `lyra-backup-${new Date().toISOString().slice(0, 10)}.zip`;
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  const archive = backupService.buildBackupArchive();

  archive.on('error', err => {
    console.error('Backup archive error:', err);
    res.destroy(err);
  });

  archive.pipe(res);
});
