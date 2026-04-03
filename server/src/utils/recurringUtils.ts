import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const clampedDate = (year: number, month: number, dayOfMonth: number): Date => {
  const d = dayjs.utc().year(year).month(month).startOf('month');
  const day = Math.min(dayOfMonth, d.daysInMonth());

  return d.date(day).toDate();
};
