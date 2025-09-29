'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { Suspense } from 'react';

import { type IMovieShort } from '@/types/movies';

import { Card } from '../Card';
import s from './MovieList.module.scss';
import { FavoriteButton } from '../FavoriteButton';
import { GenreTags } from '../GenreTags';
import { containerVariants, itemVariants } from './config';

type MovieListProps = {
  movies: IMovieShort[];
};

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  const router = useRouter();

  return (
    <motion.div
      className={s.movies__list}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {movies.map((movie) => (
        <motion.div key={movie.id} variants={itemVariants} whileTap={{ scale: 0.99 }} layout>
          <Card
            title={movie.title}
            image={movie.posterUrl}
            subtitle={movie.description}
            captionSlot={<GenreTags genres={movie.genres} />}
            onClick={() => router.push(`/movies/${movie.id}`)}
            actionSlot={
              <div>
                <FavoriteButton movieId={movie.id} />
              </div>
            }
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default function MovieListWrapper(props: MovieListProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MovieList {...props} />
    </Suspense>
  );
}
