import { action, computed, makeObservable, observable, reaction, runInAction } from 'mobx';

import { getFavorites, setFavorites } from '@/services/favorites';

import { LoadingStageModel } from '../models/LoadingStageModel';

import type { UserStore } from '../UserStore';

const FAVORITES_KEY = 'favorites';

export class FavoritesStore {
  favorites: number[] = [];
  readonly loadingStage = new LoadingStageModel();
  private _userStore: UserStore;

  constructor(userStore: UserStore) {
    this._userStore = userStore;

    makeObservable(this, {
      favorites: observable,
      addFavorite: action.bound,
      removeFavorite: action.bound,
      toggleFavorite: action.bound,
      isFavorite: computed,
    });

    if (typeof window !== 'undefined' && !this._userStore.user) {
      runInAction(() => {
        this.favorites = this.loadFromLocalStorage();
      });
    }

    reaction(
      () => this._userStore.user,
      (user, prevUser) => {
        if (user && !prevUser) {
          this.loadForUser(user.uid);
        } else if (!user && prevUser) {
          this.loadFromLocalOnLogout();
        }
      }
    );
  }

  get isFavorite() {
    return (id: number) => this.favorites.includes(id);
  }

  private async loadForUser(uid: string) {
    this.loadingStage.loading();
    try {
      const localFavs = this.loadFromLocalStorage();
      const serverFavs = await getFavorites(uid);
      const merged = Array.from(new Set([...localFavs, ...serverFavs]));

      runInAction(() => {
        this.favorites = merged;
      });

      await setFavorites(uid, merged);
      localStorage.removeItem(FAVORITES_KEY);
      this.loadingStage.success();
    } catch {
      this.loadingStage.error();
    }
  }

  addFavorite(id: number) {
    if (!this.favorites.includes(id)) {
      this.favorites.unshift(id);
      this.sync();
    }
  }

  removeFavorite(id: number) {
    this.favorites = this.favorites.filter((fav) => fav !== id);
    this.sync();
  }

  toggleFavorite(id: number) {
    if (this.isFavorite(id)) {
      this.removeFavorite(id);
    } else {
      this.addFavorite(id);
    }
  }

  private async sync() {
    if (this._userStore.isAuthorized && this._userStore.user) {
      await setFavorites(this._userStore.user.uid, this.favorites);
    } else {
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites));
  }

  private loadFromLocalStorage(): number[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  private loadFromLocalOnLogout() {
    runInAction(() => {
      this.favorites = this.loadFromLocalStorage();
    });
  }
}
