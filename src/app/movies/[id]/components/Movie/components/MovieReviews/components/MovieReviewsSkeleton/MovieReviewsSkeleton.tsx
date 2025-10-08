import { Skeleton } from '@/components/Skeleton';

import s from './MovieReviewsSkeleton.module.scss';

type Props = {
  count?: number;
};

export const MovieReviewsSkeleton = ({ count = 3 }: Props) => {
  return (
    <div className={s.reviews}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={s.reviewCard}>
          <div className={s.reviewHeader}>
            <Skeleton width={120} height={20} />
            <Skeleton width={50} height={18} className={s.mt6} />
          </div>
          <Skeleton width="100%" height={16} className={s.mt8} />
          <Skeleton width="95%" height={16} className={s.mt4} />
          <Skeleton width={80} height={14} className={s.mt6} />
        </div>
      ))}
    </div>
  );
};
