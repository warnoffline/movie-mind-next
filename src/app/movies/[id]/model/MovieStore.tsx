import { action, computed, makeObservable, reaction, runInAction } from 'mobx';

import { getMoviesByGenres } from '@/services/movies';
import { addMovieReview, getMovieReviews } from '@/services/reviews';
import { LoadingStageModel } from '@/store/models/LoadingStageModel';
import { PaginationModel } from '@/store/models/PaginationModel';
import { ValueModel } from '@/store/models/ValueModel';
import type { IMovie, IMovieReview, IMovieShort } from '@/types/movies';
import type { ILocalStore } from '@/types/store';

export class MovieStore implements ILocalStore {
  private readonly _movie = new ValueModel<IMovie | null>(null);
  private readonly _similarMovies = new ValueModel<IMovieShort[]>([]);

  readonly loadingStage = new LoadingStageModel();
  readonly similarLoadingStage = new LoadingStageModel();

  private readonly _reviews = new ValueModel<IMovieReview[]>([]);
  readonly reviewsLoadingStage = new LoadingStageModel();
  readonly pagination = new PaginationModel(5);

  constructor(initData: IMovie) {
    this._movie.change(initData);

    makeObservable(this, {
      movie: computed,
      similarMovies: computed,
      reviews: computed,
      page: computed,
      totalPages: computed,
      setPage: action.bound,
      addReview: action.bound,
      loadReviews: action.bound,
    });

    this.initFromServer();

    reaction(
      () => this.page,
      () => {
        this.loadReviews();
      }
    );
  }

  get page() {
    return this.pagination.page;
  }

  get totalPages() {
    return this.pagination.totalPages;
  }

  get reviews(): IMovieReview[] {
    return this._reviews.value;
  }

  get movie(): IMovie | null {
    return this._movie.value;
  }

  get similarMovies(): IMovieShort[] {
    return this._similarMovies.value;
  }

  setPage(page: number) {
    if (page === this.page) return;
    this.pagination.setPage(page);
  }

  async loadReviews() {
    const movie = this.movie;
    if (!movie) return;

    this.reviewsLoadingStage.loading();
    try {
      const fetchedReviews = await getMovieReviews(String(movie.id), this.page);
      runInAction(() => {
        this._reviews.change(fetchedReviews.reviews);
        this.pagination.setTotalCounts(fetchedReviews.totalCounts);
        this.reviewsLoadingStage.success();
      });
    } catch {
      runInAction(() => {
        this.reviewsLoadingStage.error();
      });
    }
  }

  async initFromServer() {
    const movie = this._movie.value;
    if (!movie) return;

    this.similarLoadingStage.loading();
    this.reviewsLoadingStage.loading();

    try {
      const genres = movie.genres.map((g) => g.name);

      const [similarResponse, reviewsResponse] = await Promise.all([
        getMoviesByGenres(genres, 1, 16),
        getMovieReviews(String(movie.id)),
      ]);

      runInAction(() => {
        this._similarMovies.change(similarResponse.movies.filter((m) => m.id !== Number(movie.id)));
        this.similarLoadingStage.success();

        this.pagination.setTotalCounts(reviewsResponse.totalCounts);
        this._reviews.change(reviewsResponse.reviews);
        this.reviewsLoadingStage.success();
      });
    } catch {
      runInAction(() => {
        this.similarLoadingStage.error();
        this.reviewsLoadingStage.error();
      });
    }
  }

  async addReview(review: { author: string; content: string; rating?: number }) {
    const movie = this.movie;
    if (!movie) return;

    this.reviewsLoadingStage.loading();
    try {
      await addMovieReview(movie.id, review);
      await this.loadReviews();
      this.reviewsLoadingStage.success();
    } catch {
      this.reviewsLoadingStage.error();
    }
  }

  destroy(): void {
    // this.disposeReaction();
  }
}
