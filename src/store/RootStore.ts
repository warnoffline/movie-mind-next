import { enableStaticRendering } from 'mobx-react-lite';

import { AlertStore } from './AlertStore';
import { FavoritesStore } from './FavoriteStore';
import { LocalStore } from './models/LocalStore';
import { QueryParamsStore } from './QueryParamsStore';
import { SearchStore } from './SearchStore';
import { UserStore } from './UserStore';

import type { IRootStore } from './types';

const isServer = typeof window === 'undefined';
enableStaticRendering(isServer);

export class RootStore extends LocalStore implements IRootStore {
  alertStore: AlertStore;
  userStore: UserStore;
  queryParamsStore: QueryParamsStore;
  favoriteStore: FavoritesStore;
  searchStore: SearchStore;

  constructor() {
    super();

    this.queryParamsStore = new QueryParamsStore();
    this.alertStore = new AlertStore();
    this.userStore = new UserStore(this.alertStore);
    this.favoriteStore = new FavoritesStore(this.userStore);
    this.searchStore = new SearchStore();
  }
}
