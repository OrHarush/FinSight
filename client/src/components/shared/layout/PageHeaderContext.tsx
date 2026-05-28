import { Dayjs } from 'dayjs';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

interface DateConfig {
  value: Dayjs;
  onChange: (date: Dayjs) => void;
}

interface PageHeaderContextValue {
  title: string;
  showDateSelector: boolean;
  navBarActions: ReactNode | null;
  dateConfig: DateConfig | null;
  setPageTitle: (title: string) => void;
  setShowDateSelector: (show: boolean) => void;
  setNavBarActions: (actions: ReactNode | null) => void;
  setDateConfig: (config: DateConfig | null) => void;
}

const PageHeaderContext = createContext<PageHeaderContextValue>({
  title: '',
  showDateSelector: false,
  navBarActions: null,
  dateConfig: null,
  setPageTitle: () => {},
  setShowDateSelector: () => {},
  setNavBarActions: () => {},
  setDateConfig: () => {},
});

export const PageHeaderProvider = ({ children }: { children: ReactNode }) => {
  const [title, setPageTitle] = useState('');
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [navBarActions, setNavBarActions] = useState<ReactNode | null>(null);
  const [dateConfig, setDateConfig] = useState<DateConfig | null>(null);

  const value: PageHeaderContextValue = {
    title,
    showDateSelector,
    navBarActions,
    dateConfig,
    setPageTitle,
    setShowDateSelector,
    setNavBarActions,
    setDateConfig,
  };

  return <PageHeaderContext.Provider value={value}>{children}</PageHeaderContext.Provider>;
};

export const usePageHeaderContext = () => useContext(PageHeaderContext);

export const usePageHeader = (title: string, showDateSelector = false) => {
  const { setPageTitle, setShowDateSelector } = usePageHeaderContext();

  useEffect(() => {
    setPageTitle(title);
    setShowDateSelector(showDateSelector);

    return () => {
      setPageTitle('');
      setShowDateSelector(false);
    };
  }, [title, showDateSelector]);
};

export const useNavBarActions = (actions: ReactNode | null) => {
  const { setNavBarActions } = usePageHeaderContext();

  useEffect(() => {
    setNavBarActions(actions);

    return () => {
      setNavBarActions(null);
    };
  }, [actions]);
};

export const useNavBarDate = (value: Dayjs, onChange: (date: Dayjs) => void) => {
  const { setDateConfig } = usePageHeaderContext();
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    setDateConfig({ value, onChange: (d: Dayjs) => onChangeRef.current(d) });

    return () => {
      setDateConfig(null);
    };
  }, [value.valueOf()]);
};
