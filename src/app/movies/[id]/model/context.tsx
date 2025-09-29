'use client';

import { createContext, useContext } from 'react';

import type { IMovie } from '@/types/movies';
import { useLocalStore } from '@/utils/hooks/useLocalStore';

import { MovieStore } from './MovieStore';

type ProviderProps = {
  children: React.ReactNode;
  initData: IMovie;
};

const MovieStoreContext = createContext<MovieStore | null>(null);

export const MovieStoreProvider: React.FC<ProviderProps> = ({ children, initData }) => {
  const moviesStore = useLocalStore(() => new MovieStore(initData));

  return (
    <MovieStoreContext.Provider value={moviesStore.store}>{children}</MovieStoreContext.Provider>
  );
};

export function useMovieStore() {
  const store = useContext(MovieStoreContext);

  if (!store) throw new Error('useMovieStore must be used within MovieStoreProvider');

  return store;
}
