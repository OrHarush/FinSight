import { createContext, ReactNode, useContext, useState } from 'react';

export interface ParsedRow {
  date: string;
  name: string;
  amount: number;
}

export interface ImportPreview {
  rowCount: number;
  dateRange: { from: string; to: string } | null;
  sample: ParsedRow[];
  warnings: string[];
}

export interface WizardRow extends ParsedRow {
  selected: boolean;
  categoryId: string | null;
}

export interface WizardSettings {
  accountId: string;
  paymentMethodId: string;
  dateFilter: { from: string; to: string } | null;
}

interface ImportWizardState {
  activeStep: number;
  file: File | null;
  preview: ImportPreview | null;
  settings: WizardSettings;
  rows: WizardRow[];
}

interface ImportWizardActions {
  goToNextStep: () => void;
  goToPrevStep: () => void;
  setFile: (file: File | null) => void;
  setPreview: (preview: ImportPreview) => void;
  setSettings: (settings: Partial<WizardSettings>) => void;
  setRows: (rows: WizardRow[]) => void;
  updateRowCategory: (index: number, categoryId: string | null) => void;
  toggleRowSelected: (index: number) => void;
  canProceed: boolean;
  setCanProceed: (value: boolean) => void;
}

type ImportWizardContextValue = ImportWizardState & ImportWizardActions;

const ImportWizardContext = createContext<ImportWizardContextValue | null>(null);

const defaultSettings: WizardSettings = {
  accountId: '',
  paymentMethodId: '',
  dateFilter: null,
};

const TOTAL_STEPS = 4;

interface ImportWizardProviderProps {
  children: ReactNode;
}

export const ImportWizardProvider = ({ children }: ImportWizardProviderProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [settings, setSettingsState] = useState<WizardSettings>(defaultSettings);
  const [rows, setRows] = useState<WizardRow[]>([]);
  const [canProceed, setCanProceed] = useState(false);

  const goToNextStep = () => {
    setCanProceed(false);
    setActiveStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
  };

  const goToPrevStep = () => {
    setCanProceed(true);
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const setSettings = (partial: Partial<WizardSettings>) => {
    setSettingsState(prev => ({ ...prev, ...partial }));
  };

  const updateRowCategory = (index: number, categoryId: string | null) => {
    setRows(prev =>
      prev.map((row, i) => (i === index ? { ...row, categoryId } : row))
    );
  };

  const toggleRowSelected = (index: number) => {
    setRows(prev =>
      prev.map((row, i) => (i === index ? { ...row, selected: !row.selected } : row))
    );
  };

  return (
    <ImportWizardContext.Provider
      value={{
        activeStep,
        file,
        preview,
        settings,
        rows,
        canProceed,
        goToNextStep,
        goToPrevStep,
        setFile,
        setPreview,
        setSettings,
        setRows,
        updateRowCategory,
        toggleRowSelected,
        setCanProceed,
      }}
    >
      {children}
    </ImportWizardContext.Provider>
  );
};

export const useImportWizard = (): ImportWizardContextValue => {
  const ctx = useContext(ImportWizardContext);

  if (!ctx) {
    throw new Error('useImportWizard must be used inside ImportWizardProvider');
  }

  return ctx;
};
