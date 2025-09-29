import { motion } from 'framer-motion';

import { Text } from '@/components/Text';
import type { IMovieReview } from '@/types/movies';

import { containerVariants, itemVariants } from './config';
import s from './MovieReviews.module.scss';

type Props = {
  reviews: IMovieReview[];
};

export const MovieReviews = ({ reviews }: Props) => {
  if (!reviews.length)
    return (
      <Text view="p-18" color="secondary">
        Отзывы отсутствуют
      </Text>
    );

  return (
    <motion.div className={s.reviews} variants={containerVariants}>
      {reviews.map((r) => (
        <motion.div key={r.id} className={s.reviewCard} variants={itemVariants}>
          <div className={s.reviewHeader}>
            <Text view="p-16" weight="bold" color="primary">
              {r.author}
            </Text>
            {r.rating != null && (
              <Text view="p-14" color="accent">
                ⭐ {r.rating}/10
              </Text>
            )}
          </div>
          <Text view="p-14" color="secondary" className={s.reviewContent}>
            {r.content}
          </Text>
          <Text view="p-14" color="secondary" className={s.reviewDate}>
            {new Date(r.createdAt).toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </motion.div>
      ))}
    </motion.div>
  );
};
