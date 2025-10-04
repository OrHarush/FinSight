import { useState, useCallback } from 'react';
export const useOpen = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    return [isOpen, open, close];
};
