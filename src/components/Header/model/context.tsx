'use client';

import { useQueryStates } from 'nuqs';
import { createContext, useContext } from 'react';

import { SEARCH_PAGE_SEARCH_PARAMS_PARSER } from '@/configs/searchParams';
import { useLocalStore } from '@/utils/hooks/useLocalStore';

import { SearchStore } from './SearchStore';

type ProviderProps = {
  children: React.ReactNode;
};

const SearchStoreContext = createContext<SearchStore | null>(null);

export const SearchStoreProvider: React.FC<ProviderProps> = ({ children }) => {
  const [queryFilters, setQueryFilters] = useQueryStates(SEARCH_PAGE_SEARCH_PARAMS_PARSER);

  const searchStore = useLocalStore(() => new SearchStore(queryFilters, setQueryFilters));

  return (
    <SearchStoreContext.Provider value={searchStore.store}>{children}</SearchStoreContext.Provider>
  );
};

export function useSearchStore() {
  const store = useContext(SearchStoreContext);
  if (!store) throw new Error('useSearchStore must be used within SearchStoreProvider');
  return store;
}
