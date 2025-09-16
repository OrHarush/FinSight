import { useState, useCallback } from 'react';

export const useOpen = (initialState: boolean = false): [boolean, () => void, () => void] => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return [isOpen, open, close];
};
