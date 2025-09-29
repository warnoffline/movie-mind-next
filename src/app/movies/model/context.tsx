'use client';

import { useQueryStates } from 'nuqs';
import { createContext, useContext } from 'react';

import { MOVIES_PAGE_SEARCH_PARAMS_PARSER } from '@/configs/searchParams';
import type { IGetMoviesResponse } from '@/types/movies';
import { useLocalStore } from '@/utils/hooks/useLocalStore';

import { MoviesStore } from './MoviesStore';

type ProviderProps = {
  children: React.ReactNode;
  initData: IGetMoviesResponse;
};

const MoviesStoreContext = createContext<MoviesStore | null>(null);

export const MoviesStoreProvider: React.FC<ProviderProps> = ({ children, initData }) => {
  const [queryFilters, setQueryFilters] = useQueryStates(MOVIES_PAGE_SEARCH_PARAMS_PARSER);

  const moviesStore = useLocalStore(() => new MoviesStore(queryFilters, setQueryFilters, initData));

  return (
    <MoviesStoreContext.Provider value={moviesStore.store}>{children}</MoviesStoreContext.Provider>
  );
};

export function useMoviesStore() {
  const store = useContext(MoviesStoreContext);

  if (!store) throw new Error('useMoviesStore must be used within MoviesStoreProvider');

  return store;
}
