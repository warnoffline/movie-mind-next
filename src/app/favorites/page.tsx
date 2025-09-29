'use client';

import { observer } from 'mobx-react-lite';

import { Loading } from '@/components/Loading';
import { useFavoriteStore, useUserStore } from '@/store';

import { Favorites } from './components/Favorites';
import { FavoritesPageStoreProvider } from './model';

const FavoritesPage = observer(() => {
  const { loadingStage } = useUserStore();
  const { loadingStage: favoriteStage } = useFavoriteStore();

  if (loadingStage.isLoading || favoriteStage.isLoading) return <Loading />;

  return (
    <FavoritesPageStoreProvider>
      <Favorites />
    </FavoritesPageStoreProvider>
  );
});

export default FavoritesPage;
