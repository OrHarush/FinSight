import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { TOTAL_STEPS } from '@/pages/Import/constants/import';
import {
  ImportPreview,
  SINGLE_CARD_KEY,
  UNKNOWN_CARD_KEY,
  WizardRow,
  WizardSettings,
} from '@/pages/Import/types/importWizard';

type StepIntercept = (() => boolean) | null;

export interface FooterPrimaryAction {
  label: string;
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

interface ImportWizardState {
  activeStep: number;
  file: File | null;
  preview: ImportPreview | null;
  settings: WizardSettings;
  rows: WizardRow[];
  cards: string[];
  activeCardIndex: number;
  nextLabelOverride: string | null;
  nextDisabledReason: string | null;
  duplicateRowIndices: number[];
  isReviewingDuplicates: boolean;
  skippedDuplicatesCount: number;
  footerPrimaryAction: FooterPrimaryAction | null;
  isImportComplete: boolean;
}

interface ImportWizardActions {
  goToNextStep: () => void;
  goToPrevStep: () => void;
  setFile: (file: File | null) => void;
  setPreview: (preview: ImportPreview | null) => void;
  setSettings: (settings: Partial<WizardSettings>) => void;
  setCardAssignment: (cardKey: string, paymentMethodId: string) => void;
  setRows: (rows: WizardRow[]) => void;
  updateRowCategory: (index: number, categoryId: string | null) => void;
  updateRowName: (index: number, name: string) => void;
  toggleRowSelected: (index: number) => void;
  toggleAllSelected: () => void;
  deleteRows: (indices: number[]) => void;
  canProceed: boolean;
  setCanProceed: (value: boolean) => void;
  setActiveCardIndex: (index: number) => void;
  registerNextIntercept: (fn: StepIntercept) => void;
  registerPrevIntercept: (fn: StepIntercept) => void;
  setNextLabelOverride: (label: string | null) => void;
  setNextDisabledReason: (reason: string | null) => void;
  setDuplicateRowIndices: (indices: number[]) => void;
  setIsReviewingDuplicates: (value: boolean) => void;
  setSkippedDuplicatesCount: (count: number) => void;
  setFooterPrimaryAction: (action: FooterPrimaryAction | null) => void;
  setIsImportComplete: (value: boolean) => void;
  resetWizard: () => void;
}

type ImportWizardContextValue = ImportWizardState & ImportWizardActions;

const ImportWizardContext = createContext<ImportWizardContextValue | null>(null);

const defaultSettings: WizardSettings = {
  accountId: '',
  cardAssignments: { [SINGLE_CARD_KEY]: '' },
  dateFilter: null,
};

const toWizardCardKey = (card: string | null): string => card ?? UNKNOWN_CARD_KEY;

const deriveCards = (preview: ImportPreview | null): string[] => {
  if (!preview) {
    return [];
  }

  const cards = [...preview.cards];
  const hasUnknown = preview.rows.some(r => r.card === null);

  if (cards.length > 0 && hasUnknown) {
    cards.push(UNKNOWN_CARD_KEY);
  }

  return cards;
};

interface ImportWizardProviderProps {
  children: ReactNode;
}

export const ImportWizardProvider = ({ children }: ImportWizardProviderProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreviewState] = useState<ImportPreview | null>(null);
  const [settings, setSettingsState] = useState<WizardSettings>(defaultSettings);
  const [rows, setRows] = useState<WizardRow[]>([]);
  const [canProceed, setCanProceed] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [nextIntercept, setNextIntercept] = useState<StepIntercept>(null);
  const [prevIntercept, setPrevIntercept] = useState<StepIntercept>(null);
  const [nextLabelOverride, setNextLabelOverride] = useState<string | null>(null);
  const [nextDisabledReason, setNextDisabledReason] = useState<string | null>(null);
  const [duplicateRowIndices, setDuplicateRowIndices] = useState<number[]>([]);
  const [isReviewingDuplicates, setIsReviewingDuplicates] = useState(false);
  const [skippedDuplicatesCount, setSkippedDuplicatesCount] = useState(0);
  const [footerPrimaryAction, setFooterPrimaryAction] = useState<FooterPrimaryAction | null>(null);
  const [isImportComplete, setIsImportComplete] = useState(false);

  const cards = useMemo(() => deriveCards(preview), [preview]);

  const setPreview = useCallback((next: ImportPreview | null) => {
    setPreviewState(next);
    setActiveCardIndex(0);

    if (next === null) {
      setSettingsState(defaultSettings);
      return;
    }

    const derived = deriveCards(next);
    const assignments: Record<string, string> =
      derived.length > 0 ? {} : { [SINGLE_CARD_KEY]: '' };

    for (const card of derived) {
      assignments[card] = '';
    }

    setSettingsState({
      accountId: '',
      cardAssignments: assignments,
      dateFilter: null,
    });
  }, []);

  const goToNextStep = () => {
    if (nextIntercept && nextIntercept()) {
      return;
    }

    setCanProceed(false);
    setNextLabelOverride(null);
    setNextDisabledReason(null);
    setActiveStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
  };

  const goToPrevStep = () => {
    if (prevIntercept && prevIntercept()) {
      return;
    }

    setCanProceed(true);
    setNextLabelOverride(null);
    setNextDisabledReason(null);
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const resetWizard = () => {
    setActiveStep(0);
    setFile(null);
    setPreview(null);
    setRows([]);
    setCanProceed(false);
    setNextLabelOverride(null);
    setNextDisabledReason(null);
    setDuplicateRowIndices([]);
    setIsReviewingDuplicates(false);
    setSkippedDuplicatesCount(0);
    setFooterPrimaryAction(null);
    setIsImportComplete(false);
    setNextIntercept(null);
    setPrevIntercept(null);
  };

  const setSettings = (partial: Partial<WizardSettings>) => {
    setSettingsState(prev => ({ ...prev, ...partial }));
  };

  const setCardAssignment = (cardKey: string, paymentMethodId: string) => {
    setSettingsState(prev => ({
      ...prev,
      cardAssignments: { ...prev.cardAssignments, [cardKey]: paymentMethodId },
    }));
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

  const deleteRows = (indices: number[]) => {
    const indexSet = new Set(indices);

    setRows(prev => prev.filter((_, i) => !indexSet.has(i)));
  };

  const registerNextIntercept = useCallback((fn: StepIntercept) => {
    setNextIntercept(() => fn);
  }, []);

  const registerPrevIntercept = useCallback((fn: StepIntercept) => {
    setPrevIntercept(() => fn);
  }, []);

  return (
    <ImportWizardContext.Provider
      value={{
        activeStep,
        file,
        preview,
        settings,
        rows,
        cards,
        activeCardIndex,
        nextLabelOverride,
        nextDisabledReason,
        duplicateRowIndices,
        isReviewingDuplicates,
        skippedDuplicatesCount,
        footerPrimaryAction,
        isImportComplete,
        canProceed,
        goToNextStep,
        goToPrevStep,
        setFile,
        setPreview,
        setSettings,
        setCardAssignment,
        setRows,
        updateRowCategory,
        updateRowName,
        toggleRowSelected,
        toggleAllSelected,
        deleteRows,
        setCanProceed,
        setActiveCardIndex,
        registerNextIntercept,
        registerPrevIntercept,
        setNextLabelOverride,
        setNextDisabledReason,
        setDuplicateRowIndices,
        setIsReviewingDuplicates,
        setSkippedDuplicatesCount,
        setFooterPrimaryAction,
        setIsImportComplete,
        resetWizard,
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

export { toWizardCardKey };
