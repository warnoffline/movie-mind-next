'use client';

import cn from 'classnames';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { Text } from '@/components/Text';
import type { IMovieReview } from '@/types/movies';

import s from './ReviewCard.module.scss';
import { StarRating } from '../../../StarRating';
import { itemVariants } from '../../config';

const ReviewCard = ({ review }: { review: IMovieReview }) => {
  const [expanded, setExpanded] = useState(false);
  const MAX_LINES = 5;

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <motion.div className={s.review__card} variants={itemVariants}>
      <div className={s.review__header}>
        <Text view="p-16" weight="bold" color="primary">
          {review.author}
        </Text>
        {review.rating != null && <StarRating value={review.rating} max={5} readOnly />}
      </div>

      <Text view="p-14" color="secondary" className={cn(s.review__content, !expanded && s.clamped)}>
        {review.content}
      </Text>

      {review.content.split('\n').length > MAX_LINES && (
        <button className={s.toggleBtn} onClick={toggleExpanded}>
          <Text view="p-14" color="accent" weight="bold">
            {expanded ? 'Скрыть' : 'Показать больше'}
          </Text>
        </button>
      )}

      <Text view="p-14" color="secondary" className={s.review__date}>
        {new Date(review.createdAt).toLocaleDateString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}
      </Text>
    </motion.div>
  );
};

export { ReviewCard };
