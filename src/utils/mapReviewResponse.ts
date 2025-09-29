import { Timestamp } from 'firebase/firestore';

import type { IMovieReview } from '@/types/movies';

import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export const mapReviewResponse = (
  doc: QueryDocumentSnapshot<DocumentData>,
  movieId: string
): IMovieReview => {
  const data = doc.data();

  let createdAtIso: string = new Date().toISOString();
  const createdAtValue = data.createdAt;
  if (createdAtValue instanceof Timestamp) {
    createdAtIso = createdAtValue.toDate().toISOString();
  } else if (createdAtValue instanceof Date) {
    createdAtIso = createdAtValue.toISOString();
  } else if (typeof createdAtValue === 'string') {
    createdAtIso = createdAtValue;
  }

  return {
    id: doc.id,
    movieId,
    author: typeof data.author === 'string' ? data.author : 'Anonymous',
    content: typeof data.content === 'string' ? data.content : '',
    rating: typeof data.rating === 'number' ? data.rating : undefined,
    createdAt: createdAtIso,
  };
};
