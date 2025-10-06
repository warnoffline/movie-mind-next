'use client';

import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';

import { Pagination } from '@/components/Pagination';
import { Text } from '@/components/Text';
import { useUserStore } from '@/store';

import s from './ReviewSection.module.scss';
import { containerVariants } from '../../config';
import { useReviewStore } from '../../model';
import { AddReviewForm } from '../AddReviewForm';
import { MovieReviewsSkeleton } from '../MovieReviews';
import { MovieReviews } from '../MovieReviews';

export const ReviewSection = observer(() => {
  const { isAuthorized } = useUserStore();
  const { reviews, loadingStage, totalPages, page, setPage } = useReviewStore();

  return (
    <motion.div
      className={s.reviews__section}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className={s.reviews__header}>
        <Text color="primary" view="title">
          Отзывы
        </Text>
      </div>
      {isAuthorized && <AddReviewForm />}
      {loadingStage.isLoading ? (
        <MovieReviewsSkeleton count={3} />
      ) : (
        <MovieReviews reviews={reviews} />
      )}
      {totalPages > 1 && (
        <div className={s.reviews__pagination}>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </motion.div>
  );
});
