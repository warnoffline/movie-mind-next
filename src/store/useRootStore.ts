import { useStrictContext } from '@/utils/hooks/useStrictContext';

import { RootStoreContext } from './RootStoreContext';

export const useRootStore = () => {
  return useStrictContext({
    context: RootStoreContext,
    message: 'useRootStore must be used within a RootStoreProvider',
  });
};

export const useFavoriteStore = () => useRootStore().favoriteStore;
export const useUserStore = () => useRootStore().userStore;
export const useAlertStore = () => useRootStore().alertStore;
