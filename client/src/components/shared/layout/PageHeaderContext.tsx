import { Dayjs } from 'dayjs';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

interface DateConfig {
  value: Dayjs;
  onChange: (date: Dayjs) => void;
}

interface PageHeaderContextValue {
  title: string;
  showDateSelector: boolean;
  showDataTransferButton: boolean;
  dateConfig: DateConfig | null;
  dataTransferOnClick: (() => void) | null;
  setPageTitle: (title: string) => void;
  setShowDateSelector: (show: boolean) => void;
  setShowDataTransferButton: (show: boolean) => void;
  setDateConfig: (config: DateConfig | null) => void;
  setDataTransferOnClick: (onClick: (() => void) | null) => void;
}

const PageHeaderContext = createContext<PageHeaderContextValue>({
  title: '',
  showDateSelector: false,
  showDataTransferButton: false,
  dateConfig: null,
  dataTransferOnClick: null,
  setPageTitle: () => {},
  setShowDateSelector: () => {},
  setShowDataTransferButton: () => {},
  setDateConfig: () => {},
  setDataTransferOnClick: () => {},
});

export const PageHeaderProvider = ({ children }: { children: ReactNode }) => {
  const [title, setPageTitle] = useState('');
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [showDataTransferButton, setShowDataTransferButton] = useState(false);
  const [dateConfig, setDateConfig] = useState<DateConfig | null>(null);
  const [dataTransferOnClick, setDataTransferOnClick] = useState<(() => void) | null>(null);

  const value: PageHeaderContextValue = {
    title,
    showDateSelector,
    showDataTransferButton,
    dateConfig,
    dataTransferOnClick,
    setPageTitle,
    setShowDateSelector,
    setShowDataTransferButton,
    setDateConfig,
    setDataTransferOnClick,
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

export const useNavBarDataTransfer = (onClick: () => void) => {
  const { setShowDataTransferButton, setDataTransferOnClick } = usePageHeaderContext();
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  useEffect(() => {
    setShowDataTransferButton(true);
    setDataTransferOnClick(() => () => onClickRef.current());

    return () => {
      setShowDataTransferButton(false);
      setDataTransferOnClick(null);
    };
  }, []);
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
