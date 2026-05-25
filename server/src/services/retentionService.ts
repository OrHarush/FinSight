import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import * as retentionRepository from '../repositories/retentionRepository';
import { UserRetentionRow } from '../repositories/retentionRepository';

dayjs.extend(utc);
dayjs.extend(timezone);

const ISRAEL_TZ = 'Asia/Jerusalem';

export interface RetentionCohort {
  weekStart: string;
  weekEnd: string;
  signups: number;
  d1Rate: number | null;
  d7Rate: number | null;
  activatedRate: number | null;
}

export interface RetentionTotals {
  totalUsers: number;
  d1Rate: number | null;
  d7Rate: number | null;
  activatedRate: number | null;
  pendingD7Count: number;
}

export interface RetentionReport {
  totals: RetentionTotals;
  cohorts: RetentionCohort[];
}

// Runs live for now (small user counts). buildReport is pure, so a short-TTL
// (~5 min) cache can later wrap this entry point without restructuring. Future step.
export const getRetentionReport = async (): Promise<RetentionReport> => {
  const rows = await retentionRepository.aggregateUserRetention();

  return buildReport(rows);
};

const buildReport = (rows: UserRetentionRow[]): RetentionReport => ({
  totals: toTotals(rows),
  cohorts: toCohorts(rows),
});

const toTotals = (rows: UserRetentionRow[]): RetentionTotals => ({
  totalUsers: rows.length,
  d1Rate: d1Rate(rows),
  d7Rate: d7Rate(rows),
  activatedRate: activatedRate(rows),
  pendingD7Count: rows.filter(row => row.ageInDays < 7).length,
});

const toCohorts = (rows: UserRetentionRow[]): RetentionCohort[] =>
  [...groupByWeek(rows).entries()]
    .map(([weekStart, cohortRows]) => toCohort(weekStart, cohortRows))
    .sort((a, b) => b.weekStart.localeCompare(a.weekStart));

const toCohort = (weekStart: string, rows: UserRetentionRow[]): RetentionCohort => ({
  weekStart,
  weekEnd: dayjs.tz(weekStart, ISRAEL_TZ).endOf('week').format('YYYY-MM-DD'),
  signups: rows.length,
  d1Rate: d1Rate(rows),
  d7Rate: d7Rate(rows),
  activatedRate: activatedRate(rows),
});

const groupByWeek = (rows: UserRetentionRow[]): Map<string, UserRetentionRow[]> => {
  const cohorts = new Map<string, UserRetentionRow[]>();

  for (const row of rows) {
    const key = dayjs(row.signupAt).tz(ISRAEL_TZ).startOf('week').format('YYYY-MM-DD');
    const bucket = cohorts.get(key) ?? [];

    bucket.push(row);
    cohorts.set(key, bucket);
  }

  return cohorts;
};

// A user whose D1/D7 window has not yet closed has an unknown — not negative —
// outcome, so they are dropped from the denominator and the rate stays null.
const d1Rate = (rows: UserRetentionRow[]): number | null => {
  const eligible = rows.filter(row => row.ageInDays >= 1);

  return toRate(eligible.filter(row => row.d1).length, eligible.length);
};

const d7Rate = (rows: UserRetentionRow[]): number | null => {
  const eligible = rows.filter(row => row.ageInDays >= 7);

  return toRate(eligible.filter(row => row.d7).length, eligible.length);
};

const activatedRate = (rows: UserRetentionRow[]): number | null =>
  toRate(rows.filter(row => row.activated).length, rows.length);

const toRate = (numerator: number, denominator: number): number | null => {
  if (denominator === 0) {
    return null;
  }

  return Math.round((numerator / denominator) * 100) / 100;
};
