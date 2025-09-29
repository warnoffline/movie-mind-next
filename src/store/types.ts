import type { FavoritesStore } from './FavoriteStore/FavoriteStore';
import type { QueryParamsStore } from './QueryParamsStore';
import type { SearchStore } from './SearchStore';
import type { UserStore } from './UserStore';

export type IRootStore = {
  queryParamsStore?: QueryParamsStore;
  favoriteStore: FavoritesStore;
  searchStore: SearchStore;
  userStore: UserStore;
};
