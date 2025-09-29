'use client';

import React from 'react';

import { useCreateRootStore } from '@/utils/hooks/useCreateRootStore';

import { RootStoreContext } from './RootStoreContext';

type RootStoreProviderProps = {
  children: React.ReactNode;
};

export const RootStoreProvider: React.FC<RootStoreProviderProps> = ({ children }) => {
  const store = useCreateRootStore();

  return <RootStoreContext.Provider value={store}>{children}</RootStoreContext.Provider>;
};
