'use client';

import React from 'react';

import { FavoriteButton } from '@/components/FavoriteButton';
import { GenreTags } from '@/components/GenreTags';
import { Text } from '@/components/Text';
import type { IMovie } from '@/types/movies';

import { getMeta, getRatings } from './constants';
import s from './MovieInfo.module.scss';

type MovieInfoProps = {
  movie: IMovie;
};

export const MovieInfo: React.FC<MovieInfoProps> = ({ movie }) => {
  const ratings = getRatings(movie);
  const meta = getMeta(movie);

  return (
    <div className={s.movie__info}>
      <Text view="title" color="primary">
        {movie.name} ({movie.year})
      </Text>

      <GenreTags genres={movie.genres} isFull />

      {movie.description && (
        <Text view="p-16" color="primary" className={s.description}>
          {movie.description}
        </Text>
      )}
      {movie.trailerUrl && (
        <div>
          <iframe
            className={s.movie__trailer}
            src={movie.trailerUrl}
            allow="autoplay; clipboard-write"
            allowFullScreen
            title="Movie trailer"
          />
        </div>
      )}

      <div className={s.meta}>
        <div className={s.meta__item}>
          <Text color="primary" className={s.label}>
            Рейтинги:
          </Text>
          <div className={s.ratings}>
            {ratings.map((r) => (
              <Text key={r.label} color="primary">
                {r.label}: {r.value}
              </Text>
            ))}
          </div>
        </div>

        {meta.map((m) => (
          <div key={m.label} className={s.meta__item}>
            <Text color="primary" className={s.label}>
              {m.label}:
            </Text>
            <Text color="primary">{m.value}</Text>
          </div>
        ))}
      </div>

      <div>
        <FavoriteButton movieId={Number(movie.id)} />
      </div>
    </div>
  );
};
