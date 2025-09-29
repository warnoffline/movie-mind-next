import { action, computed, makeObservable, runInAction, reaction } from 'mobx';

import { getMoviesByIds } from '@/services/movies';
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
  readonly pagination = new PaginationModel(10);

  private queryFilters: FavoriteQueryFilters;
  private setQueryFilters: FavoriteSetFilters;
  private favoritesStore: FavoritesStore;

  constructor(
    favoritesStore: FavoritesStore,
    queryFilters: FavoriteQueryFilters,
    setQueryFilters: FavoriteSetFilters
  ) {
    this.queryFilters = queryFilters;
    this.setQueryFilters = setQueryFilters;
    this.favoritesStore = favoritesStore;

    makeObservable(this, {
      movies: computed,
      page: computed,
      totalPages: computed,
      setPage: action.bound,
    });

    this.initFromQuery();

    reaction(
      () => this.favoritesStore.favorites.slice(),
      () => this.loadMovies()
    );

    reaction(
      () => this.pagination.page,
      () => this.loadMovies()
    );
  }

  initFromQuery() {
    const pg = this.queryFilters.page ?? 1;
    this.pagination.setPage(pg);
    this.loadMovies();
  }

  syncQuery() {
    this.setQueryFilters({ page: this.page });
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
    this.syncQuery();
  }

  private async loadMovies() {
    const favIds = this.favoritesStore.favorites;
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

      const { movies } = await getMoviesByIds(idsPage.map(String));
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
