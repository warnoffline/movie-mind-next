'use client';

import cn from 'classnames';

import s from './MovieReviews.module.scss';

type Props = {
  count?: number;
};

export const MovieReviewsSkeleton = ({ count = 3 }: Props) => {
  return (
    <div className={s.reviews}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={cn(s.reviewCard, s.skeleton)}>
          <div className={s.reviewHeader}>
            <div className={s.skeletonLine} style={{ width: '120px', height: '20px' }} />
            <div className={s.skeletonLine} style={{ width: '50px', height: '18px' }} />
          </div>
          <div className={s.skeletonLine} style={{ width: '100%', height: '16px', marginTop: 8 }} />
          <div className={s.skeletonLine} style={{ width: '95%', height: '16px', marginTop: 4 }} />
          <div className={s.skeletonLine} style={{ width: '80px', height: '14px', marginTop: 6 }} />
        </div>
      ))}
    </div>
  );
};
