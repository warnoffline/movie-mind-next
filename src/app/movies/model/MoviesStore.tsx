import { makeObservable, observable, action, computed, runInAction } from 'mobx';

import { getMovies, getMoviesByGenres } from '@/services/movies';
import { LoadingStageModel } from '@/store/models/LoadingStageModel';
import { PaginationModel } from '@/store/models/PaginationModel';
import { ValueModel } from '@/store/models/ValueModel';
import type { IGetMoviesResponse, IMovieShort } from '@/types/movies';
import type { ILocalStore } from '@/types/store';

import type { MoviesQueryFilters, MoviesSetFilters } from './types';

export class MoviesStore implements ILocalStore {
  readonly _movies = new ValueModel<IMovieShort[]>([]);
  readonly loadingStage = new LoadingStageModel();
  readonly pagination = new PaginationModel();

  selectedCategory: string | null = null;

  private queryFilters: MoviesQueryFilters;
  private setQueryFilters: MoviesSetFilters;

  constructor(
    queryFilters: MoviesQueryFilters,
    setQueryFilters: MoviesSetFilters,
    initData: IGetMoviesResponse
  ) {
    makeObservable(this, {
      selectedCategory: observable,
      page: computed,
      movies: computed,
      totalPages: computed,
      setPage: action.bound,
      setCategory: action.bound,
      loadMovies: action.bound,
      initFromQuery: action.bound,
    });

    this._movies.change(initData.movies);
    this.pagination.setTotalCounts(initData.totalCounts);
    this.pagination.setPage(initData.page);
    this.queryFilters = queryFilters;
    this.setQueryFilters = setQueryFilters;

    this.initFromQuery();
  }

  initFromQuery() {
    const cat = this.queryFilters.category ?? null;
    const pg = this.queryFilters.page ?? 1;

    this.selectedCategory = cat ? String(cat) : null;
    this.pagination.setPage(Number(pg));

    this.loadMovies();
  }

  syncQuery() {
    const filters: Record<string, string | number | null> = { page: this.page };
    filters.category = this.selectedCategory;
    this.setQueryFilters(filters);
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
    this.loadMovies();
    this.syncQuery();
  }

  setCategory(category: string | null) {
    if (category === this.selectedCategory) return;
    this.selectedCategory = category;
    this.pagination.setPage(1);
    this.loadMovies();
    this.syncQuery();
  }

  async loadMovies() {
    this.loadingStage.loading();
    try {
      const response = this.selectedCategory
        ? await getMoviesByGenres([this.selectedCategory], this.page, this.pagination.limit)
        : await getMovies(this.page, this.pagination.limit);

      runInAction(() => {
        this._movies.change(response.movies);
        this.pagination.setTotalCounts(response.totalCounts);
        this.loadingStage.success();
      });
    } catch {
      runInAction(() => this.loadingStage.error());
    }
  }

  destroy(): void {
    // nothing
  }
}
