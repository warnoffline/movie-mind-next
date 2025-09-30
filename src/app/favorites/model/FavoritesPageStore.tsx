import { action, computed, makeObservable, runInAction, reaction } from 'mobx';

import { MoviesService } from '@/services/movies';
import type { FavoritesStore } from '@/store/FavoriteStore';
import { LoadingStageModel } from '@/store/models/LoadingStageModel';
import { PaginationModel } from '@/store/models/PaginationModel';
import { ValueModel } from '@/store/models/ValueModel';
import type { IMovieShort } from '@/types/movies';
import type { ILocalStore } from '@/types/store';

import type { FavoriteQueryFilters, FavoriteSetFilters } from './types';

export class FavoritesPageStore implements ILocalStore {
  private readonly _movies = new ValueModel<IMovieShort[]>([]);
  readonly loadingStage = new LoadingStageModel();
  readonly pagination = new PaginationModel();
  private readonly _service = new MoviesService();

  private readonly _queryFilters: FavoriteQueryFilters;
  private readonly _setQueryFilters: FavoriteSetFilters;
  private readonly _favoritesStore: FavoritesStore;

  constructor(
    favoritesStore: FavoritesStore,
    queryFilters: FavoriteQueryFilters,
    setQueryFilters: FavoriteSetFilters
  ) {
    this._queryFilters = queryFilters;
    this._setQueryFilters = setQueryFilters;
    this._favoritesStore = favoritesStore;

    makeObservable(this, {
      movies: computed,
      page: computed,
      totalPages: computed,
      setPage: action.bound,
    });

    this.initFromQuery();

    reaction(
      () => this._favoritesStore.favorites.slice(),
      () => this._loadMovies()
    );

    reaction(
      () => this.pagination.page,
      () => this._loadMovies()
    );
  }

  initFromQuery() {
    const pg = this._queryFilters.page ?? 1;
    this.pagination.setPage(pg);
    this._loadMovies();
  }

  get page() {
    return this.pagination.page;
  }

  get totalPages() {
    return this.pagination.totalPages;
  }

  get movies() {
    return this._movies.value;
  }

  setPage(page: number) {
    if (page === this.page) return;
    this.pagination.setPage(page);
    this._syncQuery();
  }

  private _syncQuery() {
    this._setQueryFilters({ page: this.page });
  }

  private async _loadMovies() {
    const favIds = this._favoritesStore.favorites;
    if (favIds.length === 0) {
      runInAction(() => {
        this._movies.change([]);
        this.pagination.setTotalCounts(0);
        this.loadingStage.success();
      });
      return;
    }

    runInAction(() => {
      this.loadingStage.loading();
    });

    try {
      const start = (this.pagination.page - 1) * this.pagination.limit;
      const idsPage = favIds.slice(start, start + this.pagination.limit);

      const { movies } = await this._service.getMoviesByIds(idsPage.map(String), 1, idsPage.length);
      runInAction(() => {
        const moviesSorted = idsPage.map((id) => movies.find((m) => m.id === id)).filter(Boolean);
        this._movies.change(moviesSorted as IMovieShort[]);
        this.pagination.setTotalCounts(favIds.length);
        this.loadingStage.success();
      });
    } catch {
      this.loadingStage.error();
    }
  }

  destroy(): void {
    // no-op
  }
}
