import { action, makeObservable, observable, reaction, runInAction } from 'mobx';

import { searchMoviesByTitle } from '@/services/movies';
import { LoadingStageModel } from '@/store/models/LoadingStageModel';
import type { IMovieShort } from '@/types/movies';

import { queryParamsStore } from '../QueryParamsStore/QueryParamsStore';

export class SearchStore {
  query = '';
  filteredMovies: IMovieShort[] = [];
  readonly loadingStage = new LoadingStageModel();

  constructor() {
    this.query = queryParamsStore.getParam('query') || '';
    makeObservable(this, {
      query: observable,
      filteredMovies: observable,
      setQuery: action.bound,
      search: action.bound,
      clear: action.bound,
    });

    reaction(
      () => queryParamsStore.getParam('query'),
      (q) => {
        if (q !== this.query) {
          this.query = q || '';
          this.search();
        }
      }
    );
  }

  setQuery(value: string) {
    this.query = value;
    queryParamsStore.setParam('query', value || null);
    this.search();
  }

  clear() {
    this.query = '';
    this.filteredMovies = [];
    queryParamsStore.setParam('query', null);
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
