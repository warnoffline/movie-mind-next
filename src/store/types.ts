import type { FavoritesStore } from './FavoriteStore/FavoriteStore';
import type { UserStore } from './UserStore';

export type IRootStore = {
  favoriteStore: FavoritesStore;
  userStore: UserStore;
};
