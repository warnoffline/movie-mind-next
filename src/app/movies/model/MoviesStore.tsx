import { makeObservable, action, computed, runInAction } from 'mobx';

import { MoviesService } from '@/services/movies';
import { LoadingStageModel } from '@/store/models/LoadingStageModel';
import { PaginationModel } from '@/store/models/PaginationModel';
import { ValueModel } from '@/store/models/ValueModel';
import type { IGetMoviesResponse, IMovieShort } from '@/types/movies';
import type { ILocalStore } from '@/types/store';

import type { MoviesQueryFilters, MoviesSetFilters } from './types';

export class MoviesStore implements ILocalStore {
  private readonly _movies = new ValueModel<IMovieShort[]>([]);
  private readonly _selectedCategory = new ValueModel<string | null>(null);
  readonly loadingStage = new LoadingStageModel();
  readonly pagination = new PaginationModel();
  private readonly _service = new MoviesService();

  private readonly _queryFilters: MoviesQueryFilters;
  private readonly _setQueryFilters: MoviesSetFilters;

  constructor(
    queryFilters: MoviesQueryFilters,
    setQueryFilters: MoviesSetFilters,
    initData: IGetMoviesResponse
  ) {
    this._queryFilters = queryFilters;
    this._setQueryFilters = setQueryFilters;

    makeObservable(this, {
      selectedCategory: computed,
      page: computed,
      movies: computed,
      totalPages: computed,
      setPage: action.bound,
      setCategory: action.bound,
    });

    this._movies.change(initData.movies);
    this.pagination.setTotalCounts(initData.totalCounts);
    this.pagination.setPage(initData.page);

    this._initFromQuery();
  }

  get selectedCategory() {
    return this._selectedCategory.value;
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
    this._loadMovies();
    this._syncQuery();
  }

  setCategory(category: string | null) {
    if (category === this.selectedCategory) return;
    this._selectedCategory.change(category);
    this.pagination.setPage(1);
    this._loadMovies();
    this._syncQuery();
  }

  private _syncQuery() {
    const filters: Record<string, string | number | null> = { page: this.page };
    filters.category = this.selectedCategory;
    this._setQueryFilters(filters);
  }

  private async _loadMovies() {
    this.loadingStage.loading();
    try {
      const response = this.selectedCategory
        ? await this._service.getMoviesByGenres(
            [this.selectedCategory],
            this.page,
            this.pagination.limit
          )
        : await this._service.getMovies(this.page, this.pagination.limit);

      runInAction(() => {
        this._movies.change(response.movies);
        this.pagination.setTotalCounts(response.totalCounts);
        this.loadingStage.success();
      });
    } catch {
      this.loadingStage.error();
    }
  }

  private _initFromQuery() {
    const cat = this._queryFilters.category ?? null;
    const pg = this._queryFilters.page ?? 1;

    this._selectedCategory.change(cat ? String(cat) : null);
    this.pagination.setPage(Number(pg));

    this._loadMovies();
  }

  destroy(): void {
    // nothing
  }
}
