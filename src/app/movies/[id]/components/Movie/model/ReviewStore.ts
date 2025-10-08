import { action, computed, makeObservable } from 'mobx';
import xss from 'xss';
import { z, ZodError } from 'zod';

import { ReviewsService } from '@/services/reviews';
import { ErrorModel } from '@/store/models/ErrorModel';
import { LoadingStageModel } from '@/store/models/LoadingStageModel';
import { LocalStore } from '@/store/models/LocalStore';
import { PaginationModel } from '@/store/models/PaginationModel';
import { ValueModel } from '@/store/models/ValueModel';
import type { IMovieReview } from '@/types/movies';
import type { ILocalStore } from '@/types/store';

const ReviewSchema = z.object({
  content: z
    .string()
    .min(1, 'Пожалуйста, напишите отзыв')
    .max(2000, 'Слишком длинный отзыв')
    .transform((s) => xss(s.trim())),
  rating: z.number().min(1, 'Минимальная оценка — 1').max(5, 'Максимальная оценка — 5'),
});

export class ReviewStore extends LocalStore implements ILocalStore {
  private readonly _content = new ValueModel<string>('');
  private readonly _rating = new ValueModel<number>(0);
  private readonly _reviews = new ValueModel<IMovieReview[]>([]);

  readonly reviewsService = new ReviewsService();
  readonly loadingStage = new LoadingStageModel();

  readonly pagination = new PaginationModel(5);
  private readonly _errors = new ErrorModel();

  constructor(private movieId: string) {
    super();

    makeObservable(this, {
      content: computed,
      rating: computed,
      reviews: computed,
      page: computed,
      totalPages: computed,
      errors: computed,
      setPage: action.bound,
      setContent: action.bound,
      setRating: action.bound,
      submit: action.bound,
      loadReviews: action.bound,
    });

    this._initFromServer();
  }

  get errors() {
    return this._errors.errors;
  }

  get content() {
    return this._content.value;
  }

  get rating() {
    return this._rating.value;
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

  setPage(page: number) {
    if (page === this.page) return;
    this.pagination.setPage(page);
    this.loadReviews();
  }

  setContent(value: string) {
    this._content.change(value);
  }

  setRating(value: number) {
    this._rating.change(value);
  }

  async loadReviews() {
    this.loadingStage.loading();

    try {
      const response = await this.reviewsService.getReviews(this.movieId, this.page);
      this._reviews.change(response.reviews);
      this.pagination.setTotalCounts(response.totalCounts);
      this.loadingStage.success();
    } catch {
      this.loadingStage.error();
    }
  }

  async submit(author: string) {
    this._errors.clear();
    try {
      this.loadingStage.loading();

      const parsed = ReviewSchema.parse({
        content: this._content.value,
        rating: this._rating.value,
      });

      const review = {
        author,
        content: parsed.content,
        rating: parsed.rating,
      };

      await this.reviewsService.addReview(this.movieId, review);
      await this.loadReviews();

      this.loadingStage.success();
      this.setContent('');
      this.setRating(0);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        this._errors.setFromZodError(err);
      } else if (err instanceof Error) {
        this._errors.set('general', err.message);
      } else {
        this._errors.set('general', 'Неизвестная ошибка');
      }
      this.loadingStage.error();
    }
  }

  private async _initFromServer() {
    const movie = this.movieId;
    if (!movie) return;

    this.loadingStage.loading();

    try {
      const reviewsResponse = await this.reviewsService.getReviews(this.movieId);

      this.pagination.setTotalCounts(reviewsResponse.totalCounts);
      this._reviews.change(reviewsResponse.reviews);
      this.loadingStage.success();
    } catch {
      this.loadingStage.error();
    }
  }

  destroy(): void {
    this.destroyReactions();
  }
}
