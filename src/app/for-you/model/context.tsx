'use client';

import { createContext, useContext, useEffect } from 'react';

import { useLocalStore } from '@/utils/hooks/useLocalStore';

import { ForYouStore } from './ForYouStore';

type ProviderProps = {
  children: React.ReactNode;
};

const ForYouStoreContext = createContext<ForYouStore | null>(null);

export const ForYouStoreProvider: React.FC<ProviderProps> = ({ children }) => {
  const forYouStore = useLocalStore(() => new ForYouStore());

  useEffect(() => {
    return () => forYouStore.store.destroy();
  }, [forYouStore.store]);

  return (
    <ForYouStoreContext.Provider value={forYouStore.store}>{children}</ForYouStoreContext.Provider>
  );
};

export function useForYouStore() {
  const store = useContext(ForYouStoreContext);

  if (!store) throw new Error('useForYouStore must be used within ForYouStoreProvider');

  return store;
}
