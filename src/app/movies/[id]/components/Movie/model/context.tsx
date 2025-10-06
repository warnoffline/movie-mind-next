'use client';

import { createContext, useContext } from 'react';

import { useLocalStore } from '@/utils/hooks/useLocalStore';

import { ReviewStore } from './ReviewStore';

type ProviderProps = {
  children: React.ReactNode;
  movieId: string;
};

const ReviewStoreContext = createContext<ReviewStore | null>(null);

export const ReviewStoreProvider: React.FC<ProviderProps> = ({ children, movieId }) => {
  const reviewStore = useLocalStore(() => new ReviewStore(movieId));

  return (
    <ReviewStoreContext.Provider value={reviewStore.store}>{children}</ReviewStoreContext.Provider>
  );
};

export function useReviewStore() {
  const store = useContext(ReviewStoreContext);

  if (!store) throw new Error('useReviewStore must be used within ReviewStoreProvider');

  return store;
}
