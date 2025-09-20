import { createContext, useContext, useState, ReactNode } from 'react';
import dayjs, { Dayjs } from 'dayjs';

interface DashboardDateContextValue {
  selectedDate: Dayjs;
  setSelectedDate: (date: Dayjs) => void;
  selectedYear: number;
  selectedMonth: number;
}

const DashboardDateContext = createContext<DashboardDateContextValue | undefined>(undefined);

export const DashboardDateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const value: DashboardDateContextValue = {
    selectedDate,
    setSelectedDate,
    selectedYear: selectedDate.year(),
    selectedMonth: selectedDate.month(),
  };

  return <DashboardDateContext.Provider value={value}>{children}</DashboardDateContext.Provider>;
};

export const useDashboardDate = () => {
  const ctx = useContext(DashboardDateContext);

  if (!ctx) {
    throw new Error('useDashboardDate must be used within DashboardDateProvider');
  }

  return ctx;
};
