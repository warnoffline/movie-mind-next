import cn from 'classnames';

import s from './SearchSuggestions.module.scss';

const SKELETON_COUNT = 4;

export const SearchSkeletons = () => {
  return (
    <div className={s.list}>
      {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
        <div key={idx} className={cn(s.item, s.skeleton)}>
          <div className={s.skeletonPoster} />
          <div className={s.skeletonTitle} />
        </div>
      ))}
    </div>
  );
};
