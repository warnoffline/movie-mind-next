import { action, makeObservable, observable, runInAction } from 'mobx';

import { searchMoviesByTitle } from '@/services/movies';
import { LoadingStageModel } from '@/store/models/LoadingStageModel';
import type { IMovieShort } from '@/types/movies';

import type { SearchQueryFilters, SearchSetFilters } from './types';

export class SearchStore {
  query = '';
  filteredMovies: IMovieShort[] = [];
  readonly loadingStage = new LoadingStageModel();

  private queryFilters: SearchQueryFilters;
  private setQueryFilters: SearchSetFilters;

  constructor(queryFilters: SearchQueryFilters, setQueryFilters: SearchSetFilters) {
    makeObservable(this, {
      query: observable,
      filteredMovies: observable,
      setQuery: action.bound,
      clear: action.bound,
      search: action.bound,
      initFromQuery: action.bound,
    });

    this.queryFilters = queryFilters;
    this.setQueryFilters = setQueryFilters;
  }

  initFromQuery() {
    this.query = this.queryFilters.query ?? '';
    if (this.query) {
      this.search();
    }
    this.syncQuery();
  }

  private syncQuery() {
    this.setQueryFilters({ query: this.query || null });
  }

  setQuery(value: string) {
    this.query = value;
    this.search();
    this.syncQuery();
  }

  clear() {
    this.query = '';
    this.filteredMovies = [];
    this.syncQuery();
  }

  async search() {
    if (!this.query.trim()) {
      runInAction(() => {
        this.filteredMovies = [];
      });
      return;
    }

    this.loadingStage.loading();
    try {
      const results = await searchMoviesByTitle(this.query);
      runInAction(() => {
        this.filteredMovies = results;
        this.loadingStage.success();
      });
    } catch {
      runInAction(() => this.loadingStage.error());
    }
  }
}
