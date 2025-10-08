import * as React from 'react';

import type { CtxStoreValue } from '@/types/context';
import type { ILocalStore } from '@/types/store';

const useCreateStoreStx = <T>(initialValueCreator: () => T): CtxStoreValue<T> => {
  const ref = React.useRef<CtxStoreValue<T> | null>(null);

  if (ref.current === null) {
    ref.current = {
      store: initialValueCreator(),
    };
  }

  return ref.current;
};

export const useLocalStore = <T extends ILocalStore>(
  initialValueCreator: () => T
): CtxStoreValue<T> => {
  const storeCtx = useCreateStoreStx<T>(initialValueCreator);

  React.useEffect(
    () => (): void => {
      storeCtx.store.destroy();
    },
    [storeCtx.store]
  );

  return storeCtx;
};
