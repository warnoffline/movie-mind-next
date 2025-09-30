import { action, computed, makeObservable, observable, reaction, runInAction } from 'mobx';

import { FavoritesService } from '@/services/favorites';

import { LoadingStageModel } from '../models/LoadingStageModel';

import type { UserStore } from '../UserStore';

const FAVORITES_KEY = 'favorites';

export class FavoritesStore {
  favorites: number[] = [];
  readonly loadingStage = new LoadingStageModel();
  private _userStore: UserStore;
  private _service?: FavoritesService;

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
        this.favorites = this._loadFromLocalStorage();
      });
    }

    reaction(
      () => this._userStore.user,
      (user, prevUser) => {
        if (user && !prevUser) {
          this._service = new FavoritesService(user.uid);
          this.loadForUser();
        } else if (!user && prevUser) {
          this._service = undefined;
          this._loadFromLocalOnLogout();
        }
      }
    );
  }

  get isFavorite() {
    return (id: number) => this.favorites.includes(id);
  }

  private async loadForUser() {
    if (!this._service) return;
    this.loadingStage.loading();
    try {
      const localFavs = this._loadFromLocalStorage();
      const serverFavs = await this._service.get();
      const merged = Array.from(new Set([...localFavs, ...serverFavs]));

      runInAction(() => {
        this.favorites = merged;
      });

      await this._service.set(merged);
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
    if (this._userStore.isAuthorized && this._userStore.user && this._service) {
      await this._service.set(this.favorites);
    } else {
      this._saveToLocalStorage();
    }
  }

  private _saveToLocalStorage() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites));
  }

  private _loadFromLocalStorage(): number[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  private _loadFromLocalOnLogout() {
    runInAction(() => {
      this.favorites = this._loadFromLocalStorage();
    });
  }
}
