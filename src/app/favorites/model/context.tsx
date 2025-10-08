'use client';

import { useQueryStates } from 'nuqs';
import { createContext, useContext } from 'react';

import { MOVIES_PAGE_SEARCH_PARAMS_PARSER } from '@/configs/searchParams';
import { useRootStore } from '@/store';
import { useLocalStore } from '@/utils/hooks/useLocalStore';

import { FavoritesPageStore } from './FavoritesPageStore';

type ProviderProps = {
  children: React.ReactNode;
};

const FavoritesPageStoreContext = createContext<FavoritesPageStore | null>(null);

export const FavoritesPageStoreProvider: React.FC<ProviderProps> = ({ children }) => {
  const [queryFilters, setQueryFilters] = useQueryStates(MOVIES_PAGE_SEARCH_PARAMS_PARSER);
  const favoritesStore = useRootStore().favoriteStore;

  const favoritesPageStore = useLocalStore(
    () => new FavoritesPageStore(favoritesStore, queryFilters, setQueryFilters)
  );

  return (
    <FavoritesPageStoreContext.Provider value={favoritesPageStore.store}>
      {children}
    </FavoritesPageStoreContext.Provider>
  );
};

export function useFavoritesPageStore() {
  const store = useContext(FavoritesPageStoreContext);

  if (!store)
    throw new Error('useFavoritesPageStore must be used within FavoritesPageStoreProvider');

  return store;
}
