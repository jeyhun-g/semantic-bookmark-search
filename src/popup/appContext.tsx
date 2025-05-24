import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export enum Pages {
  SEARCH = "Search",
  EXPLORE = "Explorz"
}

interface AppContextType {
  searchText: string;
  setSearchText: (text: string) => void
  currentPage: Pages;
  navigateTo: (page: Pages) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [page, setPage] = useState<Pages>(Pages.SEARCH);
  const [searchText, setSearchText] = useState<string>("");

  const navigateTo = useCallback((page: Pages) => {
      setPage(page)
  }, [])

  return (
    <AppContext.Provider value={{ 
      currentPage: page, 
      navigateTo, 
      searchText, 
      setSearchText 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
