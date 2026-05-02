import dayjs from 'dayjs';

const startOfDay = (d: dayjs.Dayjs) => d.startOf('day');

export const formatRelativeTime = (iso: string): string => {
  const date = dayjs(iso);
  const now = dayjs();
  const dayDiff = startOfDay(now).diff(startOfDay(date), 'day');

  const time = date.format('HH:mm');

  if (dayDiff === 0) {
    return `היום ${time}`;
  }

  if (dayDiff === 1) {
    return `אתמול ${time}`;
  }

  if (dayDiff < 7) {
    return `לפני ${dayDiff} ימים · ${time}`;
  }

  return date.format('DD MMM · HH:mm');
};
