import { action, computed, makeObservable, observable } from 'mobx';

export class PaginationModel {
  page = 1;
  totalCounts = 0;
  readonly limit: number;

  constructor(limit = 12) {
    this.limit = limit;

    makeObservable(this, {
      page: observable,
      totalCounts: observable,
      totalPages: computed,
      setPage: action.bound,
      setTotalCounts: action.bound,
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCounts / this.limit);
  }

  setPage(page: number) {
    this.page = page;
  }

  setTotalCounts(count: number) {
    this.totalCounts = count;
  }
}
