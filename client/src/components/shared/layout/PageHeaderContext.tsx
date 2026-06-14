import { Dayjs } from 'dayjs';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface DateConfig {
  value: Dayjs;
  onChange: (date: Dayjs) => void;
}

type PrimaryAction = (() => void) | null;

interface PageHeaderContextValue {
  title: string;
  showDateSelector: boolean;
  navBarActions: ReactNode | null;
  dateConfig: DateConfig | null;
  primaryAction: PrimaryAction;
  setPageTitle: (title: string) => void;
  setShowDateSelector: (show: boolean) => void;
  setNavBarActions: (actions: ReactNode | null) => void;
  setDateConfig: (config: DateConfig | null) => void;
  setPrimaryAction: (action: PrimaryAction) => void;
}

const PageHeaderContext = createContext<PageHeaderContextValue>({
  title: '',
  showDateSelector: false,
  navBarActions: null,
  dateConfig: null,
  primaryAction: null,
  setPageTitle: () => {},
  setShowDateSelector: () => {},
  setNavBarActions: () => {},
  setDateConfig: () => {},
  setPrimaryAction: () => {},
});

export const PageHeaderProvider = ({ children }: { children: ReactNode }) => {
  const [title, setPageTitle] = useState('');
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [navBarActions, setNavBarActions] = useState<ReactNode | null>(null);
  const [dateConfig, setDateConfig] = useState<DateConfig | null>(null);
  const [primaryAction, setPrimaryActionState] = useState<PrimaryAction>(null);

  const setPrimaryAction = useCallback((action: PrimaryAction) => {
    setPrimaryActionState(() => action);
  }, []);

  const value: PageHeaderContextValue = {
    title,
    showDateSelector,
    navBarActions,
    dateConfig,
    primaryAction,
    setPageTitle,
    setShowDateSelector,
    setNavBarActions,
    setDateConfig,
    setPrimaryAction,
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

export const usePrimaryAction = (action: PrimaryAction) => {
  const { setPrimaryAction } = usePageHeaderContext();

  useEffect(() => {
    setPrimaryAction(action);

    return () => {
      setPrimaryAction(null);
    };
  }, [action]);
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
