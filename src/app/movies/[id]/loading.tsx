import { Skeleton } from '@/components/Skeleton';

import { MovieReviewsSkeleton } from './components/Movie/components/MovieReviews';
import s from './loading.module.scss';

export default function LoadingPage() {
  return (
    <div className={s.movie}>
      <div className={s.movie__content}>
        <div className={s.movie__header}>
          <Skeleton width={300} height={400} radius={16} />
          <div className={s.movie__info}>
            <Skeleton className={s.title} radius={8} />
            <div className={s.description}>
              <Skeleton className={s.description__item} radius={8} />
              <Skeleton className={s.description__item} radius={8} />
              <Skeleton className={s.description__item} radius={8} />
              <Skeleton className={s.description__item} radius={8} />
            </div>
          </div>
        </div>
      </div>

      <div className={s.movie__reviews}>
        <MovieReviewsSkeleton count={2} />
      </div>
    </div>
  );
}
