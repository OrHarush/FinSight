export interface DebugSnapshotAccountDto {
  _id: string;
  balance: number;
  checkpointBalance: number;
  checkpointDate: string | null;
}

export interface DebugSnapshotTemplateDto {
  _id: string;
  lastGeneratedDate: string | null;
}

export interface DebugSnapshotDto {
  _id: string;
  userId: string;
  takenAt: string;
  restoredAt: string | null;
  reason: string;
  accounts: DebugSnapshotAccountDto[];
  templates: DebugSnapshotTemplateDto[];
  createdTxIds: string[];
}

export interface DebugRunResultDto {
  email: string;
  userId: string | null;
  found: boolean;
  snapshotId: string | null;
  createdTxIds: string[];
  balanceSynced: boolean;
  durationMs: number;
}

export interface DebugRestoreResultDto {
  snapshotId: string;
  restoredCounts: {
    tx: number;
    accounts: number;
    templates: number;
    failed: number;
  };
  durationMs: number;
}
