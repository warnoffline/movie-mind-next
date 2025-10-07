'use client';

import cn from 'classnames';
import { motion } from 'framer-motion';

import s from './SearchSuggestions.module.scss';

const SKELETON_COUNT = 3;

export const SearchSkeletons = () => {
  return (
    <motion.div
      className={s.list}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
        <motion.div
          key={idx}
          className={cn(s.item, s.skeleton)}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05, duration: 0.2 }}
        >
          <div className={s.skeletonPoster} />
          <div className={s.skeletonTitle} />
        </motion.div>
      ))}
    </motion.div>
  );
};
