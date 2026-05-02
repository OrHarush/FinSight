import dayjs from 'dayjs';
import 'dayjs/locale/he';

export const formatBreakdownDate = (iso: string): string =>
  dayjs(iso).locale('he').format('DD MMM YYYY');
