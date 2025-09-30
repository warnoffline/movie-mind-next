'use client';

import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { Loading } from '@/components/Loading';
import { MovieList } from '@/components/MovieList';
import { Text } from '@/components/Text';

import s from './SimilarMovies.module.scss';
import { useMovieStore } from '../../../../model';
import { containerVariants } from '../../config';

export const SimilarMovies = observer(() => {
  const { similarLoadingStage, similarMovies } = useMovieStore();
  return (
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
  );
});
