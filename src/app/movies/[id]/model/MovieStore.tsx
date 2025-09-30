import { action, computed, makeObservable, reaction, runInAction } from 'mobx';

import { MoviesService } from '@/services/movies';
import { ReviewsService } from '@/services/reviews';
import { LoadingStageModel } from '@/store/models/LoadingStageModel';
import { PaginationModel } from '@/store/models/PaginationModel';
import { ValueModel } from '@/store/models/ValueModel';
import type { IMovie, IMovieReview, IMovieShort } from '@/types/movies';
import type { ILocalStore } from '@/types/store';

export class MovieStore implements ILocalStore {
  private readonly _movie = new ValueModel<IMovie | null>(null);
  private readonly _similarMovies = new ValueModel<IMovieShort[]>([]);
  private readonly _reviews = new ValueModel<IMovieReview[]>([]);
  private readonly _moviesService = new MoviesService();
  private readonly _reviewsService = new ReviewsService();

  readonly loadingStage = new LoadingStageModel();
  readonly similarLoadingStage = new LoadingStageModel();
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
    });

    this._initFromServer();

    reaction(
      () => this.page,
      () => {
        this._loadReviews();
      }
    );
  }

  get page() {
    return this.pagination.page;
  }

  get totalPages() {
    return this.pagination.totalPages;
  }

  get reviews() {
    return this._reviews.value;
  }

  get movie() {
    return this._movie.value;
  }

  get similarMovies() {
    return this._similarMovies.value;
  }

  setPage(page: number) {
    if (page === this.page) return;
    this.pagination.setPage(page);
  }

  async addReview(review: { author: string; content: string; rating?: number }) {
    const movie = this.movie;
    if (!movie) return;

    this.reviewsLoadingStage.loading();

    try {
      await this._reviewsService.addReview(movie.id, review);
      await this._loadReviews();
      this.reviewsLoadingStage.success();
    } catch {
      this.reviewsLoadingStage.error();
    }
  }

  private async _loadReviews() {
    const movie = this.movie;
    if (!movie) return;

    this.reviewsLoadingStage.loading();

    try {
      const fetchedReviews = await this._reviewsService.getReviews(movie.id, this.page);
      runInAction(() => {
        this._reviews.change(fetchedReviews.reviews);
        this.pagination.setTotalCounts(fetchedReviews.totalCounts);
        this.reviewsLoadingStage.success();
      });
    } catch {
      this.reviewsLoadingStage.error();
    }
  }

  private async _initFromServer() {
    const movie = this._movie.value;
    if (!movie) return;

    this.similarLoadingStage.loading();
    this.reviewsLoadingStage.loading();

    try {
      const genres = movie.genres.map((g) => g.name);

      const [similarResponse, reviewsResponse] = await Promise.all([
        this._moviesService.getMoviesByGenres(genres, 1, 16),
        this._reviewsService.getReviews(movie.id),
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

  destroy(): void {
    // this.disposeReaction();
  }
}
