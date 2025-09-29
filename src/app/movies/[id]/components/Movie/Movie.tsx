'use client';

import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { MovieList } from '@/components/MovieList';
import { Pagination } from '@/components/Pagination';
import { Text } from '@/components/Text';
import { useUserStore } from '@/store';

import { containerVariants, itemVariants } from './config';
import { useMovieStore } from '../../model';
import { AddReviewForm } from '../AddReviewForm';
import { GoBackButton } from '../GoBackButton';
import { MovieInfo } from '../MovieInfo';
import s from './Movie.module.scss';
import { MovieReviews } from '../MovieReviews';
import { MovieReviewsSkeleton } from '../MovieReviews';

const Movie = observer(() => {
  const router = useRouter();
  const {
    loadingStage,
    similarLoadingStage,
    movie,
    similarMovies,
    reviews,
    reviewsLoadingStage,
    totalPages,
    page,
    setPage,
  } = useMovieStore();
  const { isAuthorized } = useUserStore();

  if (loadingStage.isLoading) return <Loading />;

  if (!movie)
    return (
      <div className={s.empty}>
        <Text view="title" color="primary">
          Фильм не найден
        </Text>
        <Button variant="outlined" onClick={() => router.push('/movies')}>
          <Text view="p-18">На главную</Text>
        </Button>
      </div>
    );

  return (
    <>
      <motion.div
        className={s.movie}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {movie.backdrop.url && (
          <div
            className={s.movie__backdrop}
            style={{ backgroundImage: `url(${movie.backdrop.url})` }}
          />
        )}

        <GoBackButton onClick={() => router.back()} />

        <motion.div className={s.movie__header} variants={containerVariants}>
          <motion.div className={s.movie__poster} variants={itemVariants}>
            <Image
              className={s.movie__poster_img}
              src={movie.poster.url}
              alt={movie.name}
              width={600}
              height={900}
            />
            {movie.ageRating && (
              <Text color="primary" view="p-16">
                {movie.ageRating}+
              </Text>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <MovieInfo movie={movie} />
          </motion.div>
        </motion.div>
      </motion.div>

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
        {reviewsLoadingStage.isLoading ? (
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

      <motion.div
        className={s.similar}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className={s.similar__header}>
          <Text color="primary" view="title">
            Похожее по жанрам
          </Text>
        </div>

        {similarLoadingStage.isLoading ? (
          <Loading />
        ) : (
          <motion.div
            className={s.movies__list}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <MovieList movies={similarMovies} />
          </motion.div>
        )}
      </motion.div>
    </>
  );
});

export default function MovieWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <Movie />
    </Suspense>
  );
}
