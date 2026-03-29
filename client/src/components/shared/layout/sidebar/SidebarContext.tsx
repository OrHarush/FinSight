import { createContext, useContext } from 'react';

interface SidebarContextValue {
  expanded: boolean;
  toggleExpanded: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  expanded: true,
  toggleExpanded: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export default SidebarContext;
