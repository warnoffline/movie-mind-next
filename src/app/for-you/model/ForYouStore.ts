import { action, computed, makeObservable, observable, reaction, runInAction } from 'mobx';

import { MoviesService } from '@/services/movies';
import { LoadingStageModel } from '@/store/models/LoadingStageModel';
import { LocalStore } from '@/store/models/LocalStore';
import { ValueModel } from '@/store/models/ValueModel';
import type { IMovieShort } from '@/types/movies';
import type { ILocalStore } from '@/types/store';

const FAVORITES_KEY = 'foryou_favorites';
const RECOMMENDATIONS_KEY = 'foryou_recommendations';

export class ForYouStore extends LocalStore implements ILocalStore {
  searchQuery = '';
  private readonly _searchResults = new ValueModel<IMovieShort[]>([]);
  private readonly _favorites = new ValueModel<IMovieShort[]>([]);
  private readonly _recommendations = new ValueModel<IMovieShort[]>([]);

  readonly loadingStage = new LoadingStageModel();
  readonly recLoadingStage = new LoadingStageModel();
  readonly moviesService = new MoviesService();

  constructor() {
    super();

    makeObservable(this, {
      searchQuery: observable,
      recommendations: computed,
      favorites: computed,
      searchResults: computed,
      setQuery: action.bound,
      searchMovies: action.bound,
      toggleFavorite: action.bound,
      getRecommendations: action.bound,
      loadFromStorage: action.bound,
      saveToStorage: action.bound,
      clearStorage: action.bound,
      reset: action.bound,
    });

    this.loadFromStorage();

    const dispose = reaction(
      () => [this.favorites, this.recommendations],
      () => this.saveToStorage()
    );

    this.addReaction(dispose);
  }

  get recommendations() {
    return this._recommendations.value;
  }

  get favorites() {
    return this._favorites.value;
  }

  get searchResults() {
    return this._searchResults.value;
  }

  setQuery(query: string) {
    this.searchQuery = query;
    this.searchMovies();
    this.searchQuery = '';
  }

  async searchMovies() {
    if (!this.searchQuery.trim()) return;
    this.loadingStage.loading();
    try {
      const res = await this.moviesService.searchMoviesByTitle(this.searchQuery);
      this._searchResults.change(res);
      this.loadingStage.success();
    } catch {
      this.loadingStage.error();
    }
  }

  toggleFavorite(movie: IMovieShort) {
    const exists = this.favorites.find((m) => m.id === movie.id);
    if (exists) {
      this._favorites.change(this.favorites.filter((m) => m.id !== movie.id));
    } else {
      if (this._favorites.value.length >= 6) return;
      this._favorites.change([...this._favorites.value, movie]);
    }
    if (this.favorites.length < 1) this._recommendations.change([]);
    this.saveToStorage();
  }

  async getRecommendations() {
    if (!this.favorites.length) return;
    this.recLoadingStage.loading();

    try {
      const movieIds = this.favorites.map((f) => String(f.id));
      const res = await this.moviesService.findSimilar(movieIds);
      runInAction(() => {
        this._recommendations.change(res);
        this.recLoadingStage.success();
        this.saveToStorage();
      });
    } catch {
      this.recLoadingStage.error();
    }
  }

  loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const favData = localStorage.getItem(FAVORITES_KEY);
      const recData = localStorage.getItem(RECOMMENDATIONS_KEY);
      if (favData) this._favorites.change(JSON.parse(favData));
      if (recData) this._recommendations.change(JSON.parse(recData));
    } catch {
      throw new Error();
    }
  }

  saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(this._favorites.value));
      localStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(this._recommendations.value));
    } catch {
      throw new Error();
    }
  }

  clearStorage() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(FAVORITES_KEY);
    localStorage.removeItem(RECOMMENDATIONS_KEY);
  }

  reset() {
    this._favorites.change([]);
    this._recommendations.change([]);
    this.clearStorage();
  }

  destroy(): void {
    this.destroyReactions();
  }
}
