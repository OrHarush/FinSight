import { createContext, ReactNode, useContext, useState } from 'react';

import { TOTAL_STEPS } from '@/pages/Import/constants/import';
import { ImportPreview, WizardRow, WizardSettings } from '@/pages/Import/types/importWizard';

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
  setPreview: (preview: ImportPreview | null) => void;
  setSettings: (settings: Partial<WizardSettings>) => void;
  setRows: (rows: WizardRow[]) => void;
  updateRowCategory: (index: number, categoryId: string | null) => void;
  updateRowName: (index: number, name: string) => void;
  toggleRowSelected: (index: number) => void;
  toggleAllSelected: () => void;
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
    setRows(prev => prev.map((row, i) => (i === index ? { ...row, categoryId } : row)));
  };

  const updateRowName = (index: number, name: string) => {
    setRows(prev => prev.map((row, i) => (i === index ? { ...row, name } : row)));
  };

  const toggleRowSelected = (index: number) => {
    setRows(prev =>
      prev.map((row, i) => (i === index ? { ...row, selected: !row.selected } : row))
    );
  };

  const toggleAllSelected = () => {
    setRows(prev => {
      const allSelected = prev.every(r => r.selected);

      return prev.map(r => ({ ...r, selected: !allSelected }));
    });
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
        updateRowName,
        toggleRowSelected,
        toggleAllSelected,
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
