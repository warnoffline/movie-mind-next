import { useMemo } from 'react';

import { RootStore } from '@/store/RootStore';

let clientStore: RootStore | undefined = undefined;

export const useCreateRootStore = () => {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return new RootStore();
    }

    if (!clientStore) {
      clientStore = new RootStore();
    }

    return clientStore;
  }, []);
};
