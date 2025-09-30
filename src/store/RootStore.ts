import { enableStaticRendering } from 'mobx-react-lite';

import { AlertStore } from './AlertStore';
import { FavoritesStore } from './FavoriteStore';
import { LocalStore } from './models/LocalStore';
import { UserStore } from './UserStore';

import type { IRootStore } from './types';

const isServer = typeof window === 'undefined';
enableStaticRendering(isServer);

export class RootStore extends LocalStore implements IRootStore {
  alertStore: AlertStore;
  userStore: UserStore;
  favoriteStore: FavoritesStore;

  constructor() {
    super();

    this.alertStore = new AlertStore();
    this.userStore = new UserStore(this.alertStore);
    this.favoriteStore = new FavoritesStore(this.userStore);
  }
}
