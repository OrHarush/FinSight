import dayjs from 'dayjs';

export interface WeekRangeParts {
  sameMonth: boolean;
  startDay: string;
  endDay: string;
  startMonth: string;
  endMonth: string;
}

export const getWeekRangeParts = (
  weekStart: string,
  weekEnd: string,
  locale: string
): WeekRangeParts => {
  const start = dayjs(weekStart).locale(locale);
  const end = dayjs(weekEnd).locale(locale);

  return {
    sameMonth: start.month() === end.month(),
    startDay: start.format('D'),
    endDay: end.format('D'),
    startMonth: start.format('MMMM'),
    endMonth: end.format('MMMM'),
  };
};
