'use client';

import { observer } from 'mobx-react-lite';

import { useFavoriteStore, useUserStore } from '@/store';

import { Favorites } from './components/Favorites';
import { LoadingMovies } from './components/LoadingMovies';
import { FavoritesPageStoreProvider } from './model';

const FavoritesPage = observer(() => {
  const { loadingStage } = useUserStore();
  const { loadingStage: favoriteStage } = useFavoriteStore();

  if (loadingStage.isLoading || favoriteStage.isLoading) return <LoadingMovies />;

  return (
    <FavoritesPageStoreProvider>
      <Favorites />
    </FavoritesPageStoreProvider>
  );
});

export default FavoritesPage;
