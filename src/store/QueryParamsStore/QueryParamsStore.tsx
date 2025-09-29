import { makeAutoObservable } from 'mobx';

export class QueryParamsStore {
  query: Record<string, string | undefined> = {};

  constructor() {
    makeAutoObservable(this);
  }

  getParam(key: string) {
    return this.query[key] || null;
  }

  setParam(key: string, value: string | null) {
    if (value === null) {
      this.query[key] = undefined;
    } else {
      this.query[key] = value;
    }
  }

  setQueryObject(newQuery: Record<string, string>) {
    this.query = { ...newQuery };
  }
}

export const queryParamsStore = new QueryParamsStore();
