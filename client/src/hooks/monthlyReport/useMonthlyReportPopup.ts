import dayjs from 'dayjs';
import { useEffect } from 'react';

import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import { useOpen } from '@/hooks/common/useOpen';
import { useApiMutation } from '@/hooks/useApiMutation';

export interface CategorySummary {
  categoryId: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  budget: number | null;
}

export interface MonthlyReportSummary {
  monthlyIncome: number;
  monthlyExpenses: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
  daysInMonth: number;
  savingsRate: number;
  topCategories: CategorySummary[];
}

interface MonthlyReportNotEligible {
  shouldShow: false;
}

export interface MonthlyReportEligible {
  shouldShow: true;
  month: string;
  summary: MonthlyReportSummary;
}

type EligibilityData = MonthlyReportNotEligible | MonthlyReportEligible;

// Use client local time so "which month it is" matches the user's calendar, not server UTC.
const previousMonth = dayjs().subtract(1, 'month').format('YYYY-MM');

const ELIGIBILITY_QUERY_KEY = ['monthly-report-eligibility', previousMonth];

export const useMonthlyReportPopup = () => {
  const [isOpen, openReport, closeReportState] = useOpen();

  const { data } = useFetch<EligibilityData>({
    url: API_ROUTES.MONTHLY_REPORT_ELIGIBILITY(previousMonth),
    queryKey: ELIGIBILITY_QUERY_KEY,
  });

  const markSeen = useApiMutation<void, { month: string }>({
    method: 'patch',
    url: API_ROUTES.MONTHLY_REPORT_SEEN,
    queryKeysToInvalidate: [ELIGIBILITY_QUERY_KEY],
  });

  useEffect(() => {
    if (data?.shouldShow) {
      openReport();
    }
  }, [data, openReport]);

  const closeReport = () => {
    if (data?.shouldShow) {
      markSeen.mutate({ month: data.month });
    }

    closeReportState();
  };

  const eligibleData = data?.shouldShow ? data : null;

  return { isOpen, closeReport, eligibleData };
};
