import { Skeleton } from '../Skeleton';
import s from './MovieList.module.scss';

const skeletonArray = Array.from({ length: 8 });

export const MovieListSkeletons = () => {
  return (
    <div className={s.movies__list}>
      {skeletonArray.map((_, i) => (
        <div key={i} className={s.skeleton}>
          <Skeleton width={300} height={360} radius={8} />
          <div className={s.skeleton__content}>
            <Skeleton width={100} height={20} />
            <div className={s.skeleton__description}>
              <Skeleton className={s.skeleton__item} />
              <Skeleton className={s.skeleton__item} />
              <Skeleton className={s.skeleton__item} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
