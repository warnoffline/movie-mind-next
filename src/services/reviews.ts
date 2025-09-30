import type { IMovieReview, IMovieReviewResponse } from '@/types/movies';

import { BASE_URL } from './instance';

export class ReviewsService {
  async addReview(
    movieId: string,
    review: { author: string; content: string; rating?: number }
  ): Promise<IMovieReview> {
    const res = await fetch(`${BASE_URL}/movies/${movieId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to add review');
    return res.json();
  }

  async getReviews(movieId: string, page = 1, limit = 5): Promise<IMovieReviewResponse> {
    const res = await fetch(`${BASE_URL}/movies/${movieId}/reviews?page=${page}&limit=${limit}`, {
      next: { revalidate: 10 },
    });
    if (!res.ok) throw new Error('Failed to fetch movie reviews');
    return res.json();
  }
}
