import { motion } from 'framer-motion';

import { Text } from '@/components/Text';
import type { IMovieReview } from '@/types/movies';

import { ReviewCard } from './components/ReviewCard';
import { containerVariants } from './config';
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
        <ReviewCard key={r.id} review={r} />
      ))}
    </motion.div>
  );
};
