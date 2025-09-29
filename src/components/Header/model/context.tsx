'use client';

import { useLocalObservable } from 'mobx-react-lite';
import { useQueryStates } from 'nuqs';
import { createContext, useContext, useEffect } from 'react';

import { SEARCH_PAGE_SEARCH_PARAMS_PARSER } from '@/configs/searchParams';

import { SearchStore } from './SearchStore';

type ProviderProps = {
  children: React.ReactNode;
};

const SearchStoreContext = createContext<SearchStore | null>(null);

export const SearchStoreProvider: React.FC<ProviderProps> = ({ children }) => {
  const [queryFilters, setQueryFilters] = useQueryStates(SEARCH_PAGE_SEARCH_PARAMS_PARSER);

  const searchStore = useLocalObservable(() => new SearchStore(queryFilters, setQueryFilters));

  useEffect(() => {
    searchStore.initFromQuery();
  }, [searchStore]);

  return <SearchStoreContext.Provider value={searchStore}>{children}</SearchStoreContext.Provider>;
};

export function useSearchStore() {
  const store = useContext(SearchStoreContext);
  if (!store) throw new Error('useSearchStore must be used within SearchStoreProvider');
  return store;
}
