'use client';

import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { Text } from '@/components/Text';

import { containerVariants, itemVariants } from './config';
import { useMovieStore } from '../../model';
import { GoBackButton } from '../GoBackButton';
import { MovieInfo } from '../MovieInfo';
import { ReviewSection } from './components/ReviewSection/ReviewSection';
import { SimilarMovies } from './components/SimilarMovies/SimilarMovies';
import { ReviewStoreProvider } from './model';
import s from './Movie.module.scss';
import LoadingPage from '../../loading';

const Movie = observer(() => {
  const router = useRouter();
  const { loadingStage, movie } = useMovieStore();

  if (loadingStage.isLoading) return <LoadingPage />;

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
    <ReviewStoreProvider movieId={movie.id}>
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

          <motion.div variants={itemVariants} className={s.movie__info}>
            <MovieInfo movie={movie} />
          </motion.div>
        </motion.div>
      </motion.div>

      <ReviewSection />

      <SimilarMovies />
    </ReviewStoreProvider>
  );
});

export default function MovieWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <Movie />
    </Suspense>
  );
}
