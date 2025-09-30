import { action, computed, makeObservable, runInAction } from 'mobx';

import { MoviesService } from '@/services/movies';
import { LoadingStageModel } from '@/store/models/LoadingStageModel';
import { ValueModel } from '@/store/models/ValueModel';
import type { IMovieShort } from '@/types/movies';
import type { ILocalStore } from '@/types/store';

import type { SearchQueryFilters, SearchSetFilters } from './types';

export class SearchStore implements ILocalStore {
  private readonly _query = new ValueModel<string>('');
  private readonly _filteredMovies = new ValueModel<IMovieShort[]>([]);
  readonly loadingStage = new LoadingStageModel();

  private readonly _queryFilters: SearchQueryFilters;
  private readonly _setQueryFilters: SearchSetFilters;
  private readonly _service = new MoviesService();

  constructor(queryFilters: SearchQueryFilters, setQueryFilters: SearchSetFilters) {
    makeObservable(this, {
      query: computed,
      filteredMovies: computed,
      setQuery: action.bound,
    });

    this._queryFilters = queryFilters;
    this._setQueryFilters = setQueryFilters;

    this._initFromQuery();
  }

  get query() {
    return this._query.value;
  }

  get filteredMovies() {
    return this._filteredMovies.value;
  }

  setQuery(value: string) {
    this._query.change(value);
    this._search();
    this._syncQuery();
  }

  private _initFromQuery() {
    this._query.change(this._queryFilters.query ?? '');

    if (this.query) {
      this._search();
    }
    this._syncQuery();
  }

  private _syncQuery() {
    this._setQueryFilters({ query: this.query || null });
  }

  private async _search() {
    if (!this.query.trim()) {
      this._filteredMovies.change([]);
      return;
    }

    this.loadingStage.loading();
    try {
      const results = await this._service.searchMoviesByTitle(this.query);

      runInAction(() => {
        this._filteredMovies.change(results);
        this.loadingStage.success();
      });
    } catch {
      runInAction(() => this.loadingStage.error());
    }
  }

  destroy(): void {
    // no
  }
}
